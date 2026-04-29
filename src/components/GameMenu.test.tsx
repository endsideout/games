import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { GameMenu } from "./GameMenu";

describe("GameMenu", () => {
  it("renders title, description and starts game", () => {
    const onStartGame = vi.fn();
    render(
      <GameMenu
        title="Test Matching Game"
        description="Match all cards in time."
        onStartGame={onStartGame}
      />
    );

    expect(screen.getByRole("heading", { name: /test matching game/i })).toBeTruthy();
    expect(screen.getByText(/match all cards in time/i)).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: /start playing/i }));
    expect(onStartGame).toHaveBeenCalledTimes(1);
  });
});
