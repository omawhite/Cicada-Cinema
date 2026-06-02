import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { ZeffyCampaign, ZeffyCampaignOccurrence } from "@/lib/zeffy";

const TRUNCATE_AT = 3;

/** Rewrites Zeffy's locale+type event URLs to the correct `/en-US/ticketing/slug` purchase flow. */
function resolveEventLink(campaign: ZeffyCampaign): string | undefined {
  const { url, type, category } = campaign;
  if (!url) return undefined;
  if (type === "ticketing" && category === "Event") {
    return url.replace(/\/[A-Z]{2}(-[A-Z]{2})?\/event\//i, "/en-US/ticketing/");
  }
  return url;
}

/** Formats a Zeffy occurrence's Unix timestamp as a short human-readable date (e.g. "Sat, May 3"). */
function formatOccurrenceDate(o: ZeffyCampaignOccurrence): string {
  return new Date(o.start_date * 1000).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

/** Returns non-archived occurrences sorted by start date ascending. */
function sortedOccurrences(campaign: ZeffyCampaign): ZeffyCampaignOccurrence[] {
  return [...campaign.occurrences]
    .filter((o) => !o.is_archived)
    .sort((a, b) => a.start_date - b.start_date);
}

/** Props for {@link ScreeningCard}. */
interface ScreeningCardProps {
  campaign: ZeffyCampaign;
}

/** Displays a Zeffy campaign as a screening card with image, title, date badges, and a ticket link. */
export function ScreeningCard({ campaign }: ScreeningCardProps) {
  const [expanded, setExpanded] = useState(false);

  const imageSrc = campaign.banner_url ?? campaign.logo_url;
  const eventLink = resolveEventLink(campaign);
  const occurrences = sortedOccurrences(campaign);
  const overflowCount = occurrences.length - TRUNCATE_AT;
  const visible = expanded ? occurrences : occurrences.slice(0, TRUNCATE_AT);

  return (
    <Card className="w-76.75">
      <CardContent className="flex flex-col gap-4">
        {imageSrc && (
          <a
            href={eventLink}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={eventLink ? 0 : -1}
          >
            <img
              src={imageSrc}
              alt={campaign.title}
              className="w-full h-48 rounded-lg object-cover"
            />
          </a>
        )}
        <div className="flex flex-col gap-1">
          <a
            href={eventLink}
            target="_blank"
            rel="noopener noreferrer"
            className="font-heading text-xl font-medium hover:underline"
          >
            {campaign.title}
          </a>
        </div>
        {occurrences.length > 0 && (
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-1.5">
              {visible.map((o) => (
                <span
                  key={o.id}
                  className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground"
                >
                  {formatOccurrenceDate(o)}
                </span>
              ))}
            </div>
            {overflowCount > 0 && (
              <button
                onClick={() => setExpanded((prev) => !prev)}
                className="self-start text-xs text-muted-foreground underline-offset-2 hover:underline"
              >
                {expanded ? "Show less" : `+${overflowCount} more`}
              </button>
            )}
          </div>
        )}
        {eventLink && (
          <a href={eventLink} target="_blank" rel="noopener noreferrer">
            <Button className="w-fit bg-foreground text-background hover:bg-foreground/80">
              Get Tickets
            </Button>
          </a>
        )}
      </CardContent>
    </Card>
  );
}
