import { runSDK, SDKCoreJs } from "studiocms:sdk";
import type { PluginAPIRoute } from "studiocms/plugins";
import {
  emptyScreeningData,
  PLUGIN_ID,
  ScreeningData,
  type ScreeningData as ScreeningDataType,
} from "./schema";

const validator = { effectSchema: ScreeningData };

const entryFor = (pageId: string) =>
  SDKCoreJs.PLUGINS.usePluginData(PLUGIN_ID, { entryId: pageId, validator });

const ok = () => new Response(null, { status: 204 });

/**
 * Reads the screening fields out of the dashboard's edit-form submission.
 *
 * StudioCMS hands custom page-type fields over as `FormDataEntryValue | null`,
 * so every value is coerced to a string before it is validated.
 */
function toScreeningData(
  pluginFields: Record<string, FormDataEntryValue | null>,
): ScreeningDataType {
  const text = (key: keyof ScreeningDataType) => {
    const value = pluginFields[key];
    return typeof value === "string" ? value.trim() : "";
  };
  return {
    date: text("date"),
    series: text("series"),
    year: text("year"),
    location: text("location"),
    partners: text("partners"),
  };
}

/**
 * StudioCMS persists only the core page row; the fields a page type declares
 * are this module's responsibility. The create form does not render custom
 * fields, so a new screening is seeded blank and filled in on its edit screen.
 */
export const onCreate: PluginAPIRoute<"onCreate"> = async ({ pageData }) => {
  await runSDK(entryFor(pageData.id).insert(emptyScreeningData()));
  return ok();
};

export const onEdit: PluginAPIRoute<"onEdit"> = async ({
  pageData,
  pluginFields,
}) => {
  const data = toScreeningData(pluginFields);
  const entry = entryFor(pageData.id);
  const existing = await runSDK(entry.select());
  await runSDK(existing ? entry.update(data) : entry.insert(data));
  return ok();
};

/**
 * The plugin-data SDK exposes no delete, so a removed page leaves its record
 * behind. `getScreenings` reads from the page list rather than from plugin
 * data, so an orphaned record is never rendered; blanking it keeps the row
 * from carrying stale content if the id is ever reused.
 */
export const onDelete: PluginAPIRoute<"onDelete"> = async ({ pageData }) => {
  const entry = entryFor(pageData.id);
  const existing = await runSDK(entry.select());
  if (existing) await runSDK(entry.update(emptyScreeningData()));
  return ok();
};
