import { describe, it, expect } from "vitest";
import {
  normalizeSearchText,
  normalizeSchoolRaw,
  normalizeSchoolKey,
  normalizeGameId,
  normalizeEventType,
  formatGameLabel,
  formatEventLabel,
} from "./normalize";

describe("normalize utils", () => {
  it("normalizeSearchText trims and lowercases", () => {
    expect(normalizeSearchText("  Foo Bar  ")).toBe("foo bar");
  });

  it("normalizeSchoolRaw handles null and non-string", () => {
    expect(normalizeSchoolRaw(null)).toBe("");
    expect(normalizeSchoolRaw(undefined)).toBe("");
    expect(normalizeSchoolRaw(123 as unknown as string)).toBe("");
  });

  it("normalizeSchoolKey lowercases trimmed school", () => {
    expect(normalizeSchoolKey("  WHES  ")).toBe("whes");
  });

  it("normalizeGameId returns unknown for bad input", () => {
    expect(normalizeGameId(null)).toBe("unknown");
    expect(normalizeGameId("")).toBe("unknown");
    expect(normalizeGameId("  pair-game  ")).toBe("pair-game");
  });

  it("normalizeEventType returns unknown_event for bad input", () => {
    expect(normalizeEventType(1)).toBe("unknown_event");
    expect(normalizeEventType("")).toBe("unknown_event");
    expect(normalizeEventType(" game_started ")).toBe("game_started");
  });

  it("formatGameLabel title-cases hyphenated ids", () => {
    expect(formatGameLabel("fruit-match")).toBe("Fruit Match");
  });

  it("formatEventLabel strips game_ prefix", () => {
    expect(formatEventLabel("game_started")).toBe("started");
  });
});
