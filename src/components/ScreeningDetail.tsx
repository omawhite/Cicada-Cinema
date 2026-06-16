import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TicketTailorCheckoutButton } from "@/components/TicketTailorCheckoutButton";
import type { TicketTailorEventSeries } from "@/lib/types/ticket-tailor";

interface ScreeningDetailProps {
  screening: TicketTailorEventSeries;
}

export function ScreeningDetail({ screening }: ScreeningDetailProps) {
  const venueName =
    screening.venue?.name ??
    (screening.online_event ? "Online Event" : undefined);

  return (
    <div className="space-y-6">
      <a
        href="/screenings"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        ← Back to Screenings
      </a>

      <Card>
        {screening.images?.header && (
          <img
            src={screening.images.header}
            alt={screening.name}
            className="h-64 w-full object-cover sm:h-80 lg:h-96"
          />
        )}
        <CardHeader>
          <CardTitle className="text-2xl sm:text-3xl">
            {screening.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {screening.description && (
            <div className="space-y-2">
              <h2 className="font-semibold">About this screening</h2>
              <div
                className="prose prose-sm max-w-none text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: screening.description }}
              />
            </div>
          )}

          {venueName && (
            <div className="space-y-2">
              <h2 className="font-semibold">Location</h2>
              <div className="text-muted-foreground">
                <p>{venueName}</p>
                {screening.venue?.address_1 && (
                  <p>{screening.venue.address_1}</p>
                )}
                {screening.venue?.address_2 && (
                  <p>{screening.venue.address_2}</p>
                )}
                {(screening.venue?.city || screening.venue?.postal_code) && (
                  <p>
                    {screening.venue.city}
                    {screening.venue.city && screening.venue.postal_code
                      ? ", "
                      : ""}
                    {screening.venue.postal_code}
                  </p>
                )}
                {screening.venue?.country && <p>{screening.venue.country}</p>}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <TicketTailorCheckoutButton
              eventUrl={screening.url}
              className="inline-flex h-10 cursor-pointer items-center justify-center rounded-4xl bg-primary px-6 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/80"
            >
              Buy Tickets
            </TicketTailorCheckoutButton>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
