export interface Money {
  amountCents: number;
  currency: string;
}

interface RawMoney {
  amount?: bigint | null;
  currency?: string | null;
}

/**
 * Converts a Square `Money` value (a bigint cent amount) into a plain shape
 * that's safe to JSON-serialize across the server/client boundary. Returns
 * null when there's no usable amount, since callers treat that as "skip".
 */
export function parseMoney(money?: RawMoney | null): Money | null {
  if (money?.amount === undefined || money.amount === null) return null;
  return {
    amountCents: Number(money.amount),
    currency: money.currency ?? "USD",
  };
}

export function formatPrice({ amountCents, currency }: Money): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amountCents / 100);
}
