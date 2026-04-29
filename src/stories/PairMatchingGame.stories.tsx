import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, within } from "storybook/test";
import { PairMatchingGame } from "../components/PairMatchingGame";
import { fullscreenOnlyMeta } from "./storyShell";

const meta = {
  title: "Components/PairMatchingGame",
  component: PairMatchingGame,
  args: {
    onBackToMenu: fn<() => void>(),
    onGameComplete: fn<(score: number, moves: number, timeRemaining: number) => void>(),
    onGameOver: fn<(score: number, moves: number) => void>(),
    title: "Healthy Habits Match",
    words: ["Hydration", "Sleep", "Exercise"],
    gameConfig: {
      pairs: 3,
      gridCols: 3,
      time: 90,
    },
  },
  ...fullscreenOnlyMeta,
} satisfies Meta<typeof PairMatchingGame>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("heading", { name: /healthy habits match/i })
    ).toBeInTheDocument();
    await expect(canvas.getByText(/match all pairs/i)).toBeInTheDocument();
  },
};
