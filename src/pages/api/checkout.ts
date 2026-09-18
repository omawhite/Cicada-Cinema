import type { APIRoute } from "astro";
import { createPaymentLinkForCart, type CartLineItem } from "@/lib/square";

export const prerender = false;

function isCartLineItem(value: unknown): value is CartLineItem {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as CartLineItem).catalogObjectId === "string" &&
    typeof (value as CartLineItem).quantity === "number" &&
    (value as CartLineItem).quantity > 0
  );
}

export const POST: APIRoute = async ({ request }) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request body." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const items = (body as { items?: unknown }).items;
  if (!Array.isArray(items) || !items.every(isCartLineItem)) {
    return new Response(JSON.stringify({ error: "Invalid cart items." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const result = await createPaymentLinkForCart(items);
  return new Response(JSON.stringify(result), {
    status: "error" in result ? 400 : 200,
    headers: { "Content-Type": "application/json" },
  });
};
