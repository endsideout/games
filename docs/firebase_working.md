Game tracking in this app is a client-side write pipeline: individual games call a shared hook, which enriches each event with player context and writes it to Firestore.

## 1. Firebase setup

Firebase is initialized from Vite env vars in `src/lib/firebase.ts`. If `VITE_FIREBASE_PROJECT_ID` is missing, tracking is skipped silently (with a dev console warning).

## 2. Player identity

`GameUserProvider` wraps the whole app in `App.tsx` and builds a `user` object from:

- **URL query params** — for Thinkific embeds (`email`, `firstName`/`name`, `grade`, `teacherName`, `schoolName`)
- **localStorage** — profile collected via `/player-info` (`name`, `grade`, `teacherName`, `schoolName`)

Most game routes use `RequirePlayerProfile`, which redirects to `/player-info` until that profile is complete. That ensures tracked events include player metadata.

## 3. How games emit events

Each game uses `useGameUser()` and calls `trackEvent()` at lifecycle points. A typical pattern:

```133:154:src/pages/courses/wellbeing/physical-wellbeing/games/HealthyPlateGame.tsx
    sessionIdRef.current = generateSessionId();
    trackEvent({ gameId: GAME_ID, event: "game_started", sessionId: sessionIdRef.current });
  }
  // ...
  function finishGame(items: FoodItem[]) {
    const score = calcHealthPct(items);
    trackEvent({ gameId: GAME_ID, event: "game_completed", sessionId: sessionIdRef.current, score });
```

Event shape (`GameTrackingEvent`):

| Field | Purpose |
|-------|---------|
| `gameId` | Stable game identifier (e.g. `"healthy-plate"`) |
| `event` | `"game_started"`, `"game_completed"`, or `"game_over"` |
| `sessionId` | Optional; links start/end of the same play session |
| `score`, `moves`, `timeRemaining` | Optional game metrics |
| `metadata` | Optional extra data |

`sessionId` is generated client-side via `generateSessionId()` (`timestamp-random`) so analytics can pair start and completion events.

## 4. Writing to Firestore

`trackEvent` in `GameUserContext` attaches `user` and `timestamp`, then calls `saveGameEventToFirebase`:

```145:157:src/context/GameUserContext.tsx
  const trackEvent = useCallback((event: GameTrackingEvent): void => {
    const payload = {
      ...event,
      user,
      timestamp: new Date().toISOString(),
    };
    // ...
    void saveGameEventToFirebase(payload);
  }, [user]);
```

That writes to the `game_events` collection with `addDoc`:

```24:29:src/lib/gameTracking.ts
    await addDoc(collection(db, COLLECTION_NAME), {
      ...payload,
      createdAt: new Date().toISOString(),
    });
```

Each document ends up roughly like:

```json
{
  "gameId": "healthy-plate",
  "event": "game_completed",
  "sessionId": "1708368483584-a3f2b1c9",
  "score": 85,
  "user": { "email": null, "name": "Alex", "grade": "5", ... },
  "timestamp": "2026-06-05T...",
  "createdAt": "2026-06-05T..."
}
```

Writes are fire-and-forget (`void`); failures are logged but do not block gameplay.

## 5. Security rules

From `firestore.rules`:

- **Create**: anyone (no auth) — supports Thinkific embeds
- **Read**: only authenticated `@endsideout.org` users
- **Update/delete**: denied

## 6. Reading events (admin dashboard)

The admin dashboard queries `game_events` via `loadGameEventsPaginated`, filters by `createdAt`, maps docs with `mapFirestoreDocToGameEvent`, and aggregates stats (starts, completions, scores, per-user/per-game breakdowns) in `buildGameStats`.

---

**In short:** games call `trackEvent()` at start and finish; the context adds player info; each event is appended to Firestore `game_events`; admins read and analyze those events on `/admin`. If you want, I can trace a specific game’s tracking calls or walk through the dashboard query path in more detail.

