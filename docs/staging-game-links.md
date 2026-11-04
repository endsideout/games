# Staging Game Links

Use your staging base URL in place of `https://staging-endsideoutgames.netlify.app`.

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

## Optional query-param links (LMS style testing)

- `https://staging-endsideoutgames.netlify.app/least-sugar-game?firstName=Alex&email=alex.tester@example.org&grade=6&teacherName=Ms+Green&schoolName=Staging+Academy`
- `https://staging-endsideoutgames.netlify.app/budgeting-game?firstName=Sam&email=sam.peer@example.org&grade=7&teacherName=Mr+Blake&schoolName=Pilot+School`

## External LMS Iframe Testing (Token based)

Games loaded by the external LMS in an iframe pass a signed `token` parameter. The game reports start (`POST https://staging-classroom.endsideout.org/game_attempts/start`) and finish (`POST https://staging-classroom.endsideout.org/game_attempts/finish`).

- `https://staging--endsideout-games.netlify.app/fruit-veggie-quiz?token=TEST_TOKEN`
- `https://staging--endsideout-games.netlify.app/least-sugar-game?token=TEST_TOKEN`
- `https://staging--endsideout-games.netlify.app/budgeting-game?token=TEST_TOKEN`

## Admin links (protected)

- `https://staging-endsideoutgames.netlify.app/admin/login`
- `https://staging-endsideoutgames.netlify.app/admin`
