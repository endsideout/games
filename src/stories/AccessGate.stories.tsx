import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AccessGate } from "../components/AccessGate";
import { GameUserProvider } from "../context/GameUserContext";

const meta = {
  title: "Components/AccessGate",
  component: AccessGate,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof AccessGate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PublicAccess: Story = {
  args: {
    access: "public",
    children: <div>Protected content</div>,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(/protected content/i)).toBeInTheDocument();
  },
};

export const PlayerProfileRedirect: Story = {
  args: {
    access: "player_profile",
    children: <div>Brain health game</div>,
  },
  render: () => (
    <MemoryRouter initialEntries={["/brain-health-game"]}>
      <GameUserProvider>
        <Routes>
          <Route
            path="/brain-health-game"
            element={
              <AccessGate access="player_profile">
                <div>Brain health game</div>
              </AccessGate>
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
