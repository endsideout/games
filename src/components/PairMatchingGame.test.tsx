import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { PairMatchingGame } from "./PairMatchingGame";

class ResizeObserverMock {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}

beforeAll(() => {
  vi.stubGlobal("ResizeObserver", ResizeObserverMock);
});

afterEach(() => {
  cleanup();
});

describe("PairMatchingGame", () => {
  it("renders game header and initial stats", () => {
    render(
      <PairMatchingGame
        title="Memory Match"
        words={["A", "B"]}
        gameConfig={{ pairs: 2, gridCols: 2, time: 10 }}
        onBackToMenu={vi.fn()}
      />
    );

    expect(screen.getByRole("heading", { name: /memory match/i })).toBeTruthy();
    expect(screen.getByText(/10s/i)).toBeTruthy();
    expect(screen.getByText(/score/i)).toBeTruthy();
    expect(screen.getByText(/moves/i)).toBeTruthy();
  });

  it("shows game-over state and triggers callbacks", async () => {
    const onBackToMenu = vi.fn();
    const onGameOver = vi.fn();

    render(
      <PairMatchingGame
        title="Fast Match"
        words={["A", "B"]}
        gameConfig={{ pairs: 2, gridCols: 2, time: 0 }}
        onBackToMenu={onBackToMenu}
        onGameOver={onGameOver}
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/time's up/i)).toBeTruthy();
    });

    expect(onGameOver).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole("button", { name: /try again/i }));
    expect(onBackToMenu).toHaveBeenCalledTimes(1);
  });
});
