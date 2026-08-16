import { parse } from "csv-parse/sync";
import type { ArchivedScreening } from "@/lib/archived-screenings";

/**
 * Maps lowercase CSV header names to ArchivedScreening field names.
 * Aliases let the sheet use alternate column names (e.g. "Title" instead of
 * "Film") without breaking the parser.
 */
const COLUMN_ALIASES: Record<string, keyof ArchivedScreening> = {
  date: "date",
  film: "film",
  title: "film",
  series: "series",
  year: "year",
  location: "location",
  venue: "location",
  partner: "partners",
  partners: "partners",
};

/**
 * Parses a CSV string exported from the Google Sheet into an array of
 * ArchivedScreening objects.
 *
 * Column order doesn't matter — mapping is driven by the header row so
 * the sheet can be reorganized without touching this code. Rows where
 * every field is empty (e.g. trailing blank rows in the export) are dropped.
 */
export function parseScreeningsCSV(csv: string): ArchivedScreening[] {
  const records: Record<string, string>[] = parse(csv, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  return records
    .map((record) => {
      const screening: ArchivedScreening = {
        date: "",
        film: "",
        series: "",
        year: "",
        location: "",
        partners: "",
      };

      for (const [rawKey, value] of Object.entries(record)) {
        const field = COLUMN_ALIASES[rawKey.toLowerCase()];
        if (field) {
          screening[field] = value;
        }
      }

      return screening;
    })
    .filter((s) => Object.values(s).some((v) => v !== ""));
}

/**
 * Fetches the published Google Sheet CSV at `url` and returns the parsed
 * screenings. Intended to be called at build time from an Astro page with
 * `export const prerender = true`.
 *
 * @throws if the HTTP response is not ok.
 */
export async function fetchArchivedScreenings(
  url: string,
): Promise<ArchivedScreening[]> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch screenings CSV: ${res.status} ${res.statusText}`);
  }
  const csv = await res.text();
  return parseScreeningsCSV(csv);
}
