import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request) {
  try {
    const { userId, prompt } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Check if API key is configured
    if (!process.env.NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key is not configured" },
        { status: 500 }
      );
    }

    // Initialize Google Gemini AI
    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY);

    // Default prompt for avatar generation
    const avatarPrompt = prompt || 
      "Create a professional, friendly avatar image for a user. The avatar should be colorful, modern, and suitable for a professional scrum poker planning application. Make it cartoon-style with a clean, simple design.";

    // Generate image using Gemini Image Generation model
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-preview-image-generation"
    });
    
    // Generate content with proper configuration
    // Model requires both IMAGE and TEXT modalities
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: avatarPrompt }] }],
      generationConfig: {
        responseModalities: ["IMAGE", "TEXT"]
      }
    });
    const response = await result.response;

    // Extract base64 image from response
    let base64Image = null;
    
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        base64Image = part.inlineData.data;
        break;
      }
    }

    if (!base64Image) {
      return NextResponse.json(
        { error: "Failed to generate image" },
        { status: 500 }
      );
    }

    // Return base64 image
    return NextResponse.json({
      success: true,
      base64Image,
      userId,
    });

  } catch (error) {
    console.error("Error generating avatar:", error);
    return NextResponse.json(
      { 
        error: "Failed to generate avatar",
        details: error.message 
      },
      { status: 500 }
    );
  }
}




