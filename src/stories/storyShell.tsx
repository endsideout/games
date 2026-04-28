import React from "react";
import { MemoryRouter } from "react-router-dom";

export function withMemoryRouter(
  Story: React.ComponentType,
): React.JSX.Element {
  return (
    <MemoryRouter>
      <Story />
    </MemoryRouter>
  );
}

/** Page stories that need react-router and full viewport. */
export const routedFullscreenPageMeta = {
  parameters: { layout: "fullscreen" as const },
  decorators: [withMemoryRouter],
};

/** Component stories that only need full viewport. */
export const fullscreenOnlyMeta = {
  parameters: { layout: "fullscreen" as const },
};
