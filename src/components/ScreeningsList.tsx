import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { TicketTailorEventSeries } from "@/lib/types/ticket-tailor";

interface ScreeningCardProps {
  screening: TicketTailorEventSeries;
}

function ScreeningCard({ screening }: ScreeningCardProps) {
  const venueName =
    screening.venue?.name ??
    (screening.online_event ? "Online Event" : undefined);

  return (
    <Card className="flex h-full flex-col">
      {screening.images?.header && (
        <img
          src={screening.images.header}
          alt={screening.name}
          width={400}
          height={200}
          className="max-h-48 w-full object-cover"
        />
      )}
      <CardHeader>
        <CardTitle className="line-clamp-2">{screening.name}</CardTitle>
        {venueName && <CardDescription>{venueName}</CardDescription>}
      </CardHeader>
      <CardContent className="flex-1" />
      <CardFooter>
        <a
          href={`/screenings/${screening.id}`}
          className="inline-flex h-9 w-full items-center justify-center rounded-4xl bg-primary px-3 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/80"
        >
          View Screening
        </a>
      </CardFooter>
    </Card>
  );
}

interface ScreeningsListProps {
  screenings: TicketTailorEventSeries[];
}

export function ScreeningsList({ screenings }: ScreeningsListProps) {
  if (screenings.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-muted-foreground">
        No screenings found.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Screenings</h1>
        <span className="text-sm text-muted-foreground">
          {screenings.length} screening{screenings.length !== 1 ? "s" : ""}
        </span>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {screenings.map((screening) => (
          <ScreeningCard key={screening.id} screening={screening} />
        ))}
      </div>
    </div>
  );
}
