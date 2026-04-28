import React from "react";
import { ProtectedRoute } from "./ProtectedRoute";
import { RequirePlayerProfile } from "./RequirePlayerProfile";
import type { RouteAccess } from "../routes/routeMetadata";

interface AccessGateProps {
  access: RouteAccess;
  children: React.ReactNode;
}

export function AccessGate({ access, children }: AccessGateProps): React.JSX.Element {
  if (access === "player_profile") {
    return <RequirePlayerProfile>{children}</RequirePlayerProfile>;
  }
  if (access === "admin") {
    return <ProtectedRoute>{children}</ProtectedRoute>;
  }
  return <>{children}</>;
}
