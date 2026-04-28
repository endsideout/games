import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor, within } from "storybook/test";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { AuthProvider } from "../context/AuthContext";

const meta = {
  title: "Components/ProtectedRoute",
  component: ProtectedRoute,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof ProtectedRoute>;

export default meta;
type Story = StoryObj<typeof meta>;

export const RedirectsWhenUnauthenticated: Story = {
  render: () => (
    <MemoryRouter initialEntries={["/admin"]}>
      <AuthProvider>
        <Routes>
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <div>Admin dashboard</div>
              </ProtectedRoute>
            }
          />
          <Route path="/admin/login" element={<div>Admin login page</div>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => {
      expect(canvas.getByText(/admin login page/i)).toBeInTheDocument();
    });
  },
};
