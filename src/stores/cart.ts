import { computed } from "nanostores";
import { persistentAtom } from "@nanostores/persistent";

export type CartItemKind = "merch" | "ticket";

export interface CartItem {
  /** Square catalog object id for the variation — the line item id used at checkout. */
  catalogObjectId: string;
  kind: CartItemKind;
  /** Product or movie name. */
  name: string;
  /** Size (merch) or showtime label (ticket). */
  variationName: string;
  amountCents: number;
  currency: string;
  quantity: number;
}

function encode(items: CartItem[]): string {
  return JSON.stringify(items);
}

function decode(raw: string): CartItem[] {
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export const cartItems = persistentAtom<CartItem[]>("cicada-cart", [], {
  encode,
  decode,
});

export const cartCount = computed(cartItems, (items) =>
  items.reduce((sum, item) => sum + item.quantity, 0),
);

export const cartTotalCents = computed(cartItems, (items) =>
  items.reduce((sum, item) => sum + item.amountCents * item.quantity, 0),
);

export function addToCart(
  item: Omit<CartItem, "quantity">,
  quantity = 1,
): void {
  const current = cartItems.get();
  const existingIndex = current.findIndex(
    (i) => i.catalogObjectId === item.catalogObjectId,
  );

  if (existingIndex >= 0) {
    const next = [...current];
    next[existingIndex] = {
      ...next[existingIndex],
      quantity: next[existingIndex].quantity + quantity,
    };
    cartItems.set(next);
  } else {
    cartItems.set([...current, { ...item, quantity }]);
  }
}

export function updateQuantity(
  catalogObjectId: string,
  quantity: number,
): void {
  const current = cartItems.get();
  if (quantity <= 0) {
    cartItems.set(current.filter((i) => i.catalogObjectId !== catalogObjectId));
    return;
  }
  cartItems.set(
    current.map((i) =>
      i.catalogObjectId === catalogObjectId ? { ...i, quantity } : i,
    ),
  );
}

export function removeFromCart(catalogObjectId: string): void {
  cartItems.set(
    cartItems.get().filter((i) => i.catalogObjectId !== catalogObjectId),
  );
}

export function clearCart(): void {
  cartItems.set([]);
}
