import { describe, it, expect } from "vitest";
import { parseMoney, formatPrice } from "../money";

describe("parseMoney", () => {
  it("converts a bigint amount to a plain number of cents", () => {
    expect(parseMoney({ amount: 2500n, currency: "USD" })).toEqual({
      amountCents: 2500,
      currency: "USD",
    });
  });

  it("defaults currency to USD when missing", () => {
    expect(parseMoney({ amount: 100n })).toEqual({
      amountCents: 100,
      currency: "USD",
    });
  });

  it("returns null when amount is missing", () => {
    expect(parseMoney({ currency: "USD" })).toBeNull();
  });

  it("returns null when amount is null", () => {
    expect(parseMoney({ amount: null })).toBeNull();
  });

  it("returns null when given undefined", () => {
    expect(parseMoney(undefined)).toBeNull();
  });

  it("preserves a zero amount rather than treating it as missing", () => {
    expect(parseMoney({ amount: 0n, currency: "USD" })).toEqual({
      amountCents: 0,
      currency: "USD",
    });
  });
});

describe("formatPrice", () => {
  it("formats whole dollar amounts", () => {
    expect(formatPrice({ amountCents: 2500, currency: "USD" })).toBe("$25.00");
  });

  it("formats amounts with cents", () => {
    expect(formatPrice({ amountCents: 1999, currency: "USD" })).toBe("$19.99");
  });

  it("formats zero", () => {
    expect(formatPrice({ amountCents: 0, currency: "USD" })).toBe("$0.00");
  });
});
