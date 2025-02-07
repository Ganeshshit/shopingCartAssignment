import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { ShoppingCart } from "../src/cart";
import * as api from "../src/api";
jest.mock("../src/api");

const mockFetchProductPrice = api.fetchProductPrice as jest.MockedFunction<typeof api.fetchProductPrice>;

describe("ShoppingCart", () => {
  let cart: ShoppingCart;

  beforeEach(() => {
    cart = new ShoppingCart();
    mockFetchProductPrice.mockReset();
  });

  it("should add a product to the cart and calculate totals", async () => {
    mockFetchProductPrice.mockResolvedValue(2.52);

    await cart.addProduct("cornflakes", 2);

    const cartState = cart.getCartState();
    expect(cartState.subtotal).toBe(5.04);
    expect(cartState.tax).toBe(0.63);
    expect(cartState.total).toBe(5.67);
  });

  it("should handle adding multiple different products", async () => {
    mockFetchProductPrice
      .mockResolvedValueOnce(2.52)
      .mockResolvedValueOnce(9.98);

    await cart.addProduct("cornflakes", 1);
    await cart.addProduct("weetabix", 1);

    const cartState = cart.getCartState();
    expect(cartState.subtotal).toBe(12.5);
    expect(cartState.tax).toBe(1.56);
    expect(cartState.total).toBe(14.06);
  });

  it("should not add a product with non-positive quantity", async () => {
    await cart.addProduct("cornflakes", 0);
    const cartState = cart.getCartState();
    expect(cartState.items.length).toBe(0);
  });

  it("should throw an error if the price API fails", async () => {
    mockFetchProductPrice.mockRejectedValue(new Error("API error"));

    await expect(cart.addProduct("frosties", 1)).rejects.toThrow("API error");
    const cartState = cart.getCartState();
    expect(cartState.items.length).toBe(0);
  });
});
