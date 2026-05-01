import { useState, useMemo } from "react";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import type {
  ArchivedScreening,
  SortField,
  SortDirection,
} from "@/lib/archived-screenings";
import { filterScreenings, sortScreenings } from "@/lib/archived-screenings";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface ScreeningsArchiveTableProps {
  screenings: ArchivedScreening[];
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("en-US", {
    timeZone: "UTC",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const SORTABLE_COLUMNS: { field: SortField; label: string }[] = [
  { field: "date", label: "Date" },
  { field: "film", label: "Film" },
  { field: "series", label: "Series" },
  { field: "year", label: "Year" },
];

function SortIcon({
  field,
  sortField,
  sortDir,
}: {
  field: SortField;
  sortField: SortField;
  sortDir: SortDirection;
}) {
  if (field !== sortField)
    return (
      <ChevronsUpDown className="ml-1 inline-block h-3.5 w-3.5 opacity-40" />
    );
  return sortDir === "asc" ? (
    <ChevronUp className="ml-1 inline-block h-3.5 w-3.5" />
  ) : (
    <ChevronDown className="ml-1 inline-block h-3.5 w-3.5" />
  );
}

export function ScreeningsArchiveTable({
  screenings,
}: ScreeningsArchiveTableProps) {
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDir, setSortDir] = useState<SortDirection>("desc");
  const [filterSeries, setFilterSeries] = useState("");
  const [filterYear, setFilterYear] = useState("");

  const uniqueSeries = useMemo(
    () => [...new Set(screenings.map((s) => s.series).filter(Boolean))].sort(),
    [screenings],
  );

  const uniqueYears = useMemo(
    () =>
      [...new Set(screenings.map((s) => s.year).filter(Boolean))].sort((a, b) =>
        String(b).localeCompare(String(a)),
      ),
    [screenings],
  );

  const displayed = useMemo(
    () =>
      sortScreenings(
        filterScreenings(screenings, filterSeries, filterYear),
        sortField,
        sortDir,
      ),
    [screenings, filterSeries, filterYear, sortField, sortDir],
  );

  function handleSortClick(field: SortField) {
    if (field === sortField) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir(field === "date" ? "desc" : "asc");
    }
  }

  const hasFilters = filterSeries !== "" || filterYear !== "";

  if (screenings.length === 0) {
    return (
      <p className="text-muted-foreground text-sm py-8 text-center">
        No screenings found.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Series</span>
          <Select
            value={filterSeries || "all"}
            onValueChange={(v) => setFilterSeries(v === "all" ? "" : (v ?? ""))}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All series" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All series</SelectItem>
              {uniqueSeries.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Year</span>
          <Select
            value={filterYear || "all"}
            onValueChange={(v) => setFilterYear(v === "all" ? "" : (v ?? ""))}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="All years" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All years</SelectItem>
              {uniqueYears.map((y) => (
                <SelectItem key={y} value={y}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setFilterSeries("");
              setFilterYear("");
            }}
          >
            Clear filters
          </Button>
        )}
      </div>

      {displayed.length === 0 ? (
        <p className="text-muted-foreground text-sm py-8 text-center">
          No screenings match the selected filters.
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              {SORTABLE_COLUMNS.map(({ field, label }) => (
                <TableHead
                  key={field}
                  className="cursor-pointer select-none whitespace-nowrap"
                  onClick={() => handleSortClick(field)}
                >
                  {label}
                  <SortIcon
                    field={field}
                    sortField={sortField}
                    sortDir={sortDir}
                  />
                </TableHead>
              ))}
              <TableHead>Location</TableHead>
              <TableHead>Partner(s)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayed.map((screening, index) => (
              <TableRow key={`${screening.film}-${screening.date}-${index}`}>
                <TableCell>{formatDate(screening.date)}</TableCell>
                <TableCell className="font-medium">{screening.film}</TableCell>
                <TableCell>{screening.series}</TableCell>
                <TableCell>{screening.year}</TableCell>
                <TableCell>{screening.location}</TableCell>
                <TableCell>{screening.partners}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
