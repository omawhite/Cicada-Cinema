import { describe, it, expect } from "vitest";
import {
  filterScreenings,
  sortScreenings,
  type ArchivedScreening,
} from "../archived-screenings";

const screenings: ArchivedScreening[] = [
  {
    date: "2024-03-15",
    film: "Bicycle Thieves",
    series: "Italian Neorealism",
    year: "1948",
    location: "Main Hall",
    partners: "",
  },
  {
    date: "2023-11-02",
    film: "Battleship Potemkin",
    series: "Soviet Montage",
    year: "1925",
    location: "Main Hall",
    partners: "",
  },
  {
    date: "2024-01-20",
    film: "Rome, Open City",
    series: "Italian Neorealism",
    year: "1945",
    location: "Annex",
    partners: "",
  },
];

describe("filterScreenings", () => {
  it("returns all screenings when no filters are set", () => {
    expect(filterScreenings(screenings, "", "")).toHaveLength(3);
  });

  it("filters by series", () => {
    const result = filterScreenings(screenings, "Italian Neorealism", "");
    expect(result).toHaveLength(2);
    expect(result.every((s) => s.series === "Italian Neorealism")).toBe(true);
  });

  it("filters by year", () => {
    const result = filterScreenings(screenings, "", "1948");
    expect(result).toHaveLength(1);
    expect(result[0].film).toBe("Bicycle Thieves");
  });

  it("filters by series and year together", () => {
    const result = filterScreenings(
      screenings,
      "Italian Neorealism",
      "1945",
    );
    expect(result).toHaveLength(1);
    expect(result[0].film).toBe("Rome, Open City");
  });

  it("returns empty array when no matches", () => {
    expect(filterScreenings(screenings, "Nouvelle Vague", "")).toHaveLength(0);
  });
});

describe("sortScreenings", () => {
  it("sorts by date ascending", () => {
    const result = sortScreenings(screenings, "date", "asc");
    expect(result[0].film).toBe("Battleship Potemkin");
    expect(result[2].film).toBe("Bicycle Thieves");
  });

  it("sorts by date descending", () => {
    const result = sortScreenings(screenings, "date", "desc");
    expect(result[0].film).toBe("Bicycle Thieves");
    expect(result[2].film).toBe("Battleship Potemkin");
  });

  it("sorts by film ascending", () => {
    const result = sortScreenings(screenings, "film", "asc");
    expect(result[0].film).toBe("Battleship Potemkin");
    expect(result[1].film).toBe("Bicycle Thieves");
  });

  it("sorts by film descending", () => {
    const result = sortScreenings(screenings, "film", "desc");
    expect(result[0].film).toBe("Rome, Open City");
  });

  it("sorts by series ascending", () => {
    const result = sortScreenings(screenings, "series", "asc");
    expect(result[0].series).toBe("Italian Neorealism");
    expect(result[2].series).toBe("Soviet Montage");
  });

  it("sorts by year ascending", () => {
    const result = sortScreenings(screenings, "year", "asc");
    expect(result[0].year).toBe("1925");
    expect(result[2].year).toBe("1948");
  });

  it("does not mutate the original array", () => {
    const original = [...screenings];
    sortScreenings(screenings, "film", "asc");
    expect(screenings).toEqual(original);
  });
});