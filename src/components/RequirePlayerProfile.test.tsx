import React from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { RequirePlayerProfile } from "./RequirePlayerProfile";

vi.mock("../context/GameUserContext", () => ({
  useGameUser: vi.fn(),
}));

vi.mock("../lib/playerProfilePolicy", () => ({
  buildPlayerInfoRedirectPath: vi.fn((returnTo: string) => `/player-info?returnTo=${encodeURIComponent(returnTo)}`),
}));

function renderRoute(): void {
  render(
    <MemoryRouter initialEntries={["/least-sugar-game?round=1"]}>
      <Routes>
        <Route
          path="/least-sugar-game"
          element={
            <RequirePlayerProfile>
              <div>Least sugar game</div>
            </RequirePlayerProfile>
          }
        />
        <Route path="/player-info" element={<div>Player info page</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe("RequirePlayerProfile", () => {
  it("redirects to player-info when profile is incomplete", async () => {
    const gameUserModule = await import("../context/GameUserContext");
    vi.mocked(gameUserModule.useGameUser).mockReturnValue({
      user: {
        email: null,
        name: null,
        grade: null,
        teacherName: null,
        school: null,
        schoolName: null,
      },
      isIdentified: false,
      isProfileComplete: false,
      setPlayerProfile: vi.fn(),
      trackEvent: vi.fn(),
    });

    renderRoute();
    expect(screen.getByText(/player info page/i)).toBeTruthy();
  });

  it("renders children when profile is complete", async () => {
    const gameUserModule = await import("../context/GameUserContext");
    vi.mocked(gameUserModule.useGameUser).mockReturnValue({
      user: {
        email: "student@example.com",
        name: "Student",
        grade: "5th Grade",
        teacherName: "Teacher",
        school: "School",
        schoolName: "School",
      },
      isIdentified: true,
      isProfileComplete: true,
      setPlayerProfile: vi.fn(),
      trackEvent: vi.fn(),
    });

    renderRoute();
    expect(screen.getByText(/least sugar game/i)).toBeTruthy();
  });
});
