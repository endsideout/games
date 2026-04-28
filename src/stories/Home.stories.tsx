import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Home } from "../pages/landing/Home";
import { routedFullscreenPageMeta } from "./storyShell";

const meta = {
  title: "Pages/Home",
  component: Home,
  ...routedFullscreenPageMeta,
} satisfies Meta<typeof Home>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("heading", { name: /endsideout games/i })
    ).toBeInTheDocument();
    await expect(
      canvas.getByRole("link", { name: /3d wellness/i })
    ).toBeInTheDocument();
  },
};
