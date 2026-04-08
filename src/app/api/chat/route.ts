import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText, tool, convertToModelMessages, stepCountIs } from "ai";
import { z } from "zod";

export const maxDuration = 30;

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
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

    const result = streamText({
      model: openrouter("meta-llama/llama-3.3-70b-instruct:free"),
      maxRetries: 0,

      system: `You are CourtConnect's smart AI assistant named "CourtBot".
You help users find sports facilities and courts.

Rules:
- Be concise, friendly, and helpful
- NEVER make up court data
- ALWAYS use the 'searchCourts' tool when user asks for courts
- Format responses in clean markdown
- Link courts like: [Court Name](/venues/slug)
- If no results, politely suggest refining search`,

      messages: await convertToModelMessages(messages),

      stopWhen: stepCountIs(5), // steps for thinking

      tools: {
        searchCourts: tool({
          description: "Search for available sports courts based on filters",

          inputSchema: z.object({
            searchTerm: z
              .string()
              .optional()
              .describe("Search query for name or location (e.g., 'Nevada', 'Dhaka', 'Downtown')"),
            type: z.string().optional().describe("Specific sport type (e.g., 'Tennis', 'Badminton', 'Futsal', 'Clay Court')"),
            maxPrice: z.number().optional().describe("Maximum price limit"),
            sortBy: z.enum(["-rating", "basePrice", "-basePrice"]).optional().describe("Sort order. Use '-rating' for 'best'/'popular', 'basePrice' for 'cheapest', '-basePrice' for 'most expensive'."),
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

              if (maxPrice) {
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

              const courts = data?.data?.data ?? [];

              return {
                success: true,
                courts: courts.slice(0, 5).map((court: any) => ({
                  id: court.id,
                  slug: court.slug,
                  name: court.name,
                  type: court.type,
                  price: court.basePrice,
                  location: court.locationLabel,
                })),
              };
            } catch (error) {
              return {
                success: false,
                message: "Error retrieving courts.",
              };
            }
          },
        }),
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    return new Response(JSON.stringify({ error: "Unexpected server error." }), {
      status: 500,
    });
  }
}
