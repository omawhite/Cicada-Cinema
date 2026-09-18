import { describe, it, expect } from "vitest";
import {
  isValidScreeningStart,
  mapItemToScreeningMovie,
  resolveItemImageUrl,
  type RawItem,
} from "../catalog";

describe("isValidScreeningStart", () => {
  it("accepts a valid ISO-8601 datetime string", () => {
    expect(isValidScreeningStart("2026-08-21T19:00:00Z")).toBe(true);
  });

  it("rejects undefined", () => {
    expect(isValidScreeningStart(undefined)).toBe(false);
  });

  it("rejects an empty string", () => {
    expect(isValidScreeningStart("")).toBe(false);
  });

  it("rejects an unparseable string", () => {
    expect(isValidScreeningStart("not a date")).toBe(false);
  });

  it("rejects non-string values", () => {
    expect(isValidScreeningStart(12345)).toBe(false);
  });
});

describe("mapItemToScreeningMovie", () => {
  it("maps a movie with valid, priced screenings sorted chronologically", () => {
    const raw: RawItem = {
      id: "movie-1",
      itemData: {
        name: "Bicycle Thieves",
        description: "Italian Neorealism classic.",
        variations: [
          {
            id: "var-late",
            itemVariationData: {
              name: "Fri 9:00 PM",
              priceMoney: { amount: 1500n, currency: "USD" },
              customAttributeValues: {
                screening_start: { stringValue: "2026-08-22T21:00:00Z" },
              },
            },
          },
          {
            id: "var-early",
            itemVariationData: {
              name: "Fri 7:00 PM",
              priceMoney: { amount: 1500n, currency: "USD" },
              customAttributeValues: {
                screening_start: { stringValue: "2026-08-22T19:00:00Z" },
              },
            },
          },
        ],
      },
    };

    const result = mapItemToScreeningMovie(raw);
    expect(result?.screenings.map((s) => s.id)).toEqual([
      "var-early",
      "var-late",
    ]);
  });

  it("includes a variation with a missing screening_start, leaving it undefined", () => {
    const raw: RawItem = {
      id: "movie-1",
      itemData: {
        name: "Rome, Open City",
        variations: [
          {
            id: "var-a",
            itemVariationData: {
              priceMoney: { amount: 1500n, currency: "USD" },
            },
          },
          {
            id: "var-b",
            itemVariationData: {
              priceMoney: { amount: 1500n, currency: "USD" },
              customAttributeValues: {
                screening_start: { stringValue: "2026-08-22T19:00:00Z" },
              },
            },
          },
        ],
      },
    };

    const result = mapItemToScreeningMovie(raw);
    expect(result?.screenings).toHaveLength(2);
    expect(
      result?.screenings.find((s) => s.id === "var-a")?.screeningStart,
    ).toBeUndefined();
  });

  it("includes a variation with a malformed screening_start, leaving it undefined", () => {
    const raw: RawItem = {
      id: "movie-1",
      itemData: {
        name: "Battleship Potemkin",
        variations: [
          {
            id: "var-a",
            itemVariationData: {
              priceMoney: { amount: 1500n, currency: "USD" },
              customAttributeValues: {
                screening_start: { stringValue: "not-a-date" },
              },
            },
          },
        ],
      },
    };

    const result = mapItemToScreeningMovie(raw);
    expect(result?.screenings).toHaveLength(1);
    expect(result?.screenings[0].screeningStart).toBeUndefined();
  });

  it("still skips a variation with no price, regardless of screening_start", () => {
    const raw: RawItem = {
      id: "movie-1",
      itemData: {
        name: "No Price",
        variations: [
          { id: "var-a", itemVariationData: {} },
          {
            id: "var-b",
            itemVariationData: {
              priceMoney: { amount: 1500n, currency: "USD" },
              customAttributeValues: {
                screening_start: { stringValue: "2026-08-22T19:00:00Z" },
              },
            },
          },
        ],
      },
    };

    const result = mapItemToScreeningMovie(raw);
    expect(result?.screenings).toHaveLength(1);
    expect(result?.screenings[0].id).toBe("var-b");
  });

  it("sorts dated screenings chronologically before undated ones", () => {
    const raw: RawItem = {
      id: "movie-1",
      itemData: {
        name: "Mixed",
        variations: [
          {
            id: "var-undated",
            itemVariationData: {
              priceMoney: { amount: 1000n, currency: "USD" },
            },
          },
          {
            id: "var-dated",
            itemVariationData: {
              priceMoney: { amount: 1000n, currency: "USD" },
              customAttributeValues: {
                screening_start: { stringValue: "2026-08-22T19:00:00Z" },
              },
            },
          },
        ],
      },
    };

    const result = mapItemToScreeningMovie(raw);
    expect(result?.screenings.map((s) => s.id)).toEqual([
      "var-dated",
      "var-undated",
    ]);
  });

  it("returns null when no variations have a usable price", () => {
    const raw: RawItem = {
      id: "movie-1",
      itemData: {
        name: "Unpriced",
        variations: [{ id: "var-a", itemVariationData: {} }],
      },
    };
    expect(mapItemToScreeningMovie(raw)).toBeNull();
  });

  it("returns null when there are no variations at all", () => {
    const raw: RawItem = {
      id: "movie-1",
      itemData: { name: "No Screenings", variations: [] },
    };
    expect(mapItemToScreeningMovie(raw)).toBeNull();
  });

  it("returns null when the item has no id", () => {
    expect(mapItemToScreeningMovie({ itemData: { name: "No ID" } })).toBeNull();
  });

  it("sets imageUrl from the first resolvable image id", () => {
    const raw: RawItem = {
      id: "movie-1",
      itemData: {
        name: "Bicycle Thieves",
        imageIds: ["img-1"],
        variations: [
          {
            id: "var-a",
            itemVariationData: {
              priceMoney: { amount: 1500n, currency: "USD" },
            },
          },
        ],
      },
    };
    const imageUrlsById = new Map([
      ["img-1", "https://example.com/poster.jpg"],
    ]);

    const result = mapItemToScreeningMovie(raw, imageUrlsById);
    expect(result?.imageUrl).toBe("https://example.com/poster.jpg");
  });

  it("leaves imageUrl undefined when no image id resolves", () => {
    const raw: RawItem = {
      id: "movie-1",
      itemData: {
        name: "Bicycle Thieves",
        imageIds: ["img-missing"],
        variations: [
          {
            id: "var-a",
            itemVariationData: {
              priceMoney: { amount: 1500n, currency: "USD" },
            },
          },
        ],
      },
    };

    const result = mapItemToScreeningMovie(raw, new Map());
    expect(result?.imageUrl).toBeUndefined();
  });
});

