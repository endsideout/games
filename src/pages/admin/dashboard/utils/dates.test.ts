import { describe, it, expect } from "vitest";
import {
  formatDateInputLocal,
  parseLocalDateInput,
  parseEventTimestampMs,
  getStartOfDayMs,
  getEndOfDayMs,
  formatHourLabel,
} from "./dates";

describe("dates utils", () => {
  it("formatDateInputLocal pads month and day", () => {
    expect(formatDateInputLocal(new Date(2026, 4, 6))).toBe("2026-05-06");
  });

  it("parseLocalDateInput parses Y-M-D as local midnight components", () => {
    const d = parseLocalDateInput("2026-03-15");
    expect(d.getFullYear()).toBe(2026);
    expect(d.getMonth()).toBe(2);
    expect(d.getDate()).toBe(15);
  });

  it("getStartOfDayMs and getEndOfDayMs bracket the local calendar day", () => {
    const start = getStartOfDayMs("2026-01-02");
    const end = getEndOfDayMs("2026-01-02");
    expect(end - start).toBe(86400000 - 1);
  });

  it("parseEventTimestampMs prefers createdAt over timestamp", () => {
    const earlier = "2020-01-01T00:00:00.000Z";
    const later = "2025-01-01T00:00:00.000Z";
    expect(parseEventTimestampMs(later, earlier)).toBe(new Date(later).getTime());
  });

  it("parseEventTimestampMs falls back to timestamp when createdAt missing", () => {
    const ts = "2024-06-01T12:00:00.000Z";
    expect(parseEventTimestampMs(null, ts)).toBe(new Date(ts).getTime());
  });

  it("parseEventTimestampMs returns 0 when nothing parseable", () => {
    expect(parseEventTimestampMs(undefined, undefined)).toBe(0);
  });

  it("formatHourLabel zero pads", () => {
    expect(formatHourLabel(9)).toBe("09:00");
    expect(formatHourLabel(23)).toBe("23:00");
  });
});
