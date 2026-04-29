import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { EnvironmentBanner } from "./EnvironmentBanner";

vi.mock("../lib/environment", () => ({
  isStagingEnvironment: vi.fn(),
}));

describe("EnvironmentBanner", () => {
  it("renders banner in staging", async () => {
    const envModule = await import("../lib/environment");
    vi.mocked(envModule.isStagingEnvironment).mockReturnValue(true);

    render(<EnvironmentBanner />);
    expect(screen.getByText(/staging environment - test data only/i)).toBeTruthy();
  });

  it("renders nothing in production", async () => {
    const envModule = await import("../lib/environment");
    vi.mocked(envModule.isStagingEnvironment).mockReturnValue(false);

    const { container } = render(<EnvironmentBanner />);
    expect(container.textContent).toBe("");
  });
});
