import { runSDK, SDKCoreJs } from "studiocms:sdk";
import type { ArchivedScreening } from "@/lib/archived-screenings";
import {
  emptyScreeningData,
  PAGE_TYPE_ID,
  PLUGIN_ID,
  ScreeningData,
  type ScreeningData as ScreeningDataType,
} from "@/studiocms/screenings/schema";

const validator = { effectSchema: ScreeningData };

/**
 * Loads every screening managed in StudioCMS, in the shape the existing
 * archive table already consumes.
 *
 * Pages drive the list and plugin data supplies the extra fields, so a page
 * deleted in the dashboard disappears here even though its plugin-data record
 * lingers (the SDK has no delete for those).
 */
export async function getScreenings(): Promise<ArchivedScreening[]> {
  const [pages, entries] = await Promise.all([
    runSDK(SDKCoreJs.GET.packagePages(PAGE_TYPE_ID)),
    runSDK(
      SDKCoreJs.PLUGINS.usePluginData(PLUGIN_ID, { validator }).getEntries(),
    ),
  ]);

  const dataByPageId = new Map<string, ScreeningDataType>(
    (entries as { id: string; data: ScreeningDataType }[]).map((entry) => [
      entry.id.slice(`${PLUGIN_ID}-`.length),
      entry.data,
    ]),
  );

  return pages
    .filter((page) => !page.draft)
    .map((page) => {
      const data = dataByPageId.get(page.id) ?? emptyScreeningData();
      return {
        date: data.date,
        film: page.title,
        series: data.series,
        year: data.year,
        location: data.location,
        partners: data.partners,
      };
    });
}
