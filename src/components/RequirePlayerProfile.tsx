/* © 2026 EndsideOut, Inc. All rights reserved. */
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useGameUser } from "../context/GameUserContext";

interface RequirePlayerProfileProps {
  children: React.ReactNode;
}

export function RequirePlayerProfile({
  children,
}: RequirePlayerProfileProps): React.JSX.Element {
  const { isProfileComplete, isLmsSession } = useGameUser();
  const location = useLocation();

  // Pages that are not gameplay and are read by adults rather than students.
  // The profile form asks for a student's name, grade, teacher and school, so
  // gating these means a dietitian reviewing game content, or a district
  // reading the accessibility report, has to pose as a child to get in.
  const ADULT_REFERENCE_PATHS = ["/accessibility", "/game-content"];

  const isExcluded =
    location.pathname === "/player-info" ||
    location.pathname.startsWith("/admin") ||
    ADULT_REFERENCE_PATHS.includes(location.pathname);

  if (!isProfileComplete && !isLmsSession && !isExcluded) {
    const returnTo = `${location.pathname}${location.search}`;
    return (
      <Navigate
        to={`/player-info?returnTo=${encodeURIComponent(returnTo)}`}
        replace
      />
    );
  }

  return <>{children}</>;
}
