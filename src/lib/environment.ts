const PROD_HOSTS = new Set(["endsideoutgames.netlify.app"]);

function splitCsv(value: string | undefined): string[] {
  return (value ?? "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

export function getAppEnvironment(): "production" | "staging" {
  return import.meta.env.VITE_APP_ENV === "staging" ? "staging" : "production";
}

export function isStagingEnvironment(): boolean {
  return getAppEnvironment() === "staging";
}

export function getStagingAdminAllowlist(): string[] {
  return splitCsv(import.meta.env.VITE_STAGING_ADMIN_ALLOWLIST);
}

export function isAllowedStagingAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const allowlist = getStagingAdminAllowlist();
  if (allowlist.length === 0) return false;
  return allowlist.includes(email.toLowerCase());
}

export function getStagingBaseUrl(): string {
  return (
    import.meta.env.VITE_STAGING_BASE_URL?.trim() ||
    "https://staging-endsideoutgames.netlify.app"
  );
}

export function validateEnvironmentSafety(): string | null {
  if (!isStagingEnvironment()) return null;

  if (typeof window !== "undefined" && PROD_HOSTS.has(window.location.hostname)) {
    return "Staging mode cannot run on the production host.";
  }

  const firebaseProjectId = import.meta.env.VITE_FIREBASE_PROJECT_ID?.trim() || "";
  const productionProjectId =
    import.meta.env.VITE_PRODUCTION_FIREBASE_PROJECT_ID?.trim() || "";

  if (!productionProjectId) return null;
  if (firebaseProjectId && firebaseProjectId === productionProjectId) {
    return "Staging mode is blocked because Firebase project ID matches production.";
  }

  return null;
}
