import { fileURLToPath } from "node:url";
import { definePlugin } from "studiocms/plugins";
import { PAGE_TYPE_ID, PLUGIN_ID } from "./schema";

const resolve = (path: string) => fileURLToPath(new URL(path, import.meta.url));

/**
 * Registers a `Screening` page type with StudioCMS.
 *
 * StudioCMS has no content-collection primitive; a plugin-registered page type
 * is the equivalent. Declaring one here is what gives the dashboard its
 * list/create/edit/delete UI for screenings.
 *
 * The page title doubles as the film name so the built-in page list stays
 * readable. The five fields below are rendered on the page's edit screen and
 * handed to `api.ts`, which is responsible for persisting them — StudioCMS
 * saves only the core page row itself.
 */
export function screeningsPlugin() {
  return definePlugin({
    identifier: PLUGIN_ID,
    name: "Screenings",
    studiocmsMinimumVersion: "0.4.4",
    hooks: {
      "studiocms:rendering": ({ setRendering }) =>
        setRendering({
          pageTypes: [
            {
              identifier: PAGE_TYPE_ID,
              label: "Screening",
              description:
                "A single Cicada Cinema screening. The page title is the film name.",
              apiEndpoint: resolve("./api.ts"),
              fields: [
                {
                  name: "date",
                  label: "Date (YYYY-MM-DD)",
                  input: "input",
                  type: "text",
                  placeholder: "2024-06-14",
                  required: true,
                },
                {
                  name: "series",
                  label: "Series",
                  input: "input",
                  type: "text",
                  required: true,
                },
                {
                  name: "year",
                  label: "Film release year",
                  input: "input",
                  type: "text",
                },
                {
                  name: "location",
                  label: "Location",
                  input: "input",
                  type: "text",
                },
                {
                  name: "partners",
                  label: "Partners",
                  input: "input",
                  type: "text",
                },
              ],
            },
          ],
        }),
    },
  });
}

export default screeningsPlugin;
