import { describe, it, expect } from "vitest";
import type { GameEvent } from "../types";
import { filterEvents } from "./filterEvents";

function baseEvent(overrides: Partial<GameEvent>): GameEvent {
  return {
    id: "1",
    gameId: "g",
    event: "game_started",
    user: { email: "a", name: null },
    timestamp: "",
    createdAt: "",
    schoolNormalized: "whes",
    createdAtMs: 1_000,
    eventTypeNormalized: "game_started",
    gameIdNormalized: "g1",
    ...overrides,
  };
}

describe("filterEvents", () => {
  const events: GameEvent[] = [
    baseEvent({
      id: "a",
      gameIdNormalized: "alpha",
      schoolNormalized: "whes",
      createdAtMs: 500,
    }),
    baseEvent({
      id: "b",
      gameIdNormalized: "beta",
      schoolNormalized: "",
      createdAtMs: 1_500,
    }),
  ];

  it("returns all when no filters", () => {
    expect(
      filterEvents(events, {
        selectedGameSet: new Set(),
        normalizedSelectedSchool: null,
        dateStartMs: null,
        dateEndMs: null,
      })
    ).toHaveLength(2);
  });

  it("filters by selected games", () => {
    const out = filterEvents(events, {
      selectedGameSet: new Set(["alpha"]),
      normalizedSelectedSchool: null,
      dateStartMs: null,
      dateEndMs: null,
    });
    expect(out.map((e) => e.id)).toEqual(["a"]);
  });

  it("filters by school key including empty __none__", () => {
    const out = filterEvents(events, {
      selectedGameSet: new Set(),
      normalizedSelectedSchool: "",
      dateStartMs: null,
      dateEndMs: null,
    });
    expect(out.map((e) => e.id)).toEqual(["b"]);
  });

  it("filters by date range inclusive of day bounds", () => {
    const out = filterEvents(events, {
      selectedGameSet: new Set(),
      normalizedSelectedSchool: null,
      dateStartMs: 1_000,
      dateEndMs: 2_000,
    });
    expect(out.map((e) => e.id)).toEqual(["b"]);
  });
});
