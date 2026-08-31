import { API_URL } from "../config/api";


export async function testBackend() {

  const response = await fetch(
    `${API_URL}/health`
  );

  if (!response.ok) {
    throw new Error(
      `Backend error: ${response.status}`
    );
  }

  return response.json();
}


export async function getLiveXAUPrice() {

  const response = await fetch(
    `${API_URL}/prices/live`
  );

  if (!response.ok) {
    throw new Error(
      `Price API error: ${response.status}`
    );
  }

  return response.json();
}