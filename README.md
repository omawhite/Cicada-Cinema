# Cicada Cinema

Cicada Cinema is a nonprofit pop-up movie theater in Bloomington, IN. This repo is the source for the Cicada Cinema website.

---

## Tech Stack

| Layer | Tool |
| --- | --- |
| Framework | [Astro 6](https://docs.astro.build) |
| UI | [React 19](https://react.dev) + [shadcn/ui](https://ui.shadcn.com) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) (Vite plugin) |
| Deployment | [Cloudflare Workers](https://workers.cloudflare.com) |
| Component development | [Storybook 10](https://storybook.js.org) + [Chromatic](https://www.chromatic.com) |
| Testing | [Vitest](https://vitest.dev) + [Playwright](https://playwright.dev) |
| Package manager | [pnpm](https://pnpm.io) |

---

## Prerequisites

- **Node.js** ≥ 22
- **pnpm** — installation [instructions](https://pnpm.io/installation)

---

## Getting Started

```sh
git clone <repo-url>
cd cicada-cinema
pnpm install
pnpm dev       # → http://localhost:4321
```

To browse and develop components in isolation, run Storybook alongside the dev server:

```sh
pnpm storybook # → http://localhost:6006
```

---

## Project Structure

```text
src/
├── assets/          # Images and static assets
├── components/
│   ├── ui/          # Base UI components (shadcn/ui)
│   ├── Banner.tsx
│   └── Header.tsx
├── layouts/
│   └── Layout.astro # Main page layout wrapper
├── lib/
│   └── utils.ts     # Shared utilities (cn() for class names)
├── pages/
│   └── index.astro  # Homepage route (/)
└── global.css       # Global styles and Tailwind v4 imports
```

Astro uses file-based routing — every `.astro` file in `src/pages/` becomes a route.

---

## Adding UI Components

This project uses [shadcn/ui](https://ui.shadcn.com) for base components. To add a new component:

```sh
pnpm shadcn add <component-name>
```

Components land in `src/components/ui/`. Configuration lives in [`components.json`](components.json).

Please add a Storybook story (`.stories.tsx`) alongside any new component so it can be reviewed and tested visually.

---

## Contributing

1. Branch off `main` for your changes
2. Open a pull request — Chromatic will automatically post a visual diff for any component changes
3. Keep PRs focused and scoped to one concern

If you need Cloudflare deployment access or have questions about the project, reach out to the project lead.

---

## Deployment

The site runs on Cloudflare Workers. Deployments require Cloudflare account access.

- **Production**: `pnpm deploy`
- **Preview**: `pnpm deploy:preview`
