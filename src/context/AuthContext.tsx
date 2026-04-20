import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { getAuthInstance } from "../lib/firebase";
import {
  getStagingAdminAllowlist,
  isAllowedStagingAdminEmail,
  isStagingEnvironment,
} from "../lib/environment";

const ADMIN_DOMAIN = "@endsideout.org";
const WHES_REPORT_DOMAIN = "@whes.org";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
  canAccessDashboard: boolean;
  isWhesReportUser: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const canUseDashboardEmail = useCallback((email?: string | null): boolean => {
    const normalized = email?.toLowerCase() ?? "";
    if (isStagingEnvironment()) {
      const allowlist = getStagingAdminAllowlist();
      if (allowlist.length === 0) {
        return false;
      }
      return isAllowedStagingAdminEmail(normalized);
    }
    return normalized.endsWith(ADMIN_DOMAIN) || normalized.endsWith(WHES_REPORT_DOMAIN);
  }, []);

  useEffect(() => {
    const auth = getAuthInstance();
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<void> => {
    const auth = getAuthInstance();
    if (!auth) {
      throw new Error("Firebase not configured");
    }

    // Restrict dashboard access based on environment policy.
    if (!canUseDashboardEmail(email)) {
      if (isStagingEnvironment()) {
        throw new Error(
          "This staging dashboard is restricted to allowlisted emails. Contact the admin to be added."
        );
      }
      throw new Error(`Only ${ADMIN_DOMAIN} or ${WHES_REPORT_DOMAIN} emails are allowed`);
    }

    await signInWithEmailAndPassword(auth, email, password);
  }, [canUseDashboardEmail]);

  const loginWithGoogle = useCallback(async (): Promise<void> => {
    const auth = getAuthInstance();
    if (!auth) {
      throw new Error("Firebase not configured");
    }

    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    
    // Restrict dashboard access based on environment policy.
    if (!canUseDashboardEmail(result.user.email)) {
      await signOut(auth);
      if (isStagingEnvironment()) {
        throw new Error(
          "This staging dashboard is restricted to allowlisted emails. Contact the admin to be added."
        );
      }
      throw new Error(`Only ${ADMIN_DOMAIN} or ${WHES_REPORT_DOMAIN} emails are allowed`);
    }
  }, [canUseDashboardEmail]);

  const logout = useCallback(async (): Promise<void> => {
    const auth = getAuthInstance();
    if (!auth) return;
    await signOut(auth);
  }, []);

  const normalizedEmail = user?.email?.toLowerCase() ?? "";
  const isAdmin = isStagingEnvironment()
    ? isAllowedStagingAdminEmail(normalizedEmail)
    : Boolean(normalizedEmail.endsWith(ADMIN_DOMAIN));
  const isWhesReportUser = isStagingEnvironment()
    ? false
    : Boolean(normalizedEmail.endsWith(WHES_REPORT_DOMAIN));
  const canAccessDashboard = Boolean(user && (isAdmin || isWhesReportUser));

  const value = {
    user,
    loading,
    login,
    loginWithGoogle,
    logout,
    isAdmin,
    canAccessDashboard,
    isWhesReportUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
