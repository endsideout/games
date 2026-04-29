import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { Logo } from "./Logo";

afterEach(() => {
  cleanup();
});

describe("Logo", () => {
  it("renders with default medium size", () => {
    render(<Logo />);
    const image = screen.getByAltText(/endsideout logo/i);
    expect(image.className).toContain("w-20");
  });

  it("renders with large size class", () => {
    render(<Logo size="lg" />);
    const image = screen.getByAltText(/endsideout logo/i);
    expect(image.className).toContain("w-32");
  });
});
