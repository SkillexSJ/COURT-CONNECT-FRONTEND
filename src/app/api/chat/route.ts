import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText, tool, convertToModelMessages, stepCountIs } from "ai";
import { z } from "zod";

export const maxDuration = 30;
const MAX_CONTEXT_MESSAGES = 10;

type ChatIntent = "court-search" | "help-qa" | "small-talk" | "general";

type CourtItem = {
  id: string;
  slug: string;
  name: string;
  type: string;
  basePrice: number;
  locationLabel: string;
};

const HELP_TOPICS: Record<string, string> = {
  commands:
    "Available commands:\n- /help: Show assistant help\n- /commands: List available commands\n- /booking: Booking guidance\n- /payment: Payment guidance\n- /organizer: Organizer dashboard guidance\n\nYou can also ask in plain language.",
  booking:
    "To book a court: 1) Open a venue page, 2) pick date and slot, 3) confirm booking, 4) complete payment if required. If a slot is unavailable, try another time or venue.",
  payment:
    "Payments are handled securely through the checkout flow. If payment fails, verify your card details and balance, then retry. If amount is deducted without confirmation, contact support with booking time and transaction reference.",
  organizer:
    "Organizer quick help: manage courts, availability, pricing, and media from your dashboard. Keep slots and pricing up to date to improve bookings.",
  support:
    "If you still face issues, contact support with: your account email, the action you attempted, and a screenshot/error time.",
};

const SEARCH_INTENT_REGEX =
  /\b(find|search|show|list|available|recommend|nearby|cheapest|best|court|courts|venue|venues|book)\b/i;
const HELP_INTENT_REGEX =
  /(^\/help$|^\/commands$|^\/booking$|^\/payment$|^\/organizer$|\bhelp\b|\bhow to\b|\bguide\b|\bfaq\b|\bquestion\b)/i;
const SMALL_TALK_REGEX =
  /\b(hi|hello|hey|thanks|thank you|good morning|good evening|bye)\b/i;

const extractMessageText = (message: unknown): string => {
  if (!message || typeof message !== "object") return "";

  const candidate = message as {
    role?: string;
    content?: string;
    parts?: Array<{ type?: string; text?: string }>;
  };

  if (typeof candidate.content === "string" && candidate.content.trim()) {
    return candidate.content;
  }

  if (!Array.isArray(candidate.parts)) return "";

  return candidate.parts
    .filter((part) => part?.type === "text" && typeof part.text === "string")
    .map((part) => part.text?.trim() || "")
    .join(" ")
    .trim();
};

const getLastUserText = (messages: unknown[]): string => {
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    const raw = messages[i];

    if (!raw || typeof raw !== "object") continue;

    const candidate = raw as { role?: string };

    if (candidate.role !== "user") continue;

    const text = extractMessageText(raw);
    if (text) return text;
  }

  return "";
};

const detectIntent = (text: string): ChatIntent => {
  const normalized = text.trim().toLowerCase();

  if (!normalized) return "general";
  if (HELP_INTENT_REGEX.test(normalized)) return "help-qa";
  if (SEARCH_INTENT_REGEX.test(normalized)) return "court-search";
  if (SMALL_TALK_REGEX.test(normalized)) return "small-talk";
  return "general";
};

