# StudioCMS POC — Screenings collection

A proof-of-concept integration of [StudioCMS](https://studiocms.dev) into this
site, with one editor-managed collection: **Screenings**.

> **Status: work in progress.** The Cloudflare Workers build succeeds and the
> StudioCMS setup wizard renders, but first-run setup does not complete yet.
> See [Findings](#findings-running-studiocms-on-cloudflare-workers).

## Running it

StudioCMS needs a libSQL database reachable over HTTP (see
[Findings](#1-a-worker-cannot-open-a-file-database)), so the database runs as a
separate local process.

```sh
cp .env.example .env && cp .env.example .dev.vars   # then fill CMS_ENCRYPTION_KEY
openssl rand --base64 16                            # value for CMS_ENCRYPTION_KEY

pnpm db:serve      # terminal 1 — local libSQL server on :8080
pnpm cms:migrate --latest   # once, to create the StudioCMS tables
pnpm dev           # terminal 2
```

Then visit `/start` to create the first owner account. Once setup completes, set
`dbStartPage: false` in `studiocms.config.mjs`; the dashboard moves to
`/dashboard` and `/` returns to the site's own homepage.

For a deployed environment, point `CMS_LIBSQL_URL` at a Turso database and drop
`CMS_LIBSQL_TLS`. Nothing else changes.

## The collection

StudioCMS has no content-collection primitive. The equivalent is a plugin that
registers a **page type**, which the dashboard then gives list/create/edit/delete
UI for automatically. `src/studiocms/screenings/` defines one:

- **`schema.ts`** — the record shape (`date`, `series`, `year`, `location`,
  `partners`) as an `effect/Schema` struct, used to validate reads and writes.
  A screening's film name is the page title, so it is not a separate field.
- **`index.ts`** — `definePlugin(...)` registering the `Screening` page type and
  its editor fields.
- **`api.ts`** — StudioCMS persists only the core page row; a page type's custom
  fields are the plugin's job. This exports the `onCreate` / `onEdit` /
  `onDelete` hooks that store them via the SDK's plugin-data table.

Custom fields render on a page's **edit** screen, not the create screen, so the
flow is: create the screening (title = film), then edit it to fill in the rest.

`src/lib/screenings-cms.ts` reads them back in the shape of the existing
`ArchivedScreening` interface, so `/archive` renders them through the
`ScreeningsArchiveTable` component that already existed — sorting and filtering
included, with no new UI code.

## Findings: running StudioCMS on Cloudflare Workers

StudioCMS 0.4.4 targets `astro ^5.12.9` and a Node server; this project is Astro
7 on `@astrojs/cloudflare`. The Astro version gap caused far less trouble than
expected — one compiler error. The real friction is that **workerd cannot
evaluate CommonJS**, and several packages reach every server route.

Each workaround below is a deliberate, narrow patch. They are listed so a future
reader can tell which are permanent and which should disappear as StudioCMS
gains Workers support.

### 1. A Worker cannot open a `file:` database

Under the `workerd` export condition `@libsql/client` resolves to its web build,
which supports only `libsql:`/`http(s):`/`ws(s):`. This applies in `astro dev`
too, since the Cloudflare adapter runs server routes in workerd — so a local
SQLite file is unusable even for development. `pnpm db:serve` runs `sqld` over
HTTP instead, which also matches the production topology exactly.

### 2. Astro 7 rejects a StudioCMS component (`patches/studiocms@0.4.4.patch`)

`Code.astro` has top-level `return` statements inside an `is:inline` script.
Astro 5 accepted it; Astro 7's compiler fails the build. The patch wraps the
script body in an IIFE. It is the only one of 107 StudioCMS `.astro` files
affected.

### 3. CommonJS and Node-only packages in the request path

Aliased in `astro.config.mjs`, with the reasoning in each stub file:

| Package                                | Why it is in the bundle                                                                                      | Treatment                                                                                |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------- |
| `@effect/platform-node`, `@effect/cli` | `@withstudiocms/effect` re-exports both namespaces from its entry point; StudioCMS uses them only in its CLI | empty module (`cli-only-modules.ts`)                                                     |
| `micromatch`                           | the middleware router's path matching; CJS-only                                                              | picomatch-backed ESM shim                                                                |
| `diff2html`                            | statically imported by `@withstudiocms/sdk`; its `hogan` templating is CJS with no browser build             | shim that throws — **costs the dashboard's diff viewer**, so keep diff tracking disabled |
| `pg`, `mysql2`                         | uninstalled optional peers the bundler still resolves for the unused dialects                                | throwing stub                                                                            |

### 4. The dev logger assumes one JS realm

`@inox-tools/runtime-logger` (a StudioCMS dependency) hands the Astro logger to
the app through Node's `globalThis`. Its build plugin reads that defensively
with a fallback; its dev plugin does not:

```js
const logger = globalThis[Symbol.for(...)].get('studiocms-runtime');
```

With server routes running in workerd — a separate realm — that symbol is never
there, so **every** server route died at import with `Cannot read properties of
undefined (reading 'get')`. This is precisely why the production build worked
while dev did not. `scripts/vite-studiocms-dev-logger.mjs` serves an equivalent
console-backed logger instead.

### 5. Known remaining blocker

`kysely-turso` — the libSQL driver StudioCMS loads for this dialect — ships
CommonJS (`main: ./dist/index.cjs`), so `getDbClient` throws `require is not
defined` inside workerd and the setup wizard's POST fails. Same class of problem
as the table above, one layer deeper.

### Verified

- `pnpm build` produces a working Cloudflare Workers bundle.
- `pnpm lint`, `pnpm format:check`, `pnpm astro:check`, `pnpm test:unit` all pass.
- The eight pre-existing pages still prerender exactly as before; only `/archive`
  and StudioCMS's own routes are server-rendered.
- `/start` renders inside workerd, and a Worker route queries the libSQL server
  successfully.
