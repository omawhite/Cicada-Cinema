# Feasibility: our own showtime cards with SimpleTix checkout

_Researched 2026-10-09. Follows on from [simpletix-widget-styling.md](./simpletix-widget-styling.md)._

**Question:** can we drop the pinboard, render showtimes with our own components, and still sell through SimpleTix by attaching their checkout to each screening? And how much work is "keeping track of each event's SimpleTix ID"?

## Verdict

**Feasible, and the checkout part is verified working.** The ID tracking can also be avoided entirely: every ID we need is published on SimpleTix's public pages, so the site can discover screenings automatically. There is no official events API, so that discovery relies on parsing public pages. Most of what we'd parse is schema.org JSON-LD, the most stable thing available.

## 1. Checkout from our own button: verified

`widget.min.js` exposes a global function, and SimpleTix's own event page calls it for its "Buy Tickets" button and for each time button:

```js
createSimpleTixEmbed(element, appId, showId, hash, storeName, showTimeId);
```

The `element` needs a `data-url="https://embed.prod.simpletix.com/"` attribute.

**Test:** on `localhost:4321/archive`, which has no pinboard and no SimpleTix markup, I loaded only `widget.min.js` and `widget.min.css`, created a plain `<button>`, and called:

```js
btn.dataset.url = "https://embed.prod.simpletix.com/";
btn.addEventListener("click", () => {
  window.location.hash = "#smtx-click";
  createSimpleTixEmbed(
    btn,
    "26d82f72-69e5-43d0-bffa-eea79be97664",
    "288880",
    "#smtx-click",
    "Cicada Cinema",
    "1622043",
  );
});
```

**Result:** the checkout popup opened at `embed.prod.simpletix.com/{appId}/288880?smtxorigin=9&time=1622043`. **Thu Oct 29, 9:00 PM** was already selected, and General Admission was already in the cart.

- `showTimeId` is optional. Without it, checkout opens on the film's first date and the buyer picks a time.
- The checkout page sends no `X-Frame-Options` or CSP header, so it can be framed from our domain.
- Behavior is unchanged from today: mobile visitors are sent to the SimpleTix page, and the checkout is styled only through the SimpleTix admin.

## 2. Where the card data comes from

| Data                                                                                      | Source                                                                                              | Format                                                                                     |
| ----------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| List of active films and their `showId`s                                                  | Store page `https://cicadacinema.simpletix.com/`                                                    | `<a href="https://www.simpletix.com/e/{slug}-tickets-{showId}">` links                     |
| Upcoming showtimes: start/end time, poster, full description, price, availability, status | Event page `https://www.simpletix.com/e/{slug}-tickets-{showId}`                                    | **schema.org `Event` JSON-LD**, one entry per upcoming showtime                            |
| `showTimeId` for each showtime                                                            | Same event page                                                                                     | Inline `var timeArray = [{"Id":1622042,"Time":"Thu, Oct 29, 2026 7:00 PM - 9:00 PM"}, …]`  |
| Alternative source for showtimes and their IDs                                            | `https://contact.simpletix.com/Calendar/GetCalendar?applicationId=…&currentDateTime=October%202026` | HTML calendar, one request per month (`calendarSimpleTixEmbed(this,'288880','1622042',…)`) |

Sample JSON-LD entry (trimmed):

```json
{
  "@type": "Event",
  "name": "The Plot Against Harry",
  "startDate": "2026-10-29T23:00:00+00:00",
  "endDate": "2026-10-30T01:00:00+00:00",
  "image": "https://cdn.simpletix.com/…/shows/888/PlotAgainstHarryposter….png",
  "description": "…full, untruncated…",
  "eventStatus": "https://schema.org/EventScheduled",
  "offers": [
    {
      "lowPrice": 11.63,
      "highPrice": 11.63,
      "availability": "https://schema.org/InStock"
    }
  ]
}
```

**Joining the two:** the JSON-LD covers upcoming showtimes only (5 for this film), while `timeArray` also includes past ones (21). Convert each JSON-LD `startDate` to Bloomington local time (`America/Indiana/Indianapolis`) and match it to the start of each `timeArray` string. For example, `2026-10-29T23:00Z` is 7:00 PM, which is `1622042`.

**Request cost:** one store-page request plus one per film currently on sale.