const getHelpTopicFromText = (text: string) => {
  const normalized = text.trim().toLowerCase();

  if (normalized.includes("/commands") || normalized.includes("command")) {
    return "commands";
  }
  if (normalized.includes("/booking") || normalized.includes("booking")) {
    return "booking";
  }
  if (normalized.includes("/payment") || normalized.includes("payment")) {
    return "payment";
  }
  if (normalized.includes("/organizer") || normalized.includes("organizer")) {
    return "organizer";
  }

  return "support";
};

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "OpenRouter API key not configured." }),
        { status: 500 },
      );
    }

    const openrouter = createOpenRouter({ apiKey });

    const backendUrl =
      process.env.BACKEND_URL ||
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      "http://localhost:5000";

    const recentMessages = Array.isArray(messages)
      ? messages.slice(-MAX_CONTEXT_MESSAGES)
      : [];

    const lastUserText = getLastUserText(recentMessages);
    const intent = detectIntent(lastUserText);

    const maxOutputTokensByIntent: Record<ChatIntent, number> = {
      "court-search": 260,
      "help-qa": 320,
      "small-talk": 120,
      general: 420,
    };

    const maxStepsByIntent: Record<ChatIntent, number> = {
      "court-search": 3,
      "help-qa": 2,
      "small-talk": 1,
      general: 2,
    };

    const intentHint =
      intent === "court-search"
        ? "Current intent: COURT_SEARCH. Use 'searchCourts' when filtering/listing courts is requested."
        : intent === "help-qa"
          ? "Current intent: HELP_QA. Prefer concise guidance and use 'helpQA' for command/help questions."
          : intent === "small-talk"
            ? "Current intent: SMALL_TALK. Reply briefly and do not call tools."
            : "Current intent: GENERAL_QA. Be concise and avoid tools unless truly needed.";

    const result = streamText({
      model: openrouter("z-ai/glm-4.5-air:free"),
      maxRetries: 0,
      maxOutputTokens: maxOutputTokensByIntent[intent],

      system: `You are CourtConnect's smart AI assistant named "CourtBot".
You help users find sports facilities and courts.

Rules:
- Be concise, friendly, and helpful
- NEVER make up court data
- Use the 'searchCourts' tool ONLY when the user asks to discover/find/list/recommend courts
- Do NOT call tools for greetings, thanks, or general small talk
- Use 'helpQA' for user help/commands such as /help, /commands, booking help, payment help, and organizer help
- Format responses in clean markdown
- Link courts like: [Court Name](/venues/slug)
- If no results, politely suggest refining search

${intentHint}`,

      messages: await convertToModelMessages(recentMessages),

      stopWhen: stepCountIs(maxStepsByIntent[intent]),

      tools: {
        searchCourts: tool({
          description: "Search for available sports courts based on filters",

          inputSchema: z.object({
            searchTerm: z
              .string()
              .optional()
              .describe(
                "Search query for name or location (e.g., 'Nevada', 'Dhaka', 'Downtown')",
              ),
            type: z
              .string()
              .optional()
              .describe(
                "Specific sport type (e.g., 'Tennis', 'Badminton', 'Futsal', 'Clay Court')",
              ),
            maxPrice: z.coerce
              .number()
              .optional()
              .describe("Maximum price limit"),
            sortBy: z
              .enum(["-rating", "basePrice", "-basePrice"])
              .optional()
              .describe(
                "Sort order. Use '-rating' for 'best'/'popular', 'basePrice' for 'cheapest', '-basePrice' for 'most expensive'.",
              ),
          }),

          // TypeScript fix
          async execute({ searchTerm, type, maxPrice, sortBy }) {
            try {
              const queryParams = new URLSearchParams();

              // Use searchTerm for purely the name
              if (searchTerm) {
                queryParams.append("searchTerm", searchTerm);
              }

              // Use the actual 'type'
              if (type) {
                queryParams.append("type", type);
              }

              if (maxPrice !== undefined) {
                queryParams.append("basePrice_lte", maxPrice.toString());
              }

              if (sortBy) {
                queryParams.append("sortBy", sortBy);
              }

              const url = `${backendUrl}/api/courts?${queryParams.toString()}`;

              const res = await fetch(url);

              if (!res.ok) {
                return {
                  success: false,
                  message: "Failed to fetch courts from backend.",
                };
              }

              const data = await res.json();

              const courts = Array.isArray(data?.data) ? data.data : [];

              return {
                success: true,
                courts: courts.slice(0, 5).map((court: CourtItem) => ({
                  id: court.id,
                  slug: court.slug,
                  name: court.name,
                  type: court.type,
                  price: court.basePrice,
                  location: court.locationLabel,
                })),
              };
            } catch {
              return {
                success: false,
                message: "Error retrieving courts.",
              };
            }
          },
        }),
        helpQA: tool({
          description:
            "Provides built-in CourtConnect help answers for user Q/A commands and common guidance.",
          inputSchema: z.object({
            topic: z
              .enum(["commands", "booking", "payment", "organizer", "support"])
              .optional()
              .describe("Help topic to retrieve"),
            question: z
              .string()
              .optional()
              .describe("Original user question for topic detection"),
          }),
          async execute({ topic, question }) {
            const resolvedTopic =
              topic || getHelpTopicFromText(question || lastUserText);

            return {
              success: true,
              topic: resolvedTopic,
              answer: HELP_TOPICS[resolvedTopic] || HELP_TOPICS.support,
            };
          },
        }),
      },
    });

    return result.toUIMessageStreamResponse();
  } catch {
    return new Response(JSON.stringify({ error: "Unexpected server error." }), {
      status: 500,
    });
  }
}
