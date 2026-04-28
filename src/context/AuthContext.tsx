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
  isStagingEnvironment,
} from "../lib/environment";
import {
  accessPolicyMessages,
  canUseDashboardEmail,
  getAdminAccessForEmail,
} from "../lib/accessPolicy";

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
        throw new Error(accessPolicyMessages.stagingDenied);
      }
      throw new Error(accessPolicyMessages.productionDenied);
    }

    await signInWithEmailAndPassword(auth, email, password);
  }, []);

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
        throw new Error(accessPolicyMessages.stagingDenied);
      }
      throw new Error(accessPolicyMessages.productionDenied);
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    const auth = getAuthInstance();
    if (!auth) return;
    await signOut(auth);
  }, []);

  const { isAdmin, isWhesReportUser } = getAdminAccessForEmail(user?.email);
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
