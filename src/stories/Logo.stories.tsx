import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Logo } from "../components/Logo";

const meta = {
  title: "Components/Logo",
  component: Logo,
  args: {
    size: "md",
  },
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Logo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Medium: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByAltText(/endsideout logo/i)).toBeInTheDocument();
  },
};

export const Large: Story = {
  args: {
    size: "lg",
  },
};
