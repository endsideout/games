import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { ThreeDWellness } from "../pages/courses/ThreeDWellness";
import { routedFullscreenPageMeta } from "./storyShell";

const meta = {
  title: "Pages/ThreeDWellness",
  component: ThreeDWellness,
  ...routedFullscreenPageMeta,
} satisfies Meta<typeof ThreeDWellness>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("heading", { name: /3d wellness dimensions/i })
    ).toBeInTheDocument();
    await expect(
      canvas.getByRole("link", { name: /social wellbeing/i })
    ).toBeInTheDocument();
  },
};
