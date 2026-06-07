# 0001. Astro on Cloudflare Workers

- **Status:** Accepted
- **Date:** 2026-06-07
- **Deciders:** Cicada Cinema maintainers

## Context

Cicada Cinema is a small nonprofit pop-up theater. The website is primarily
content — show listings, an archive of past screenings, and informational
pages — with a few interactive widgets (filtering/sorting the archive). It is
maintained by volunteers, so we need a stack that is cheap to host, fast for
visitors, and approachable for contributors who already know the React
ecosystem.

We wanted:

- Static-first rendering for content pages, so the site is fast and cheap.
- The ability to drop in interactive UI where it's actually needed, rather than
  shipping a full single-page app.
- Low or zero hosting cost with minimal operational overhead.

## Decision

We will build the site with **Astro 6** and deploy it to **Cloudflare Workers**
via the `@astrojs/cloudflare` adapter.

- Astro provides file-based routing from `src/pages/` and renders content pages
  statically by default, with islands for interactivity (see ADR-0002).
- Cloudflare Workers serves the build output from `dist/`, bound as the `ASSETS`
  binding in `wrangler.jsonc`, with the `nodejs_compat` compatibility flag
  enabled.
- Deploys go through Wrangler: `pnpm deploy` for production and
  `pnpm deploy:preview` (`wrangler versions upload`) for preview versions.

## Consequences

- Content pages are static and served from Cloudflare's edge, keeping the site
  fast and hosting costs near zero.
- We are tied to the Cloudflare Workers runtime and Wrangler tooling; server-side
  features must be compatible with the Workers environment (hence
  `nodejs_compat`).
- A `SESSION` KV namespace is bound in `wrangler.jsonc`. It is not yet used by
  application code — it exists because Cloudflare Worker preview deploys were
  breaking without a bound namespace. It is a deployment workaround for now, and
  a placeholder for future session/state needs.
- Deployment requires Cloudflare account access, which gates who can ship to
  production.

## Alternatives Considered

- **A full React SPA (e.g. Vite + React Router):** rejected — overkill for a
  mostly-static content site and worse for performance and SEO.
- **A traditional Node host (Vercel/Netlify/VPS):** workable, but Cloudflare
  Workers gives us cheaper edge hosting and we were already comfortable with the
  Cloudflare ecosystem.
