import type { CSSProperties } from "react";

/** Shared gradient + pattern for Emotional Wellbeing hub and Emotion Detective game screens. */
export const emotionalWellbeingPageStyle: CSSProperties = {
  background:
    "linear-gradient(135deg, #BA68C8 0%, #E1BEE7 25%, #F8BBD0 50%, #CE93D8 75%, #AB47BC 100%)",
  backgroundImage: `
    radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.2) 0%, transparent 40%),
    radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.15) 0%, transparent 50%),
    url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
  `,
};
