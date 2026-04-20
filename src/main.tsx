import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { validateEnvironmentSafety } from "./lib/environment";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

const environmentSafetyError = validateEnvironmentSafety();

if (environmentSafetyError) {
  rootElement.innerHTML = `
    <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:#fff7ed;padding:16px;font-family:Arial,sans-serif;">
      <div style="max-width:640px;border:2px solid #f97316;border-radius:12px;background:white;padding:20px;">
        <h1 style="margin:0 0 8px 0;color:#9a3412;">Staging Startup Blocked</h1>
        <p style="margin:0;color:#7c2d12;line-height:1.5;">${environmentSafetyError}</p>
      </div>
    </div>
  `;
} else {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
