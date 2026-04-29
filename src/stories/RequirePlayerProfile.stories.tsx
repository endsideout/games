import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { RequirePlayerProfile } from "../components/RequirePlayerProfile";
import { GameUserProvider } from "../context/GameUserContext";

const meta = {
  title: "Components/RequirePlayerProfile",
  component: RequirePlayerProfile,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof RequirePlayerProfile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const RedirectsWhenIncomplete: Story = {
  args: {
    children: <div>Least sugar game</div>,
  },
  render: () => (
    <MemoryRouter initialEntries={["/least-sugar-game"]}>
      <GameUserProvider>
        <Routes>
          <Route
            path="/least-sugar-game"
            element={
              <RequirePlayerProfile>
                <div>Least sugar game</div>
              </RequirePlayerProfile>
            }
          />
          <Route path="/player-info" element={<div>Player info page</div>} />
        </Routes>
      </GameUserProvider>
    </MemoryRouter>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(/player info page/i)).toBeInTheDocument();
  },
};
