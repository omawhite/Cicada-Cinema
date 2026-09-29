import { parseMoney, type Money } from "./money";

export interface CatalogVariation {
  id: string;
  name: string;
  price: Money;
}

export interface ScreeningVariation extends CatalogVariation {
  /**
   * ISO-8601 datetime, read from the `screening_start` custom attribute.
   * Undefined when the attribute is missing or malformed — the variation is
   * still shown, just without a parsed date to sort or format by.
   */
  screeningStart?: string;
}

export interface ScreeningMovie {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  screenings: ScreeningVariation[];
}

/**
 * Structural subset of a Square `CatalogObject` (ITEM_VARIATION) that our
 * mapping functions need. Kept separate from the `square` SDK's own types so
 * this module has no dependency on that package and can be unit tested with
 * plain fixtures.
 */
export interface RawVariation {
  id?: string | null;
  itemVariationData?: {
    name?: string | null;
    priceMoney?: { amount?: bigint | null; currency?: string | null } | null;
    customAttributeValues?: Record<
      string,
      { stringValue?: string | null }
    > | null;
  } | null;
}

/** Structural subset of a Square `CatalogObject` (ITEM). */
export interface RawItem {
  id?: string | null;
  itemData?: {
    name?: string | null;
    description?: string | null;
    imageIds?: string[] | null;
    categories?: { id?: string | null }[] | null;
    variations?: RawVariation[] | null;
  } | null;
}

const SCREENING_START_ATTRIBUTE_KEY = "screening_start";

export function isValidScreeningStart(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length > 0 &&
    !Number.isNaN(new Date(value).getTime())
  );
}

/** Picks the item's poster image URL from its `imageIds`, using the first one the caller was able to resolve. */
export function resolveItemImageUrl(
  item: RawItem,
  imageUrlsById: Map<string, string>,
): string | undefined {
  for (const imageId of item.itemData?.imageIds ?? []) {
    const url = imageUrlsById.get(imageId);
    if (url) return url;
  }
  return undefined;
}

/**
 * Maps a Square catalog ITEM (in the Screenings category) to a movie with its
 * showtimes. A variation only needs a usable price to be included — a
 * missing or malformed `screening_start` doesn't drop it, it just leaves
 * `screeningStart` undefined. Variations with a valid date sort chronologically
 * first; the rest keep their catalog order after. `imageUrlsById` maps Square
 * IMAGE object ids to URLs — pass the map built from a search response's
 * `relatedObjects` so the movie's poster can be resolved.
 */
export function mapItemToScreeningMovie(
  item: RawItem,
  imageUrlsById: Map<string, string> = new Map(),
): ScreeningMovie | null {
  if (!item.id) return null;

  const screenings: ScreeningVariation[] = [];
  for (const v of item.itemData?.variations ?? []) {
    const price = parseMoney(v.itemVariationData?.priceMoney);
    if (!v.id || !price) {
      console.warn(
        `Skipping screening variation ${v.id ?? "(no id)"} on item ${item.id}: missing price`,
      );
      continue;
    }

    const rawScreeningStart =
      v.itemVariationData?.customAttributeValues?.[
        SCREENING_START_ATTRIBUTE_KEY
      ]?.stringValue;
    const screeningStart = isValidScreeningStart(rawScreeningStart)
      ? rawScreeningStart
      : undefined;

    screenings.push({
      id: v.id,
      name: v.itemVariationData?.name ?? "",
      price,
      screeningStart,
    });
  }

  if (screenings.length === 0) return null;

  screenings.sort((a, b) => {
    if (a.screeningStart && b.screeningStart) {
      return a.screeningStart.localeCompare(b.screeningStart);
    }
    if (a.screeningStart) return -1;
    if (b.screeningStart) return 1;
    return 0;
  });

  return {
    id: item.id,
    name: item.itemData?.name ?? "Untitled",
    description: item.itemData?.description ?? undefined,
    imageUrl: resolveItemImageUrl(item, imageUrlsById),
    screenings,
  };
}
