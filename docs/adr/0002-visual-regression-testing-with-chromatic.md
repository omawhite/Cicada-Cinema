# ADR 0002: Visual Regression Testing with Chromatic

**Date:** 2026-04-12
**Status:** Accepted

## Context

With Storybook established as the component development environment (see ADR 0001), we needed a way to catch unintended visual regressions as the component library grows. Pull requests that change shared components can silently break their appearance, and manual visual review does not scale reliably.

We also wanted CI integration so that visual review happens automatically on every PR without requiring a locally running Storybook.

## Decision

We adopted [Chromatic](https://www.chromatic.com) for automated visual regression testing and Storybook publishing.

Chromatic was chosen because:
- It is purpose-built for Storybook and requires minimal configuration — it receives the `build-storybook` output directly.
- It captures pixel-level snapshots of every story on every PR and surfaces diffs for review.
- It provides a hosted, shareable Storybook URL per branch, making design and product review easier.
- It integrates natively with GitHub via a GitHub Actions workflow, blocking merges on unreviewed visual changes.

A GitHub Actions workflow (`.github/workflows/chromatic.yml`) was added that:
1. Runs on every push to `main` and on all PRs targeting `main`.
2. Installs dependencies via pnpm with a frozen lockfile.
3. Invokes the `chromaui/action` with the `build-storybook` script.

Authentication uses a `CHROMATIC_PROJECT_TOKEN` stored as a GitHub Actions secret.

## Consequences

**Positive:**
- Visual regressions in components are caught automatically before merge.
- Every PR gets a hosted Storybook URL for stakeholder review without running anything locally.
- Chromatic's snapshot history provides a visual changelog of the component library over time.

**Negative / Trade-offs:**
- Chromatic is a paid service beyond its free tier — snapshot usage should be monitored as the component library grows.
- A `CHROMATIC_PROJECT_TOKEN` must be added to GitHub repository secrets manually after linking the repo in the Chromatic dashboard. CI builds will fail until this is in place.
- Each CI run builds the full Storybook, which adds build time proportional to the number of stories.
