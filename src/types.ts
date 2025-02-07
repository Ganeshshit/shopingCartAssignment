export interface CartItem {
  name: string;
  price: number;
  quantity: number;
}
export interface CartState {
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
}