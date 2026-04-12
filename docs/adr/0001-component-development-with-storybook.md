# ADR 0001: Component Development with Storybook

**Date:** 2026-04-12
**Status:** Accepted

## Context

Cicada Cinema is built on Astro, which is primarily a content-focused framework. As the UI grows, we need a structured way to build, document, and test React components in isolation — without requiring a full Astro dev server and page context to work on individual UI pieces.

The project also needed a `src/components/` directory and a clear pattern for how components are developed and reviewed before being integrated into pages.

## Decision

We adopted [Storybook](https://storybook.js.org) (v10) as the component development environment, using the `@storybook/react-vite` framework.

Key configuration decisions made alongside this:

- **Framework:** `@storybook/react-vite` — Storybook's Vite-native React framework. Chosen because the project already uses Vite (via Astro) and avoids the overhead of a Webpack-based setup.
- **JSX runtime:** Configured `esbuild: { jsx: 'automatic' }` via `viteFinal` in `.storybook/main.ts`. Because Storybook's Vite builder runs independently from `astro.config.mjs`, it does not inherit Astro's React plugin and defaults to the classic JSX transform. The automatic runtime (React 17+) removes the need for `import React from 'react'` in every file.
- **Docs addon:** `@storybook/addon-docs` for auto-generated component documentation from prop types and JSDoc comments.
- **Story format:** CSF3 (Component Story Format 3) with `satisfies Meta<typeof Component>` for full TypeScript inference on args.
- **Port:** Storybook runs on port `6006` (`pnpm storybook`).

## Consequences

**Positive:**
- Components can be built and reviewed in isolation before being wired into Astro pages.
- Prop documentation is generated automatically from TypeScript types.
- The `src/components/` directory establishes a clear home for all shared React components.
- Stories serve as lightweight living documentation for the design system.

**Negative / Trade-offs:**
- Storybook runs as a separate dev server from Astro — developers need to be aware there are two servers (`pnpm dev` for the site, `pnpm storybook` for components).
- Storybook's Vite instance does not share Astro's config, so any Vite plugins used in `astro.config.mjs` (e.g. for CSS, SVGs) must be duplicated in `.storybook/main.ts` via `viteFinal` if stories depend on them.
