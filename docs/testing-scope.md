# Testing Scope and Depth

This file locks the first wave of automated checks for the Playwright + Storybook rollout.

## Depth Targets

- **Depth 1 (now):** 5-8 Playwright smoke journeys + Storybook stories/interactions for high-change UI.
- **Depth 2 (next):** expand to negative-path browser tests, visual regression, and broader story coverage.

## Locked Playwright Smoke Journeys (Depth 1)

1. Home page renders and shows core navigation cards.
2. User can navigate from Home to `3d-wellness`.
3. Direct game URL without profile redirects to `player-info`.
4. Submitting player info returns user to intended game path.
5. Existing profile in localStorage bypasses `player-info` gate for game entry.
6. Representative game start screen is reachable after profile submit (`least-sugar-game`).
7. Invalid `returnTo` query falls back safely to `/`.
8. Admin login route renders expected sign-in controls.

## Storybook Focus (Depth 1)

- Player profile form states:
  - default
  - prefilled
  - required-field validation
  - successful submit callback
- Route shell stories for:
  - Home page
  - 3D Wellness page

## Move to Depth 2 Only When

- Smoke suite remains stable (low flaky retries) for at least 2 weeks.
- CI duration remains acceptable for pull-request workflows.
- Team is ready to maintain visual baselines and expanded test matrix.
