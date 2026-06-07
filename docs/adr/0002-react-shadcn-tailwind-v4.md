# 0002. React islands, shadcn/ui, and Tailwind v4 for the UI

- **Status:** Accepted
- **Date:** 2026-06-07
- **Deciders:** Cicada Cinema maintainers

## Context

Astro renders our content statically (see ADR-0001), but parts of the site need
real interactivity — for example filtering and sorting the screenings archive.
We also want a consistent, accessible component set that volunteers can build on
without designing every primitive from scratch, and a styling approach that is
quick to work with and easy to keep consistent.

## Decision

We will layer the UI on three choices:

- **React 19 islands.** Interactive components are written in React and embedded
  in `.astro` files using Astro's hydration directives, so we only ship
  JavaScript where interactivity is actually required. React is enabled via
  `@astrojs/react`.
- **shadcn/ui on `@base-ui/react`.** Base UI primitives (`src/components/ui/`)
  are generated and owned in-repo via the shadcn CLI (`pnpm shadcn add ...`,
  configured in `components.json`) rather than pulled from a black-box component
  library. They are built on `@base-ui/react` for accessible behavior.
- **Tailwind CSS v4 via the Vite plugin.** Styling uses Tailwind v4 wired in as a
  Vite plugin (`@tailwindcss/vite`), **not** as a PostCSS plugin. There is no
  `tailwind.config.*`; theme customization lives as CSS custom properties in
  `src/global.css`, which carries the single `@import "tailwindcss"` directive.

## Consequences

- We own our base components as source, so they can be customized freely — but we
  are responsible for keeping them updated rather than receiving library upgrades.
- Tailwind config lives in CSS, so contributors must know to edit `global.css`
  (CSS custom properties) rather than reaching for a JS config file.
- React/JSX is the component model; TypeScript uses the `react-jsx` transform
  with `react` as the JSX import source.
- Shipping interactivity is opt-in per component via hydration directives, which
  keeps the default payload small but requires authors to think about hydration.

## Alternatives Considered

- **Astro/Vue/Svelte components instead of React:** rejected — the team is most
  comfortable in React and shadcn/ui targets React.
- **A packaged component library (e.g. MUI):** rejected in favor of shadcn/ui's
  copy-into-repo model, which gives us full control over markup and styling.
- **Tailwind via PostCSS or a JS config:** rejected — the v4 Vite plugin with
  CSS-based theming is the current Tailwind direction and is simpler to wire into
  our Vite/Astro setup.
