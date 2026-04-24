import type { Screening } from "@/lib/screenings";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ScreeningsTableProps {
  screenings: Screening[];
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr + "T00:00:00");
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function ScreeningsTable({ screenings }: ScreeningsTableProps) {
  if (screenings.length === 0) {
    return (
      <p className="text-muted-foreground text-sm py-8 text-center">
        No screenings found.
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Film</TableHead>
          <TableHead>Series</TableHead>
          <TableHead>Year</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Partner(s)</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {screenings.map((screening, index) => (
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
  );
}
