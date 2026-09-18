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

/**
 * Fetches every catalog ITEM along with a lookup of related IMAGE object
 * URLs. `searchItems` (which supports server-side category filtering) has no
 * way to include related objects like images, so this uses the more general
 * `search` instead and leaves category filtering to the caller.
 */
async function fetchItemsWithImages(
  client: SquareClient,
): Promise<{ items: RawItem[]; imageUrlsById: Map<string, string> }> {
  const items: RawItem[] = [];
  const imageUrlsById = new Map<string, string>();
  let cursor: string | undefined;

  do {
    const res = await client.catalog.search({
      objectTypes: ["ITEM"],
      includeRelatedObjects: true,
      cursor,
      limit: 100,
    });
    // search with objectTypes: ["ITEM"] returns only ITEM objects, which structurally satisfy RawItem.
    items.push(...((res.objects ?? []) as unknown as RawItem[]));
    for (const obj of res.relatedObjects ?? []) {
      if (obj.type === "IMAGE" && obj.id && obj.imageData?.url) {
        imageUrlsById.set(obj.id, obj.imageData.url);
      }
    }
    cursor = res.cursor;
  } while (cursor);

  return { items, imageUrlsById };
}

function itemBelongsToCategory(item: RawItem, categoryId: string): boolean {
  return item.itemData?.categories?.some((c) => c.id === categoryId) ?? false;
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
    const { items, imageUrlsById } = await fetchItemsWithImages(client);
    return items
      .filter((item) => itemBelongsToCategory(item, categoryId))
      .map((item) => mapItemToScreeningMovie(item, imageUrlsById))
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
