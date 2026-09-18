import { describe, it, expect } from "vitest";
import { createPaymentLinkForCart } from "../square";

describe("createPaymentLinkForCart", () => {
  it("returns an error without calling Square when the cart is empty", async () => {
    const result = await createPaymentLinkForCart([]);
    expect(result).toEqual({ error: "Your cart is empty." });
  });
});
