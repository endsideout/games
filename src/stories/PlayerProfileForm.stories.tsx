import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import {
  PlayerProfileForm,
  type PlayerProfileValues,
} from "../components/PlayerProfileForm";

const meta = {
  title: "Forms/PlayerProfileForm",
  component: PlayerProfileForm,
  args: {
    onSubmit: fn<(values: PlayerProfileValues) => void>(),
  },
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof PlayerProfileForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EmptyRequiredFields: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const submitButton = canvas.getByRole("button", {
      name: /continue to game/i,
    });

    await userEvent.click(submitButton);

    expect(args.onSubmit).not.toHaveBeenCalled();
    expect(
      canvas.getByRole("textbox", { name: /student name/i })
    ).toBeInvalid();
  },
};

export const PrefilledValues: Story = {
  args: {
    initialValues: {
      name: "Maya Johnson",
      grade: "5th Grade",
      teacherName: "Ms. Parker",
      schoolName: "Westside Elementary",
    },
  },
};

export const SubmitsValidData: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.type(
      canvas.getByRole("textbox", { name: /student name/i }),
      "Jordan Lee"
    );
    await userEvent.selectOptions(
      canvas.getByRole("combobox", { name: /grade/i }),
      "4th Grade"
    );
    await userEvent.type(
      canvas.getByRole("textbox", { name: /teacher name/i }),
      "Mr. Chen"
    );
    await userEvent.type(
      canvas.getByRole("textbox", { name: /school name/i }),
      "Riverside School"
    );

    await userEvent.click(
      canvas.getByRole("button", { name: /continue to game/i })
    );

    expect(args.onSubmit).toHaveBeenCalledWith({
      name: "Jordan Lee",
      grade: "4th Grade",
      teacherName: "Mr. Chen",
      schoolName: "Riverside School",
    });
  },
};
