import { API_URL } from "../config/api";

export async function testBackend() {
  try {
    const response = await fetch(`${API_URL}/health`);

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Backend connection error:", error);

    throw error;
  }
}