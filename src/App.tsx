import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GameUserProvider } from "./context/GameUserContext";
import { AuthProvider } from "./context/AuthContext";
import { AccessGate, EnvironmentBanner } from "./components";
import type { AppRouteMetadata } from "./routes/routeMetadata";
import { appRoutes } from "./routes/routeMetadata";

function renderRouteElement(route: AppRouteMetadata): React.JSX.Element {
  const content = <Suspense fallback={<div className="p-6 text-center">Loading...</div>}>{route.element}</Suspense>;
  return <AccessGate access={route.access}>{content}</AccessGate>;
}

export default function App(): React.JSX.Element {
  return (
    <Router>
      <AuthProvider>
        <GameUserProvider>
          <EnvironmentBanner />
          <Routes>
            {appRoutes.map((route) => (
              <Route key={route.path} path={route.path} element={renderRouteElement(route)} />
            ))}
          </Routes>
        </GameUserProvider>
      </AuthProvider>
    </Router>
  );
}
