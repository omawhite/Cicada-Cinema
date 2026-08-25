import { SquareClient, SquareEnvironment, SquareError } from "square";
import {
  mapItemToScreeningMovie,
  type ScreeningMovie,
  type RawItem,
} from "./catalog";

const SCREENINGS_CATEGORY_NAME = "Screenings";

function getSquareClient(): SquareClient | null {
  const token = import.meta.env.SQUARE_ACCESS_TOKEN;
  if (!token) {
    console.error("SQUARE_ACCESS_TOKEN is not configured");
    return null;
  }
  return new SquareClient({
    token,
    environment:
      import.meta.env.SQUARE_ENVIRONMENT === "production"
        ? SquareEnvironment.Production
        : SquareEnvironment.Sandbox,
  });
}

function logSquareError(action: string, err: unknown): void {
  if (err instanceof SquareError) {
    console.error(
      `Square API error while trying to ${action} (status ${err.statusCode})`,
      err.errors,
    );
  } else {
    console.error(`Unexpected error while trying to ${action}`, err);
  }
}

async function resolveCategoryId(
  client: SquareClient,
  name: string,
): Promise<string | null> {
  const categories = await client.catalog.list({ types: "CATEGORY" });
  console.log(categories);
  for await (const obj of categories) {
    if (obj.type === "CATEGORY" && obj.categoryData?.name === name) {
      return obj.id ?? null;
    }
  }
  console.error(
    `Square category "${name}" was not found — has it been created in the Sandbox dashboard?`,
  );
  return null;
}

async function searchItemsByCategory(
  client: SquareClient,
  categoryId: string,
): Promise<RawItem[]> {
  const items: RawItem[] = [];
  let cursor: string | undefined;
  do {
    const res = await client.catalog.searchItems({
      categoryIds: [categoryId],
      cursor,
      limit: 100,
    });
    // searchItems is documented to return only ITEM objects, which structurally satisfy RawItem.
    items.push(...((res.items ?? []) as unknown as RawItem[]));
    cursor = res.cursor;
  } while (cursor);
  return items;
}

export async function getScreeningMovies(): Promise<ScreeningMovie[]> {
  const client = getSquareClient();
  if (!client) return [];
  try {
    const categoryId = await resolveCategoryId(
      client,
      SCREENINGS_CATEGORY_NAME,
    );
    if (!categoryId) return [];
    const items = await searchItemsByCategory(client, categoryId);
    return items
      .map(mapItemToScreeningMovie)
      .filter((movie): movie is ScreeningMovie => movie !== null);
  } catch (err) {
    logSquareError("fetch screening movies", err);
    return [];
  }
}

export interface CartLineItem {
  catalogObjectId: string;
  quantity: number;
}

export type CheckoutResult = { url: string } | { error: string };

/** Builds a single ad-hoc Order from the whole cart and returns a hosted Payment Link to redirect to. */
export async function createPaymentLinkForCart(
  items: CartLineItem[],
): Promise<CheckoutResult> {
  if (items.length === 0) {
    return { error: "Your cart is empty." };
  }

  const client = getSquareClient();
  if (!client) {
    return { error: "Square is not configured." };
  }

  const locationId = import.meta.env.SQUARE_LOCATION_ID;
  if (!locationId) {
    console.error("SQUARE_LOCATION_ID is not configured");
    return { error: "Square is not configured." };
  }

  try {
    const { paymentLink } = await client.checkout.paymentLinks.create({
      idempotencyKey: crypto.randomUUID(),
      order: {
        locationId,
        lineItems: items.map((item) => ({
          catalogObjectId: item.catalogObjectId,
          quantity: String(item.quantity),
        })),
      },
    });

    if (!paymentLink?.url) {
      return { error: "Square did not return a checkout link." };
    }
    return { url: paymentLink.url };
  } catch (err) {
    logSquareError("create a payment link", err);
    return { error: "Could not start checkout. Please try again." };
  }
}
