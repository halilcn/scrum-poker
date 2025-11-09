import { NextResponse } from "next/server";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { SPRINT_NAME_GENERATION_PROMPT } from "@/constants/prompts";

export async function POST(request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { text } = body;

    // Validate input
    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Text is required and must be a string" },
        { status: 400 }
      );
    }

    // Check for Gemini API key
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key is not configured" },
        { status: 500 }
      );
    }

    // Set API key as environment variable for @ai-sdk/google
    // The package checks GOOGLE_GENERATIVE_AI_API_KEY by default
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = apiKey;

    // Prepare the prompt with user text
    const prompt = SPRINT_NAME_GENERATION_PROMPT.replace("{userText}", text);

    // Generate sprint names using Gemini AI
    const { text: aiResponse } = await generateText({
      model: google("gemini-1.5-flash-latest", {
        apiKey: apiKey,
      }),
      prompt: prompt,
      maxTokens: 500,
      temperature: 0.8, // Higher creativity
    });

    // Parse AI response to extract single sprint name
    const sprintName = aiResponse.trim();

    // If AI didn't return a valid name, add fallback
    if (!sprintName || sprintName.length === 0) {
      throw new Error("AI did not generate a valid sprint name");
    }

    // Response with single AI-generated sprint name
    const response = {
      success: true,
      data: {
        sprintName,
      },
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error generating sprint names:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error while generating sprint names",
      },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed. Use POST instead." },
    { status: 405 }
  );
}
