import axios from "axios";

const BASE_URL = "http://localhost:3001";

export async function fetchProductPrice(productName: string): Promise<number> {
  try {
    const response = await axios.get(`${BASE_URL}/products/${productName}`);
    if (response.data && typeof response.data.price === "number") {
      return response.data.price;
    } else {
      throw new Error("Invalid response format from API");
    }
  } catch (error) {
    throw new Error(
      `Failed to fetch price for ${productName}: ${error.message}`
    );
  }
}
