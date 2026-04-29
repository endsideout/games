import { afterEach, describe, expect, it, vi } from "vitest";
import { validateEnvironmentSafety } from "./environment";

const originalWindow = (globalThis as { window?: unknown }).window;

function setHostname(hostname: string): void {
  (globalThis as { window: { location: { hostname: string } } }).window = {
    location: { hostname },
  };
}

afterEach(() => {
  vi.unstubAllEnvs();
  if (originalWindow === undefined) {
    delete (globalThis as { window?: unknown }).window;
    return;
  }
  (globalThis as { window?: unknown }).window = originalWindow;
});

describe("validateEnvironmentSafety", () => {
  it("returns null for production environment", () => {
    vi.stubEnv("VITE_APP_ENV", "production");
    expect(validateEnvironmentSafety()).toBeNull();
  });

  it("blocks staging mode on production host", () => {
    vi.stubEnv("VITE_APP_ENV", "staging");
    setHostname("endsideoutgames.netlify.app");
    expect(validateEnvironmentSafety()).toBe(
      "Staging mode cannot run on the production host."
    );
  });

  it("blocks staging mode when firebase project matches production", () => {
    vi.stubEnv("VITE_APP_ENV", "staging");
    vi.stubEnv("VITE_FIREBASE_PROJECT_ID", "endsideout-prod");
    vi.stubEnv("VITE_PRODUCTION_FIREBASE_PROJECT_ID", "endsideout-prod");
    setHostname("staging-endsideoutgames.netlify.app");

    expect(validateEnvironmentSafety()).toBe(
      "Staging mode is blocked because Firebase project ID matches production."
    );
  });

  it("allows staging mode with non-production host and project", () => {
    vi.stubEnv("VITE_APP_ENV", "staging");
    vi.stubEnv("VITE_FIREBASE_PROJECT_ID", "endsideout-staging");
    vi.stubEnv("VITE_PRODUCTION_FIREBASE_PROJECT_ID", "endsideout-prod");
    setHostname("staging-endsideoutgames.netlify.app");

    expect(validateEnvironmentSafety()).toBeNull();
  });
});
