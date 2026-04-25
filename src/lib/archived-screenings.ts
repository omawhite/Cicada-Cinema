export interface ArchivedScreening {
  date: string;
  film: string;
  series: string;
  year: string;
  location: string;
  partners: string;
}

export type SortField = "date" | "film" | "series" | "year";
export type SortDirection = "asc" | "desc";

export function filterScreenings(
  screenings: ArchivedScreening[],
  series: string,
  year: string,
): ArchivedScreening[] {
  return screenings
    .filter((s) => !series || s.series === series)
    .filter((s) => !year || s.year === year);
}

export function sortScreenings(
  screenings: ArchivedScreening[],
  field: SortField,
  direction: SortDirection,
): ArchivedScreening[] {
  return [...screenings].sort((a, b) => {
    let cmp: number;
    if (field === "date") {
      const aTime = a.date ? new Date(a.date).getTime() : 0;
      const bTime = b.date ? new Date(b.date).getTime() : 0;
      cmp = aTime - bTime;
    } else {
      cmp = String(a[field]).localeCompare(String(b[field]));
    }
    return direction === "asc" ? cmp : -cmp;
  });
}