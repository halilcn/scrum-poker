// API Client - Centralized API request methods
import apiClient from "./setup";

// Sprint Name Generation API
export const generateSprintName = async (text) => {
  if (!text || typeof text !== "string") {
    throw new Error("Text is required and must be a string");
  }

  try {
    const response = (
      await apiClient.post("/api/sprint-name/generate", { text })
    ).data;
    return response.data.sprintName;
  } catch (error) {
    // Axios error handling
    if (error.response) {
      // Server responded with error status
      throw new Error(
        error.response.data?.error || `Server error: ${error.response.status}`
      );
    } else if (error.request) {
      // Request was made but no response received
      throw new Error("Network error: No response from server");
    } else {
      // Something else happened
      throw new Error(error.message || "Unexpected error occurred");
    }
  }
};

export default {
  generateSprintName,
};
