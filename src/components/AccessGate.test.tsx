import React from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { AccessGate } from "./AccessGate";

vi.mock("./ProtectedRoute", () => ({
  ProtectedRoute: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="protected-route">{children}</div>
  ),
}));

vi.mock("./RequirePlayerProfile", () => ({
  RequirePlayerProfile: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="require-player-profile">{children}</div>
  ),
}));

describe("AccessGate", () => {
  it("renders children directly for public access", () => {
    render(<AccessGate access="public">Public page</AccessGate>);
    expect(screen.getByText("Public page")).toBeTruthy();
    expect(screen.queryByTestId("protected-route")).toBeNull();
    expect(screen.queryByTestId("require-player-profile")).toBeNull();
  });

  it("wraps children with RequirePlayerProfile for player access", () => {
    render(<AccessGate access="player_profile">Game page</AccessGate>);
    expect(screen.getByTestId("require-player-profile")).toBeTruthy();
    expect(screen.getByText("Game page")).toBeTruthy();
  });

  it("wraps children with ProtectedRoute for admin access", () => {
    render(<AccessGate access="admin">Admin page</AccessGate>);
    expect(screen.getByTestId("protected-route")).toBeTruthy();
    expect(screen.getByText("Admin page")).toBeTruthy();
  });
});
