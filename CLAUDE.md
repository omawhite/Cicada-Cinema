# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```sh
pnpm dev             # Start dev server at localhost:4321
pnpm build           # Build to ./dist/
pnpm preview         # Build then serve via wrangler dev
pnpm lint            # Run ESLint
pnpm format          # Run Prettier (write)
pnpm format:check    # Check formatting without writing
pnpm typecheck       # Run astro check (TypeScript); alias: pnpm astro:check
pnpm test            # Run Vitest across all projects (passes with no tests)
pnpm test:unit       # Run only the "unit" Vitest project
pnpm test:storybook  # Run Storybook interaction tests via the Vitest addon
pnpm storybook       # Start Storybook dev server at localhost:6006
pnpm build-storybook # Build static Storybook
pnpm deploy          # Deploy to Cloudflare Workers via wrangler
pnpm deploy:preview  # Upload a preview version via wrangler
```

To run a single test file: `pnpm vitest run <path/to/test> --project unit`

## Architecture

This is an **Astro 7** site deployed to **Cloudflare Workers** using the `@astrojs/cloudflare` adapter. The stack:

- **Astro** — file-based routing from `src/pages/`. Pages use `.astro` files; shared UI lives in `src/components/` (including `src/components/ui/` for shadcn/ui primitives), layouts in `src/layouts/`, and shared logic in `src/lib/`.
- **React** — enabled via `@astrojs/react`. React components can be used inside `.astro` files with island hydration directives.
- **shadcn/ui** — component library configured via `components.json` (style `base-luma`, `stone` base color, `lucide` icons). The `@/*` path alias (`tsconfig.json`) maps to `./src/*` for component/lib imports.
- **Tailwind CSS v4** — integrated as a Vite plugin (`@tailwindcss/vite`), not a PostCSS plugin. Global styles live in `src/global.css`, which imports `tailwindcss`, `tw-animate-css`, `shadcn/tailwind.css`, and the Roboto variable font, plus an inline `@theme` block mapping shadcn CSS variables (sidebar, chart, etc.) to Tailwind tokens.
- **Cloudflare Workers** — configured in `wrangler.jsonc`. Static assets are served from `dist/client` (not `dist/`) bound as `ASSETS`. `nodejs_compat` flag enabled. A KV namespace (`SESSION`) is also bound.
- **Storybook** — stories live alongside components in `__stories__` directories (e.g. `src/components/__stories__/`) and run as part of the Vitest `storybook` project via `@storybook/addon-vitest`.

### Key integration notes

- Tailwind v4 is configured via CSS, not `tailwind.config.*`. Add theme customizations with CSS custom properties in `src/global.css`.
- TypeScript uses `astro/tsconfigs/strict` with `react-jsx` transform. JSX import source is `react`. Use the `@/*` alias instead of relative imports across `src/`.
- ESLint uses flat config (`eslint.config.js`) with `eslint-plugin-astro`, `typescript-eslint`, and `eslint-plugin-storybook`.
- Vitest (`vitest.config.ts`) is split into two projects: `unit` (`*.test.ts`/`*.spec.ts`, e.g. `src/lib/__test__/`) and `storybook` (Storybook interaction tests, run headless via `@vitest/browser-playwright`/Chromium).
- New `src/lib/*.ts` files should have a matching `*.test.ts` under `src/lib/__test__/`.
