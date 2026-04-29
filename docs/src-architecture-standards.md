# Src Architecture Standards

This document defines the baseline structure for `src` so feature work stays predictable and easy to navigate.

## Naming

- Folder names use `kebab-case`.
- React component and page files use `PascalCase.tsx`.
- Shared non-component utilities use `camelCase.ts`.
- Constants use `UPPER_SNAKE_CASE`.

## Feature Layout

- Course/game features should prefer cohesive folders where page, game logic, and local data are near each other.
- Shared cross-feature code belongs in `src/lib`, `src/components`, `src/context`, or `src/types`.
- Avoid placing feature-only components in `src/components` unless reused by multiple features.

## Game Data Ownership

- If game data is reused across routes or tests, place it in `src/data`.
- If game data is specific to one game, place it in a local `data.ts` next to that game component.
- Game components should primarily own rendering and interaction flow, not large static datasets.

## Routing

- `src/routes/routeMetadata.tsx` remains the single source of route records.
- Route records should be organized in domain slices (landing, courses, wellbeing, admin) and composed into one export.
- Access wrappers are applied in app composition, not duplicated inside route elements.

## Tracking + Timer Patterns

- Use shared hooks for session lifecycle and timer countdown behavior.
- Use `generateSessionId()` as the only session ID strategy.
- Emit `game_started`, `game_completed`, and `game_over` through standardized tracking helpers.
