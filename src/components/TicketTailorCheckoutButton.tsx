declare global {
  interface Window {
    TTWidget?: {
      loadEvent: (
        boxOfficeName: string,
        eventId: number,
        type: string,
      ) => void;
      loadEventOccurrence: (
        boxOfficeName: string,
        occurrenceId: number,
      ) => void;
    };
  }
}

interface TicketTailorCheckoutButtonProps {
  /** Public Ticket Tailor URL for the event or event series, e.g. `https://buytickets.at/<box-office>/<id>`. */
  eventUrl: string;
  className?: string;
  children?: React.ReactNode;
}

function parseTicketTailorUrl(
  url: string,
): { boxOfficeName: string; eventId: number } | null {
  try {
    const urlObj = new URL(url);
    // URL format: https://buytickets.at/BOXOFFICENAME/EVENTID
    // or: https://www.tickettailor.com/events/BOXOFFICENAME/EVENTID
    const parts = urlObj.pathname.split("/").filter(Boolean);

    if (urlObj.hostname === "buytickets.at" && parts.length >= 2) {
      const boxOfficeName = parts[0];
      const eventId = parseInt(parts[1], 10);
      if (!boxOfficeName || isNaN(eventId)) return null;
      return { boxOfficeName, eventId };
    }

    const eventsIndex = parts.indexOf("events");
    if (eventsIndex !== -1 && parts.length >= eventsIndex + 3) {
      const boxOfficeName = parts[eventsIndex + 1];
      const eventId = parseInt(parts[eventsIndex + 2], 10);
      if (!boxOfficeName || isNaN(eventId)) return null;
      return { boxOfficeName, eventId };
    }

    return null;
  } catch {
    return null;
  }
}

let widgetScriptLoaded = false;

function loadWidgetScript(): void {
  if (widgetScriptLoaded || typeof document === "undefined") return;
  widgetScriptLoaded = true;
  const script = document.createElement("script");
  script.src = "https://cdn.tickettailor.com/js/TTWidget.js";
  script.async = true;
  document.body.appendChild(script);
}

export function TicketTailorCheckoutButton({
  eventUrl,
  className,
  children = "Buy Tickets",
}: TicketTailorCheckoutButtonProps) {
  const parsed = parseTicketTailorUrl(eventUrl);

  if (!parsed) {
    return (
      <a
        href={eventUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {children}
      </a>
    );
  }

  loadWidgetScript();

  const { boxOfficeName, eventId } = parsed;

  function handleClick() {
    window.TTWidget?.loadEvent(boxOfficeName, eventId, "widget");
  }

  return (
    <button type="button" onClick={handleClick} className={className}>
      {children}
    </button>
  );
}
