import { createOpenAI } from "@ai-sdk/openai";
import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from "ai";

const openrouter = createOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

// A model that accepts images and PDFs. "openrouter/auto" may route to a
// text-only model, so the multimodal route pins a vision-capable one.
const MULTIMODAL_MODEL = "google/gemini-2.5-flash";

const ALLOWED_MEDIA_TYPES = /^(image\/.+|application\/pdf)$/;

export async function POST(request: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await request.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "Messages are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const hasUnsupportedFile = messages.some((message) =>
      message.parts.some(
        (part) => part.type === "file" && !ALLOWED_MEDIA_TYPES.test(part.mediaType)
      )
    );

    if (hasUnsupportedFile) {
      return new Response(
        JSON.stringify({ error: "Only images and PDF files are supported" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const result = streamText({
      // Chat Completions API: images go as image_url, PDFs as file parts.
      model: openrouter.chat(MULTIMODAL_MODEL),
      system:
        "You are a helpful assistant that can read images and PDF documents the user attaches. Describe, summarize, or answer questions about them concisely.",
      messages: await convertToModelMessages(messages),
      // OpenRouter reserves max_tokens against the account balance, so cap it
      // rather than letting it default to the model's full output limit.
      maxOutputTokens: 2048,
    });

    return createUIMessageStreamResponse({
      stream: toUIMessageStream({
        stream: result.stream,
        // Forward the provider's error text so the UI shows the real cause.
        onError: (error) =>
          error instanceof Error ? error.message : "Unknown error",
      }),
    });
  } catch (error) {
    console.error("Multimodal error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Internal server error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
