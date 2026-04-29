import { getStagingAdminAllowlist, isAllowedStagingAdminEmail, isStagingEnvironment } from "./environment";

const ADMIN_DOMAIN = "@endsideout.org";
const WHES_REPORT_DOMAIN = "@whes.org";

export function canUseDashboardEmail(email?: string | null): boolean {
  const normalized = email?.toLowerCase() ?? "";
  if (isStagingEnvironment()) {
    const allowlist = getStagingAdminAllowlist();
    if (allowlist.length === 0) {
      return false;
    }
    return isAllowedStagingAdminEmail(normalized);
  }
  return normalized.endsWith(ADMIN_DOMAIN) || normalized.endsWith(WHES_REPORT_DOMAIN);
}

export function getAdminAccessForEmail(email?: string | null): {
  isAdmin: boolean;
  isWhesReportUser: boolean;
} {
  const normalizedEmail = email?.toLowerCase() ?? "";
  const isAdmin = isStagingEnvironment()
    ? isAllowedStagingAdminEmail(normalizedEmail)
    : Boolean(normalizedEmail.endsWith(ADMIN_DOMAIN));
  const isWhesReportUser = isStagingEnvironment()
    ? false
    : Boolean(normalizedEmail.endsWith(WHES_REPORT_DOMAIN));
  return { isAdmin, isWhesReportUser };
}

export const accessPolicyMessages = {
  stagingDenied:
    "This staging dashboard is restricted to allowlisted emails. Contact the admin to be added.",
  productionDenied: `Only ${ADMIN_DOMAIN} or ${WHES_REPORT_DOMAIN} emails are allowed`,
};
