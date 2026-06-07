# Architecture Decision Records

This directory holds the Architecture Decision Records (ADRs) for Cicada Cinema.

An ADR captures a single architecturally significant decision — the context that
forced it, the choice that was made, and the consequences that follow. They are
immutable once accepted: rather than editing an old decision, write a new ADR
that supersedes it.

## Format

We use the [Michael Nygard](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)
format. Copy [`template.md`](./template.md) to start a new record.

## Naming

Files are numbered sequentially and zero-padded:

```
NNNN-short-title-in-kebab-case.md
```

For example: `0001-use-astro-with-cloudflare-workers.md`.

## Index

| # | Title | Status |
| --- | --- | --- |
| [0001](./0001-astro-on-cloudflare-workers.md) | Astro on Cloudflare Workers | Accepted |
| [0002](./0002-react-shadcn-tailwind-v4.md) | React islands, shadcn/ui, and Tailwind v4 for the UI | Accepted |
| [0003](./0003-storybook-and-chromatic.md) | Storybook and Chromatic for component development and visual review | Accepted |
