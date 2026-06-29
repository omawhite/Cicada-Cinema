import { describe, it, expect } from "vitest";
import { parseScreeningsCSV } from "../fetch-archived-screenings";

const BASIC_CSV = `Date,Film,Series,Year,Location,Partners
2024-03-15,Bicycle Thieves,Italian Neorealism,1948,Main Hall,
2023-11-02,Battleship Potemkin,Soviet Montage,1925,Main Hall,`;

describe("parseScreeningsCSV", () => {
  it("parses rows into ArchivedScreening objects", () => {
    const result = parseScreeningsCSV(BASIC_CSV);
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      date: "2024-03-15",
      film: "Bicycle Thieves",
      series: "Italian Neorealism",
      year: "1948",
      location: "Main Hall",
      partners: "",
    });
  });

  it("tolerates columns in a different order", () => {
    const csv = `Film,Year,Date,Partners,Location,Series
Bicycle Thieves,1948,2024-03-15,,Main Hall,Italian Neorealism`;
    const result = parseScreeningsCSV(csv);
    expect(result).toHaveLength(1);
    expect(result[0].film).toBe("Bicycle Thieves");
    expect(result[0].date).toBe("2024-03-15");
    expect(result[0].series).toBe("Italian Neorealism");
  });

  it("maps 'Title' header alias to film field", () => {
    const csv = `Title,Date\nRome Open City,2024-01-20`;
    const result = parseScreeningsCSV(csv);
    expect(result[0].film).toBe("Rome Open City");
  });

  it("maps 'Venue' header alias to location field", () => {
    const csv = `Film,Date,Venue\nBicycle Thieves,2024-03-15,Annex`;
    const result = parseScreeningsCSV(csv);
    expect(result[0].location).toBe("Annex");
  });

  it("skips rows where every field is empty", () => {
    const csv = `Date,Film,Series,Year,Location,Partners
2024-03-15,Bicycle Thieves,Italian Neorealism,1948,Main Hall,
,,,,,`;
    const result = parseScreeningsCSV(csv);
    expect(result).toHaveLength(1);
  });

  it("returns empty array for a header-only CSV", () => {
    const csv = `Date,Film,Series,Year,Location,Partners`;
    expect(parseScreeningsCSV(csv)).toHaveLength(0);
  });
});
