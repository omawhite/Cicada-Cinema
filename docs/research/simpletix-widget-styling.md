# Customizing the SimpleTix widget on /showtimes

_Researched 2026-10-09 against `widget.min.css?t=2026.02.18`, `widget.min.js?t=2026.08.14`, and the live `GetPinBoard` response for our account (`26d82f72-69e5-43d0-bffa-eea79be97664`)._

## TL;DR

Most visual change is possible with our own CSS, scoped under `#smt_pinBoard`. The SimpleTix admin (color pickers plus the custom CSS editor) is only needed to restyle the **checkout**, which runs on SimpleTix's own domain.

## How the widget renders

The widget has three surfaces, and each one is reachable in a different way:

| Surface                                                                                         | What it is                                                                                                                                              | Where you can style it   |
| ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| **Listing** (cards, search box, month navigation)                                               | `widget.min.js` fetches HTML from `https://contact.simpletix.com/Calendar/GetPinBoard?...` and writes it into `#smt_Showlist`. It is **not an iframe**. | **Our CSS**, fully       |
| **Loader and modal frame** (`#blackBlocker`, `#simpleTixLoader`, `.smt-overlay`, `.nzopqftphl`) | Added to our `<body>` by the script                                                                                                                     | **Our CSS**              |
| **Checkout, desktop**                                                                           | An iframe from another domain (`https://embed.prod.simpletix.com/{appId}/{showId}`)                                                                     | **SimpleTix admin only** |
| **Checkout, mobile**                                                                            | When the user agent matches `iphone\|ipod\|android\|ie\|blackberry\|fennec`, the script sends the visitor to that same URL instead of opening a popup   | **SimpleTix admin only** |

## Options in SimpleTix's admin

### Settings → CSS/Design Edits: color pickers

These set three colors: theme, checkout text, and the "Checkout Now" button. In the checkout app they become CSS variables:

- `--event-page-theme-color` (ours: `#2586b7`, the default)
- `--checkout-text-color` (ours: `#0e2f60`)
- `--checkout-buttons-color` (ours: `#2acc98`)

The theme color also reaches **our** page. The listing HTML includes hidden `smt_eventThemeBg` and `smt_eventThemeText` inputs, and the script then sets `--event-page-theme-color` and `--checkout-text-color` on our `<html>`. `widget.min.css` uses those variables only for the tab text and underline. The script also uses the theme color for the loading spinner.

### Settings → CSS/Design Edits: custom CSS editor

- SimpleTix says it may need to be turned on by their support.
- It is the only way to restyle the checkout itself.
- The listing HTML returned for our account contains no account-level CSS, so this editor does **not** affect our showtimes page.
- I haven't confirmed that its rules reach the embedded checkout; a test rule would settle that.
- Using Reuben or Florensans there means hosting the font files somewhere public, which runs into the font licensing question again.

### Other settings

- **Settings → Edit Labels** changes wording such as "Sold Out" and "Buy Tickets", then **Re-Publish Site**.
- **Settings → Store** sets the logo and header image shown in checkout.
- **Settings → Embeddable Widgets** generates the embed snippet. Its options are just hidden inputs, which we can edit directly in `src/components/simpletix/*.astro`:

| Input                                                           | Values                       | Effect                                                                                                                                                             |
| --------------------------------------------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `smt_displayStyle`                                              | `Cal` / `Next50` / `Next100` | `Cal` shows one month at a time with previous/next buttons; `Next50` and `Next100` show the next 50 or 100 events. `SimpleTixPinboard.astro` currently uses `Cal`. |
| `smt_openEventPageType`                                         | `0` / `1`                    | `0` opens the checkout popup. `1` turns each card into a plain link to `https://www.simpletix.com/e/{slug}-tickets-{showId}`.                                      |
| `smt_isDisplayEventCategory`                                    | `0` / `1`                    | `1` adds a category tag row to each card (`.smt-footer-section`, `.smt-badge-label`, `.smt-badge-label-red`).                                                      |
| `smt_selectedEventCategories`, `smt_selectedInternalCategories` | IDs                          | Filter which events appear.                                                                                                                                        |

## Custom CSS on our site

### What the listing markup looks like

