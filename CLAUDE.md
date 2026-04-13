# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```sh
pnpm dev          # Start dev server at localhost:4321
pnpm build        # Build to ./dist/
pnpm lint         # Run ESLint
pnpm format       # Run Prettier (write)
pnpm format:check # Check formatting without writing
pnpm typecheck    # Run astro check (TypeScript)
pnpm test         # Run Vitest (passes with no tests)
pnpm deploy       # Deploy to Cloudflare Workers via wrangler
```

To run a single test file: `pnpm vitest run <path/to/test>`

## Architecture

This is an **Astro 6** site deployed to **Cloudflare Workers** using `@astrojs/cloudflare` adapter. The stack:

- **Astro** — file-based routing from `src/pages/`. Pages use `.astro` files; components go in `src/components/` (not yet created).
- **React** — enabled via `@astrojs/react`. React components can be used inside `.astro` files with island hydration directives.
- **Tailwind CSS v4** — integrated as a Vite plugin (`@tailwindcss/vite`), not a PostCSS plugin. Global styles live in `src/global.css` with a single `@import "tailwindcss"` directive.
- **Cloudflare Workers** — configured in `wrangler.jsonc`. Static assets served from `dist/` bound as `ASSETS`. `nodejs_compat` flag enabled.

### Key integration notes

- Tailwind v4 is configured via CSS, not `tailwind.config.*`. Add theme customizations with CSS custom properties in `src/global.css`.
- TypeScript uses `astro/tsconfigs/strict` with `react-jsx` transform. JSX import source is `react`.
- ESLint uses flat config (`eslint.config.js`) with `eslint-plugin-astro` and `typescript-eslint`.
