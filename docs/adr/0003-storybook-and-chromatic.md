# 0003. Storybook and Chromatic for component development and visual review

- **Status:** Accepted
- **Date:** 2026-06-07
- **Deciders:** Cicada Cinema maintainers

## Context

The UI is built from many small React components (see ADR-0002), and the design
originates in Figma. With volunteer contributors and asynchronous review, we need
a way to develop components in isolation, document their variants, and catch
unintended visual changes before they reach production — without requiring every
reviewer to spin up the full app and hunt for the relevant state.

## Decision

We will use **Storybook 10** for component development and **Chromatic** for
visual regression review.

- Every component should ship with a colocated story file in a `__stories__/`
  directory (`*.stories.tsx`) covering its meaningful states. This is a
  contribution expectation, not just a convenience.
- Storybook runs locally via `pnpm storybook` and builds via
  `pnpm build-storybook`.
- Chromatic publishes the built Storybook and posts a visual diff on pull
  requests, so reviewers can approve or reject pixel-level changes.

## Consequences

- Components are documented and reviewable in isolation, and visual regressions
  are caught at PR time rather than in production.
- Contributors take on the overhead of writing and maintaining stories alongside
  components; PRs without stories for new components are incomplete.
- Chromatic is an external dependency and a service we rely on in the PR flow.
- Stories double as fixtures for the Storybook Vitest project, tying component
  documentation and testing together.

## Alternatives Considered

- **No isolated component environment** (develop only inside the running app):
  rejected — slower to iterate on individual states and offers no visual
  regression safety net.
- **Visual review by manual screenshots / eyeballing previews:** rejected —
  error-prone and not enforced; Chromatic automates the diff on every PR.
