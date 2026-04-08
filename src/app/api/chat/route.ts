import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText, tool, convertToModelMessages } from "ai";
import { z } from "zod";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "Gemini API key not configured." }),
        { status: 500 },
      );
    }

    const google = createGoogleGenerativeAI({ apiKey });

    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

    const result = streamText({
      model: google("gemini-2.5-flash"),

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

      tools: {
        searchCourts: tool({
          description: "Search for available sports courts based on filters",

          inputSchema: z.object({
            searchTerm: z
              .string()
              .optional()
              .describe("Sport type or court name"),
            location: z.string().optional().describe("City or area"),
            maxPrice: z.number().optional().describe("Maximum price"),
          }),

          // TypeScript fix
          async execute({ searchTerm, location, maxPrice }) {
            try {
              const queryParams = new URLSearchParams();

              if (searchTerm) {
                queryParams.append("searchTerm", searchTerm);
              }

              if (location) {
                queryParams.append("location", location);
              }

              if (maxPrice) {
                queryParams.append("basePrice_lte", maxPrice.toString());
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
