# Staging Game Links

All links below use `https://staging--endsideout-games.netlify.app`, the `staging` branch deploy of
the `endsideout-games` Netlify site. Confirmed working 24 November 2026.

Mind the double hyphen before the site name: Netlify branch deploys are
`<branch>--<site>.netlify.app`. Most of this file previously used the single-hyphen spelling
`staging-endsideoutgames.netlify.app`, which is not a site at all and returns "Site not found" — so
every link here was dead except the three in the LMS section. If you need a different environment,
`VITE_STAGING_BASE_URL` in the Netlify environment is what the app itself reads.

## Core shareable links

- `https://staging--endsideout-games.netlify.app/`
- `https://staging--endsideout-games.netlify.app/3d-wellness`
- `https://staging--endsideout-games.netlify.app/know-your-health`
- `https://staging--endsideout-games.netlify.app/know-your-health/set-1`
- `https://staging--endsideout-games.netlify.app/least-sugar-game`
- `https://staging--endsideout-games.netlify.app/brain-health-game`
- `https://staging--endsideout-games.netlify.app/water-glass-game`
- `https://staging--endsideout-games.netlify.app/finish-race-game`
- `https://staging--endsideout-games.netlify.app/habit-guard-game`
- `https://staging--endsideout-games.netlify.app/body-image-game`
- `https://staging--endsideout-games.netlify.app/financial-literacy`
- `https://staging--endsideout-games.netlify.app/budgeting-game`

## Labs (static pages, not router routes)

Labs are served straight out of `public/`, so the trailing slash matters and there is no React route
behind them. They take no query parameters: none of the personalisation or token links below apply,
and nothing they do is reported to the classroom LMS or written to `game_events`.

- `https://staging--endsideout-games.netlify.app/spike-lab/`

## Optional query-param links (LMS style testing)

- `https://staging--endsideout-games.netlify.app/least-sugar-game?firstName=Alex&email=alex.tester@example.org&grade=6&teacherName=Ms+Green&schoolName=Staging+Academy`
- `https://staging--endsideout-games.netlify.app/budgeting-game?firstName=Sam&email=sam.peer@example.org&grade=7&teacherName=Mr+Blake&schoolName=Pilot+School`

## External LMS Iframe Testing (Token based)

Games loaded by the external LMS in an iframe pass a signed `token` parameter. The game reports start (`POST https://staging-classroom.endsideout.org/game_attempts/start`) and finish (`POST https://staging-classroom.endsideout.org/game_attempts/finish`).

- `https://staging--endsideout-games.netlify.app/fruit-veggie-quiz?token=TEST_TOKEN`
- `https://staging--endsideout-games.netlify.app/least-sugar-game?token=TEST_TOKEN`
- `https://staging--endsideout-games.netlify.app/budgeting-game?token=TEST_TOKEN`

## Admin links (protected)

- `https://staging--endsideout-games.netlify.app/admin/login`
- `https://staging--endsideout-games.netlify.app/admin`
