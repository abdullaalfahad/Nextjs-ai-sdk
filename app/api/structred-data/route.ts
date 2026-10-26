import { createOpenAI } from "@ai-sdk/openai";
import {
  createTextStreamResponse,
  Output,
  streamText,
  toTextStream,
} from "ai";
import { recipeSchema } from "./schema";

const openrouter = createOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

export async function POST(request: Request) {
  try {
    const { dish } = await request.json();

    if (typeof dish !== "string" || !dish.trim()) {
      return new Response(JSON.stringify({ error: "Dish is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const result = streamText({
      model: openrouter("openrouter/auto"),
      output: Output.object({ schema: recipeSchema }),
      prompt: `Create a recipe for ${dish}`,
    });

    return createTextStreamResponse({
      stream: toTextStream({ stream: result.stream }),
    });
  } catch (error) {
    console.error("Structured data error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Internal server error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
