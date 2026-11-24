# Staging Game Links

Use your staging base URL in place of `https://staging-endsideoutgames.netlify.app`. That host is a
placeholder throughout this file — the real one is whatever `VITE_STAGING_BASE_URL` is set to in the
staging Netlify environment, which is a dedicated staging site on some setups and a `staging--`
branch-deploy of the production site on others. Confirm it before sharing any link below.

## Core shareable links

- `https://staging-endsideoutgames.netlify.app/`
- `https://staging-endsideoutgames.netlify.app/3d-wellness`
- `https://staging-endsideoutgames.netlify.app/know-your-health`
- `https://staging-endsideoutgames.netlify.app/know-your-health/set-1`
- `https://staging-endsideoutgames.netlify.app/least-sugar-game`
- `https://staging-endsideoutgames.netlify.app/brain-health-game`
- `https://staging-endsideoutgames.netlify.app/water-glass-game`
- `https://staging-endsideoutgames.netlify.app/finish-race-game`
- `https://staging-endsideoutgames.netlify.app/habit-guard-game`
- `https://staging-endsideoutgames.netlify.app/body-image-game`
- `https://staging-endsideoutgames.netlify.app/financial-literacy`
- `https://staging-endsideoutgames.netlify.app/budgeting-game`

## Labs (static pages, not router routes)

Labs are served straight out of `public/`, so the trailing slash matters and there is no React route
behind them. They take no query parameters: none of the personalisation or token links below apply,
and nothing they do is reported to the classroom LMS or written to `game_events`.

- `https://staging-endsideoutgames.netlify.app/spike-lab/`

## Optional query-param links (LMS style testing)

- `https://staging-endsideoutgames.netlify.app/least-sugar-game?firstName=Alex&email=alex.tester@example.org&grade=6&teacherName=Ms+Green&schoolName=Staging+Academy`
- `https://staging-endsideoutgames.netlify.app/budgeting-game?firstName=Sam&email=sam.peer@example.org&grade=7&teacherName=Mr+Blake&schoolName=Pilot+School`

## External LMS Iframe Testing (Token based)

Games loaded by the external LMS in an iframe pass a signed `token` parameter. The game reports start (`POST https://staging-classroom.endsideout.org/game_attempts/start`) and finish (`POST https://staging-classroom.endsideout.org/game_attempts/finish`).

- `https://staging-endsideoutgames.netlify.app/fruit-veggie-quiz?token=TEST_TOKEN`
- `https://staging-endsideoutgames.netlify.app/least-sugar-game?token=TEST_TOKEN`
- `https://staging-endsideoutgames.netlify.app/budgeting-game?token=TEST_TOKEN`

## Admin links (protected)

- `https://staging-endsideoutgames.netlify.app/admin/login`
- `https://staging-endsideoutgames.netlify.app/admin`
