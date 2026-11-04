import { describe, it, expect } from "vitest";
import type { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { mapFirestoreDocToGameEvent } from "./mapEvent";

function fakeDoc(
  id: string,
  data: Record<string, unknown>
): QueryDocumentSnapshot<DocumentData> {
  return {
    id,
    data: () => data as DocumentData,
  } as QueryDocumentSnapshot<DocumentData>;
}

describe("mapFirestoreDocToGameEvent", () => {
  it("normalizes ids, school key, and timestamps", () => {
    const ev = mapFirestoreDocToGameEvent(
      fakeDoc("doc-1", {
        gameId: " my-game ",
        event: " game_started ",
        user: { email: "a@b.com", name: "A", schoolName: " WHES " },
        createdAt: "2025-06-01T10:00:00.000Z",
        timestamp: "2025-06-01T11:00:00.000Z",
      })
    );
    expect(ev.id).toBe("doc-1");
    expect(ev.gameIdNormalized).toBe("my-game");
    expect(ev.eventTypeNormalized).toBe("game_started");
    expect(ev.schoolNormalized).toBe("whes");
    expect(ev.createdAtMs).toBe(new Date("2025-06-01T10:00:00.000Z").getTime());
  });

  it("falls back user and timestamps when missing", () => {
    const ev = mapFirestoreDocToGameEvent(
      fakeDoc("doc-2", {
        gameId: "g",
        event: "game_over",
      })
    );
    expect(ev.user).toEqual({ email: null, name: null });
    expect(ev.createdAt).toBe("");
    expect(ev.timestamp).toBe("");
    expect(ev.createdAtMs).toBe(0);
  });
});
