import React from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";

vi.mock("../context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

function renderRoute(): void {
  render(
    <MemoryRouter initialEntries={["/admin"]}>
      <Routes>
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <div>Admin dashboard</div>
            </ProtectedRoute>
          }
        />
        <Route path="/admin/login" element={<div>Admin login page</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe("ProtectedRoute", () => {
  it("shows loading state while auth initializes", async () => {
    const authModule = await import("../context/AuthContext");
    vi.mocked(authModule.useAuth).mockReturnValue({
      user: null,
      loading: true,
      login: vi.fn(),
      loginWithGoogle: vi.fn(),
      logout: vi.fn(),
      isAdmin: false,
      canAccessDashboard: false,
      isWhesReportUser: false,
    });

    renderRoute();
    expect(screen.getByText(/loading/i)).toBeTruthy();
  });

  it("redirects to login when access is denied", async () => {
    const authModule = await import("../context/AuthContext");
    vi.mocked(authModule.useAuth).mockReturnValue({
      user: null,
      loading: false,
      login: vi.fn(),
      loginWithGoogle: vi.fn(),
      logout: vi.fn(),
      isAdmin: false,
      canAccessDashboard: false,
      isWhesReportUser: false,
    });

    renderRoute();
    expect(screen.getByText(/admin login page/i)).toBeTruthy();
  });

  it("renders children when access is allowed", async () => {
    const authModule = await import("../context/AuthContext");
    vi.mocked(authModule.useAuth).mockReturnValue({
      user: { uid: "user-1" } as unknown as { uid: string },
      loading: false,
      login: vi.fn(),
      loginWithGoogle: vi.fn(),
      logout: vi.fn(),
      isAdmin: true,
      canAccessDashboard: true,
      isWhesReportUser: false,
    });

    renderRoute();
    expect(screen.getByText(/admin dashboard/i)).toBeTruthy();
  });
});
