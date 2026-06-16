import type {
  TicketTailorEvent,
  TicketTailorEventsResponse,
  TicketTailorEventSeries,
  TicketTailorEventSeriesResponse,
} from "@/lib/types/ticket-tailor";

const TICKET_TAILOR_API_URL = "https://api.tickettailor.com/v1";
const TICKET_TAILOR_EVENT_API_URL = `${TICKET_TAILOR_API_URL}/events`;
const TICKET_TAILOR_EVENT_SERIES_API_URL = `${TICKET_TAILOR_API_URL}/event_series`;

export interface GetEventSeriesParams {
  status?: TicketTailorEventSeries["status"];
  limit?: number;
}

export interface GetEventsParams {
  status?: TicketTailorEvent["status"];
  limit?: number;
}

function authHeader(apiKey: string): string {
  return `Basic ${btoa(apiKey)}`;
}

export async function getEventSeries(
  params?: GetEventSeriesParams,
): Promise<TicketTailorEventSeries[]> {
  const apiKey = import.meta.env.TICKET_TAILOR_API_KEY;

  if (!apiKey) {
    console.error("TICKET_TAILOR_API_KEY is not configured");
    return [];
  }

  const url = new URL(TICKET_TAILOR_EVENT_SERIES_API_URL);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    });
  }

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      Authorization: authHeader(apiKey),
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch event series: ${response.status}`);
  }

  const data: TicketTailorEventSeriesResponse = await response.json();
  return data.data;
}

export async function getEventSeriesById(
  eventSeriesId: string,
): Promise<TicketTailorEventSeries | null> {
  const apiKey = import.meta.env.TICKET_TAILOR_API_KEY;

  if (!apiKey) {
    throw new Error("TICKET_TAILOR_API_KEY is not configured");
  }

  if (!eventSeriesId) {
    throw new Error("Event Series ID is required");
  }

  const url = `${TICKET_TAILOR_EVENT_SERIES_API_URL}/${eventSeriesId}`;

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      Authorization: authHeader(apiKey),
    },
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(
      `Failed to fetch event series ${eventSeriesId}: ${response.status}`,
    );
  }

  return response.json();
}

export async function getEvents(
  params?: GetEventsParams,
): Promise<TicketTailorEvent[]> {
  const apiKey = import.meta.env.TICKET_TAILOR_API_KEY;

  if (!apiKey) {
    console.error("TICKET_TAILOR_API_KEY is not configured");
    return [];
  }

  const url = new URL(TICKET_TAILOR_EVENT_API_URL);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    });
  }

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      Authorization: authHeader(apiKey),
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch events: ${response.status}`);
  }

  const data: TicketTailorEventsResponse = await response.json();
  return data.data;
}

function isUpcoming(event: TicketTailorEvent): boolean {
  return new Date(event.start.iso).getTime() > Date.now();
}

/** A screening is "active" when its series is published and it has at least one upcoming published event. */
export async function getActiveEventSeries(): Promise<
  TicketTailorEventSeries[]
> {
  const [series, events] = await Promise.all([
    getEventSeries({ status: "published" }),
    getEvents({ status: "published" }),
  ]);

  const activeSeriesIds = new Set(
    events.filter(isUpcoming).map((event) => event.event_series_id),
  );

  return series.filter((s) => activeSeriesIds.has(s.id));
}

export async function getActiveEventSeriesById(
  eventSeriesId: string,
): Promise<TicketTailorEventSeries | null> {
  const [series, events] = await Promise.all([
    getEventSeriesById(eventSeriesId),
    getEvents({ status: "published" }),
  ]);

  if (!series) {
    return null;
  }

  const isActive = events.some(
    (event) => event.event_series_id === eventSeriesId && isUpcoming(event),
  );

  return isActive ? series : null;
}
