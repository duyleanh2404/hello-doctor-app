export const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorResponse = await response.json();
    throw new Error(errorResponse.message || "An error occurred during the API request!");
  }
  return await response.json();
};