# Deferred Hook Dependency Warnings

These `react-hooks/exhaustive-deps` warnings were intentionally deferred during the safe lint pass because dependency changes may affect timer cadence, completion event timing, or voice/game-loop behavior.

## Deferred Files

- `src/components/PairMatchingGame.tsx`
- `src/pages/courses/financial-literacy/games/BudgetingGame.tsx`
- `src/pages/courses/know-your-health/games/BrainHealthGame.tsx`
- `src/pages/courses/know-your-health/games/FinishRaceGame.tsx`
- `src/pages/courses/know-your-health/games/LeastSugarGame.tsx`
- `src/pages/courses/know-your-health/games/SometimesAnytimeGame.tsx`
- `src/pages/courses/know-your-health/games/WaterGlassGame.tsx`
- `src/pages/courses/wellbeing/environmental-wellbeing/games/PlanetProtectorGame.tsx`
- `src/pages/courses/wellbeing/occupational-wellbeing/games/JobPathMaze.tsx`
- `src/pages/courses/wellbeing/occupational-wellbeing/games/SkillsJobsSort.tsx`
- `src/pages/courses/wellbeing/physical-wellbeing/games/HealthyPlateGame.tsx`
- `src/pages/courses/wellbeing/spiritual-wellbeing/games/SuryaNamaskarGame.tsx`

## Follow-up Refactor Direction

1. Extract interval/timer logic to dedicated hooks.
2. Move completion tracking calls into stable callbacks via `useCallback`.
3. Re-run lint and validate with targeted gameplay regression checks.
