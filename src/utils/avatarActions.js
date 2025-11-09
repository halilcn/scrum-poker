import { uploadBase64ImageToStorage } from "@/lib/firebase/actions";

/**
 * Generate AI avatar using Gemini API and upload to Firebase Storage
 * @param {string} userId - User ID for unique filename
 * @param {string} customPrompt - Optional custom prompt for avatar generation
 * @returns {Promise<string>} Download URL of the uploaded avatar image
 */
export async function generateAIAvatar(userId, customPrompt = null) {
  try {
    // Call Next.js API route to generate avatar
    const response = await fetch("/api/generate-avatar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        prompt: customPrompt,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to generate avatar");
    }

    const data = await response.json();
    
    if (!data.success || !data.base64Image) {
      throw new Error("Invalid response from avatar generation API");
    }

    // Upload base64 image to Firebase Storage
    const downloadURL = await uploadBase64ImageToStorage(
      data.base64Image,
      userId
    );

    return downloadURL;
  } catch (error) {
    console.error("Error in generateAIAvatar:", error);
    throw error;
  }
}

