const ZEFFY_API_BASE = "https://api.zeffy.com/api/v1";

/** A single scheduled occurrence (screening time) within a Zeffy campaign. */
export interface ZeffyCampaignOccurrence {
  id: string;
  object: "occurrence";
  start: number;
  end: number;
  start_date: number;
  end_date: number;
  is_archived: boolean;
}

/** A Zeffy fundraising or ticketing campaign, as returned by the `/campaigns` endpoint. */
export interface ZeffyCampaign {
  id: string;
  object: "campaign";
  created: number;
  updated: number;
  deleted_at: number | null;
  type: "donation_form" | "ticketing";
  category: string;
  status: string;
  title: string;
  description: string;
  locale: string;
  url: string | null;
  banner_url: string | null;
  logo_url: string | null;
  target: number | null;
  goal_amount: number | null;
  currency: string;
  volume: number;
  is_archived: boolean;
  start_date: number | null;
  end_date: number | null;
  occurrences: ZeffyCampaignOccurrence[];
  metadata: Record<string, unknown>;
}

/** Paginated list envelope returned by the Zeffy campaigns list endpoint. */
interface ZeffyCampaignList {
  object: "list";
  data: ZeffyCampaign[];
  has_more: boolean;
  next_cursor: string | null;
}

/**
 * Returns true if a campaign is an active, non-deleted ticketing campaign with at least one
 * upcoming occurrence — excludes fully past events while keeping mid-run ones.
 */
function isActiveAndCurrent(campaign: ZeffyCampaign, nowSecs: number): boolean {
  return (
    campaign.type === "ticketing" &&
    campaign.status === "active" &&
    !campaign.is_archived &&
    !campaign.deleted_at &&
    campaign.occurrences.some((o) => !o.is_archived && o.start_date >= nowSecs)
  );
}

/** Fetches all active, current ticketing campaigns from the Zeffy API, paginating until exhausted. */
export async function fetchCampaigns(apiKey: string): Promise<ZeffyCampaign[]> {
  const eventCampaigns: ZeffyCampaign[] = [];
  let cursor: string | undefined;

  do {
    const url = new URL(`${ZEFFY_API_BASE}/campaigns`);
    url.searchParams.set("limit", "100");
    if (cursor) url.searchParams.set("starting_after", cursor);

    const response = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      throw new Error(`Zeffy API error: ${response.status} ${body}`);
    }

    const nowSecs = Math.floor(Date.now() / 1000);
    const body: ZeffyCampaignList = await response.json();
    const active = body.data.filter((c) => isActiveAndCurrent(c, nowSecs));
    eventCampaigns.push(...active);

    cursor = body.has_more && body.next_cursor ? body.next_cursor : undefined;
  } while (cursor);

  return eventCampaigns;
}
