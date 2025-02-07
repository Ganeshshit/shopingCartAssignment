import { fetchProductPrice } from "./api";
import { CartItem, CartState } from "./types";

export class ShoppingCart {
  private cart: CartState;

  constructor() {
    this.cart = { items: [], subtotal: 0, tax: 0, total: 0 };
  }

  async addProduct(productName: string, quantity: number): Promise<void> {
    if (quantity <= 0) {
      console.error('Quantity must be greater than zero.');
      return;
    }

    try {
      const price = await fetchProductPrice(productName);

      const existingItem = this.cart.items.find(item => item.name === productName);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        this.cart.items.push({ name: productName, price, quantity });
      }

      this.calculateTotals();
    } catch (error) {
      console.error(`Error fetching price for ${productName}:`, error);
    }
  }

  private calculateTotals(): void {
    this.cart.subtotal = this.cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    this.cart.tax = parseFloat((this.cart.subtotal * 0.125).toFixed(2));
    this.cart.total = parseFloat((this.cart.subtotal + this.cart.tax).toFixed(2));
  }


  getCartState(): CartState {
    return this.cart;
  }

  printCart(): void {
    console.log('Cart Contents:');
    this.cart.items.forEach(item => {
      console.log(`- ${item.quantity} x ${item.name} @ $${item.price.toFixed(2)} each`);
    });
    console.log(`Subtotal: $${this.cart.subtotal.toFixed(2)}`);
    console.log(`Tax (12.5%): $${this.cart.tax.toFixed(2)}`);
    console.log(`Total: $${this.cart.total.toFixed(2)}`);
  }


  clearCart(): void {
    this.cart = { items: [], subtotal: 0, tax: 0, total: 0 };
  }
}

