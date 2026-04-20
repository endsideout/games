import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useGameUser } from "../context/GameUserContext";

interface RequirePlayerProfileProps {
  children: React.ReactNode;
}

export function RequirePlayerProfile({
  children,
}: RequirePlayerProfileProps): React.JSX.Element {
  const { isProfileComplete } = useGameUser();
  const location = useLocation();

  if (!isProfileComplete) {
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