```html
<div class="upc-grid">
  <div class="upc-card">
    <a
      class="upc-link"
      data-showid="288880"
      onclick="...calendarSimpleTixEmbed(this,'288880','0',...)"
    >
      <div
        class="upc-media upc-image"
        style="background-image:url('https://cdn.simpletix.com/...png')"
      ></div>
      <div class="upc-content">
        <h4>The Plot Against Harry</h4>
        <ul class="smt-navs">
          <li class="smt-event_date_time">
            <p>Thu, Oct 29, 2026 7:00 PM +4 more event</p>
          </li>
        </ul>
        <p>Description, cut off at about 250 characters on SimpleTix's side…</p>
      </div>
    </a>
  </div>
</div>
```

Other elements you can target:

- the search box: `.smt-search-control input` and `button`
- month navigation: `.smt-date-control`, `#smt_prevPinBoardbtn`, `#smt_selectedDate`
- tabs: `.smtx-tabs .tablinks`
- the loading placeholder: `.smt-shimmer`, `.shimmer-img`, `.shimmer-text`
- the date icon: `li.smt-event_date_time::before`, a sprite image from `cdn.simpletix.com/magnificent/images/spritev3.png`

### Four things that will trip you up

1. **Tailwind classes can't override the widget.** `widget.min.css` and the `<style>` block in the listing HTML sit outside CSS layers, while Tailwind v4 classes live in `@layer utilities`. CSS outside layers always wins, whatever the specificity, so write plain CSS.
2. **Astro's component-scoped styles won't apply.** The widget's HTML has no `data-astro-cid-*` attributes, so use `<style is:global>`.
3. **The listing HTML brings its own `<style>` block.** It is added after our CSS, so it wins any tie on specificity. It also defines global rules that leak onto the rest of the page:
   - `.hidden { display: none !important }`. This is why `Header.tsx` uses `max-md:hidden` instead of `hidden md:flex`.
   - `.w-60` and `.w-80`, which clash with Tailwind's classes of the same name.
   - `.shimmer` and `.tablinks`.
   - Hard-coded pink tab colors (`#e247d5`, `#d6325b`) that ignore the theme color.

   Prefixing every rule with `#smt_pinBoard` beats all of these.

4. **The font is forced.** `.smt-pin-board { font-family: "Poppins", sans-serif !important }`, so our font rule needs `!important` as well.

### Starting point

```css
/* <style is:global> in SimpleTixPinboard.astro */
#smt_pinBoard {
  font-family: var(--font-florensans) !important;
}
#smt_pinBoard .upc-content h4 {
  font-family: var(--font-reuben);
}
#smt_pinBoard .upc-media {
  aspect-ratio: 2 / 3;
} /* posters are portrait; the default 16/10 crops them */
#smt_pinBoard .upc-card {
  border-radius: 0;
  box-shadow: none;
}
#smt_pinBoard .smtx-tabs .tablinks.active {
  color: var(--primary);
  border-bottom-color: var(--primary);
}
```

### JavaScript hooks for things CSS can't do

- If `window.updateThemeColors(bg, text)` is defined, the script calls it instead of setting the theme variables. This lets us ignore the admin theme color.
- `window.eventPageThemeColor` sets the spinner color.
- A `MutationObserver` on `#smt_Showlist` can rework the markup after each load, for example to reformat dates or add classes.
- Some content arrives as finished text: the date line (`"Thu, Oct 29, 2026 7:00 PM +4  more event"`) and the descriptions, which are cut off on SimpleTix's side.

## Risks

- **The markup can change without notice.** It isn't documented, and some class names are deliberately scrambled (`.nzopqftphl`, `.fbmchucgbcol`). The `?t=` on the script URLs only forces a fresh download, so SimpleTix can change the files at any time.
- **Only one widget per page.** Every embed uses the same element IDs (`smt_hdnApplicationId`, `smt_pinBoard`, and others).
- **Extra font downloads.** `widget.min.css` loads Mulish and Poppins from Google Fonts. Avoiding that means hosting our own copy of the stylesheet and losing SimpleTix's updates.
- **A fully custom design.** `GetPinBoard` returns HTML, not structured data. The alternative is to render our own cards and attach SimpleTix checkout to each one. See [simpletix-custom-cards-feasibility.md](./simpletix-custom-cards-feasibility.md).

## Sources

- [Advanced CSS Customizations](https://help.simpletix.com/docs/css/css)
- [Customizing Checkout Colors](https://help.simpletix.com/docs/css/customizing-checkout-colors)
- [Embedding SimpleTix Events & Widgets](https://help.simpletix.com/docs/embed/widget-overview)
- [Event and Sitewide Customizations](https://help.simpletix.com/docs/css/customizing-simpletix-event-pages)
- [Customizing Your SimpleTix Store](https://help.simpletix.com/docs/store-settings/customizations/customizing-your-simpletix-store)