describe("resolveItemImageUrl", () => {
  it("returns the URL for the item's image id", () => {
    const raw: RawItem = { id: "item-1", itemData: { imageIds: ["img-1"] } };
    const imageUrlsById = new Map([["img-1", "https://example.com/a.jpg"]]);
    expect(resolveItemImageUrl(raw, imageUrlsById)).toBe(
      "https://example.com/a.jpg",
    );
  });

  it("falls through to the next image id if the first doesn't resolve", () => {
    const raw: RawItem = {
      id: "item-1",
      itemData: { imageIds: ["img-missing", "img-2"] },
    };
    const imageUrlsById = new Map([["img-2", "https://example.com/b.jpg"]]);
    expect(resolveItemImageUrl(raw, imageUrlsById)).toBe(
      "https://example.com/b.jpg",
    );
  });

  it("returns undefined when there are no image ids", () => {
    const raw: RawItem = { id: "item-1", itemData: {} };
    expect(resolveItemImageUrl(raw, new Map())).toBeUndefined();
  });

  it("returns undefined when no image id resolves", () => {
    const raw: RawItem = {
      id: "item-1",
      itemData: { imageIds: ["img-missing"] },
    };
    expect(resolveItemImageUrl(raw, new Map())).toBeUndefined();
  });
});
