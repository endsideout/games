import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { GameMenu } from "../components/GameMenu";

const meta = {
  title: "Components/GameMenu",
  component: GameMenu,
  args: {
    onStartGame: fn<() => void>(),
    title: "Pair Matching Game",
    description: "Match each card pair before time runs out.",
  },
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof GameMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("heading", { name: /pair matching game/i })
    ).toBeInTheDocument();
    await userEvent.click(canvas.getByRole("button", { name: /start playing/i }));
    await expect(args.onStartGame).toHaveBeenCalledTimes(1);
  },
};
