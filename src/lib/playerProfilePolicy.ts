import type { GameUser } from "../types";

const PLAYER_INFO_ROUTE = "/player-info";

export function isPlayerProfileComplete(user: GameUser): boolean {
  return Boolean(
    user.name?.trim() &&
      user.grade?.trim() &&
      user.teacherName?.trim() &&
      user.schoolName?.trim()
  );
}

export function sanitizeReturnToPath(returnTo: string | null | undefined): string {
  if (!returnTo) return "/";
  return returnTo.startsWith("/") && !returnTo.startsWith("//") ? returnTo : "/";
}

export function buildPlayerInfoRedirectPath(currentPathWithSearch: string): string {
  const returnTo = sanitizeReturnToPath(currentPathWithSearch);
  return `${PLAYER_INFO_ROUTE}?returnTo=${encodeURIComponent(returnTo)}`;
}