**No official API.** SimpleTix's webhooks and its Zapier and Make integrations cover only orders, attendees and scans; none of them list events.

## 3. Three ways to manage the IDs

1. **Manual.** Keep `showId`, and optionally `showTimeId`, in a Google Sheet or content collection. `showId` is easy to find because it's at the end of the event URL. `showTimeId` isn't visible anywhere convenient; you'd have to copy it from page source. **This is the cost you were worried about, and it's real.**
2. **Automatic (recommended).** Discover films and showtimes from the sources in section 2. Adding a screening means creating it in SimpleTix, and it then appears on our site.
3. **Hybrid.** Combine option 2 with our own editorial data (series, partners, director, year) keyed by `showId`. These are the fields the archive data already has, so it fits the planned `current-screenings` library.

## 4. What it would look like in this repo

- **`src/lib/current-screenings.ts`** would follow the planned naming split from `archived-screenings`.
  - It would export `fetchCurrentScreenings()`.
  - Parsing would be pure functions: `parseStorePage`, `parseEventJsonLd`, `parseTimeArray`, `joinShowtimes`.
  - Unit tests would run against fixtures saved from real responses.
- **Parsing on Workers.** Workers have no `DOMParser`. That's fine, because what we need is JSON inside known `<script>` tags, which a regex plus `JSON.parse` can extract. `HTMLRewriter` is another option.
- **Rendering.** `showtimes.astro` is currently prerendered (static). Showtimes and sold-out status change between deploys, so the page should render per request (`export const prerender = false`) and cache the SimpleTix fetches for 5–15 minutes, using the Workers Cache API or a KV namespace. A static build with scheduled rebuilds would also work but goes stale between rebuilds.
- **Cards** would be Astro components. Each showtime gets a `<button>` with `data-show-id`, `data-show-time-id` and `data-url`, plus one small script that calls `createSimpleTixEmbed` on click. `widget.min.js` and `widget.min.css` stay on the page because they supply the popup and loader.
- **Fallback:** if SimpleTix fails to respond or the parse fails, show a "Buy tickets on SimpleTix" link to the store page, or fall back to the current pinboard.

## 5. What we gain and lose

**Gains**

- Full design control: portrait posters, brand fonts, our own layout and empty states. None of the CSS-override issues from the styling report apply.
- No leaking global CSS. The `.hidden { display: none !important }` rule comes from the pinboard's HTML, not `widget.min.css`, so dropping the pinboard removes it. The `Header.tsx` workaround then becomes unnecessary, though it's harmless to keep.
- Showtimes in the server-rendered HTML, which is good for search engines, link previews and our own `Event` JSON-LD. The pinboard renders only in the browser.
- No loading skeleton or layout shift while the pinboard fetches.
- A "Buy" button per showtime that opens checkout with that showtime already selected.

**Losses and risks**

- **Parsing undocumented pages.** JSON-LD is fairly stable because SimpleTix relies on it for search results. `timeArray` and the `GetCalendar` HTML could change without notice. Tests with saved fixtures and a runtime fallback limit the damage.
- **Pinboard features would need rebuilding.** That includes search, month navigation, and the memberships and special-registration tabs, if we want them.
- **The checkout itself doesn't change.** It's still styled in the SimpleTix admin, and mobile still sends visitors to SimpleTix.
- `widget.min.css` still loads Mulish and Poppins from Google Fonts, unless we copy only the popup styles we need.

## 6. Unverified, check before building

- **Sold out and cancelled.** I assumed `availability: SoldOut` and `eventStatus: EventCancelled` in the JSON-LD, but no current event is sold out or cancelled to confirm it.
- **Fetching from Workers.** I fetched the event pages with a browser user agent. Fetching from a Worker may be treated differently.
- **Store-page completeness.** I haven't confirmed whether hidden or unlisted events appear, or whether the page paginates once there are many events. Today it has two.
- **Terms of service.** These are public pages and SEO data, so the risk is low, but asking SimpleTix support is worth it. While at it, ask whether they have an events feed or API.

## Suggested next step

Run a one- to two-day spike:

1. Write `current-screenings.ts` with tests, against saved store-page and event-page fixtures.
2. Render a bare list of cards with per-showtime buttons on a test route.
3. Deploy that route to a preview Worker to confirm the fetches work from Cloudflare.

If that holds up, design the real cards and retire the pinboard.
