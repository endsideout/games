# Testing Maintenance and Scale-Up

This checklist is used after each sprint to decide whether to stay at Depth 1 or move to Depth 2.

## Weekly Health Check

- **Flake budget:** failed-then-pass retries should stay below 2% of test runs.
- **CI duration:** total pull-request checks should remain within team tolerance.
- **Failure quality:** failures should be actionable (clear selector/state issue, not random timeouts).

## Expand to Depth 2 When All Are True

- Depth 1 smoke journeys have been stable for at least 2 consecutive weeks.
- Storybook interaction tests are part of everyday PR validation.
- Team agrees to maintain visual baselines and snapshot updates.

## Depth 2 Additions

- Add Storybook visual regression baseline and approval flow.
- Expand Playwright to key negative-path scenarios per major game family.
- Add accessibility checks to priority stories and smoke journeys.

## Ongoing Suggestions

- Keep selectors semantic first (`getByRole`, `getByLabel`), then use `data-testid` only where needed.
- Prefer one high-value journey per feature over many brittle micro-tests.
- Review and prune low-signal tests monthly.
