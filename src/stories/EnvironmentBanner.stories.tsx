import type { Meta, StoryObj } from "@storybook/react-vite";
import { EnvironmentBanner } from "../components/EnvironmentBanner";

const meta = {
  title: "Components/EnvironmentBanner",
  component: EnvironmentBanner,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof EnvironmentBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const VisibleInStaging: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Banner is visible only when `VITE_APP_ENV` is `staging`.",
      },
    },
  },
};
