# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Use **pnpm** for everything. See the `scripts` field in [`package.json`](package.json)
for the full, authoritative list of available commands.

`package.json` is also the source of truth for the runtime:

- **Node version** — the `engines.node` field. Match it locally and in CI.
- **Package manager** — the `packageManager` field pins the pnpm version; use pnpm, not npm or yarn.

To run a single test file: `pnpm vitest run <path/to/test>`

## Architecture

This is an **Astro 6** site deployed to **Cloudflare Workers** using the `@astrojs/cloudflare` adapter. The stack:

- **Astro** — file-based routing from `src/pages/`. Pages use `.astro` files; React components live in `src/components/` (UI primitives in `src/components/ui/`).
- **React 19** — enabled via `@astrojs/react`. React components are used inside `.astro` files with island hydration directives, so JavaScript ships only where interactivity is needed.
- **shadcn/ui** — base UI components in `src/components/ui/`, built on `@base-ui/react` and owned in-repo. Add new ones with `pnpm shadcn add <component>`; config lives in `components.json`.
- **Tailwind CSS v4** — integrated as a Vite plugin (`@tailwindcss/vite`), not a PostCSS plugin. Global styles live in `src/global.css` with a single `@import "tailwindcss"` directive.
- **Cloudflare Workers** — configured in `wrangler.jsonc`. Static assets served from `dist/` bound as `ASSETS`. `nodejs_compat` flag enabled. A `SESSION` KV namespace is bound (currently a workaround so Worker preview deploys don't break; not yet used by app code).
- **Storybook 10 + Chromatic** — components are developed in isolation in Storybook and visually reviewed via Chromatic on PRs. Each component has a colocated story in a `__stories__/` directory (`*.stories.tsx`).
- **Testing** — Vitest with two projects: `unit` and `storybook` (the latter runs in Playwright browser mode against stories).

### Key integration notes

- Tailwind v4 is configured via CSS, not `tailwind.config.*`. Add theme customizations with CSS custom properties in `src/global.css`.
- TypeScript uses `astro/tsconfigs/strict` with the `react-jsx` transform. JSX import source is `react`.
- ESLint uses flat config (`eslint.config.js`) with `eslint-plugin-astro`, `eslint-plugin-storybook`, and `typescript-eslint`.
- When adding or changing a component, add/update its `*.stories.tsx` so it can be reviewed and visually tested.
- PR titles must follow Conventional Commits (enforced by a CI workflow). Dependency updates are grouped via Dependabot.

## Architecture Decision Records

Architecturally significant decisions are recorded as ADRs in [`docs/adr/`](docs/adr/). Read them for the "why" behind the stack, and add a new one (copy `docs/adr/template.md`) when making a significant decision.
