import { Schema } from "effect";

/**
 * Shape of the extra data StudioCMS stores alongside a `Screening` page.
 *
 * The page's own title holds the film name, so it is deliberately absent here.
 * Everything else mirrors `ArchivedScreening` in `src/lib/archived-screenings.ts`
 * so the existing archive table can consume CMS records without a new type.
 */
export const ScreeningData = Schema.Struct({
  date: Schema.String,
  series: Schema.String,
  year: Schema.String,
  location: Schema.String,
  partners: Schema.String,
});

export type ScreeningData = typeof ScreeningData.Type;

/** Identifier the plugin registers itself under. Used as the plugin-data key. */
export const PLUGIN_ID = "cicada-screenings";

/** Identifier of the page type, as stored in `StudioCMSPageData.package`. */
export const PAGE_TYPE_ID = "cicada-screenings/screening";

/** An empty record, used to seed a screening the moment its page is created. */
export const emptyScreeningData = (): ScreeningData => ({
  date: "",
  series: "",
  year: "",
  location: "",
  partners: "",
});
