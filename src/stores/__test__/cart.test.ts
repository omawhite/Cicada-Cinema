import { describe, it, expect, beforeEach } from "vitest";
import {
  cartItems,
  cartCount,
  cartTotalCents,
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
} from "../cart";

const tee: Omit<import("../cart").CartItem, "quantity"> = {
  catalogObjectId: "var-tee-m",
  kind: "merch",
  name: "Cicada Tee",
  variationName: "Medium",
  amountCents: 2500,
  currency: "USD",
};

const ticket: Omit<import("../cart").CartItem, "quantity"> = {
  catalogObjectId: "var-screening-1",
  kind: "ticket",
  name: "Bicycle Thieves",
  variationName: "Fri 7:00 PM",
  amountCents: 1500,
  currency: "USD",
};

beforeEach(() => {
  clearCart();
});

describe("addToCart", () => {
  it("adds a new item with the given quantity", () => {
    addToCart(tee, 2);
    expect(cartItems.get()).toEqual([{ ...tee, quantity: 2 }]);
  });

  it("defaults quantity to 1", () => {
    addToCart(tee);
    expect(cartItems.get()[0].quantity).toBe(1);
  });

  it("merges quantities when the same catalog object is added again", () => {
    addToCart(tee, 1);
    addToCart(tee, 2);
    expect(cartItems.get()).toHaveLength(1);
    expect(cartItems.get()[0].quantity).toBe(3);
  });

  it("keeps distinct items separate", () => {
    addToCart(tee, 1);
    addToCart(ticket, 1);
    expect(cartItems.get()).toHaveLength(2);
  });
});

describe("updateQuantity", () => {
  it("sets the quantity for an existing item", () => {
    addToCart(tee, 1);
    updateQuantity(tee.catalogObjectId, 5);
    expect(cartItems.get()[0].quantity).toBe(5);
  });

  it("removes the item when the quantity is set to zero", () => {
    addToCart(tee, 1);
    updateQuantity(tee.catalogObjectId, 0);
    expect(cartItems.get()).toHaveLength(0);
  });

  it("removes the item when the quantity is negative", () => {
    addToCart(tee, 1);
    updateQuantity(tee.catalogObjectId, -1);
    expect(cartItems.get()).toHaveLength(0);
  });
});

describe("removeFromCart", () => {
  it("removes only the matching item", () => {
    addToCart(tee, 1);
    addToCart(ticket, 1);
    removeFromCart(tee.catalogObjectId);
    expect(cartItems.get()).toEqual([{ ...ticket, quantity: 1 }]);
  });
});

describe("clearCart", () => {
  it("empties the cart", () => {
    addToCart(tee, 1);
    addToCart(ticket, 1);
    clearCart();
    expect(cartItems.get()).toEqual([]);
  });
});

describe("cartCount", () => {
  it("sums quantities across all items", () => {
    addToCart(tee, 2);
    addToCart(ticket, 3);
    expect(cartCount.get()).toBe(5);
  });

  it("is zero for an empty cart", () => {
    expect(cartCount.get()).toBe(0);
  });
});

describe("cartTotalCents", () => {
  it("sums price times quantity across all items", () => {
    addToCart(tee, 2); // 2500 * 2 = 5000
    addToCart(ticket, 1); // 1500 * 1 = 1500
    expect(cartTotalCents.get()).toBe(6500);
  });
});
