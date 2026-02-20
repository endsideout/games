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

const ADMIN_DOMAIN = "@endsideout.org";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
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

    // Check if email is from admin domain
    if (!email.endsWith(ADMIN_DOMAIN)) {
      throw new Error(`Only ${ADMIN_DOMAIN} emails are allowed`);
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
    
    // Check if email is from admin domain
    if (!result.user.email?.endsWith(ADMIN_DOMAIN)) {
      await signOut(auth);
      throw new Error(`Only ${ADMIN_DOMAIN} emails are allowed`);
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    const auth = getAuthInstance();
    if (!auth) return;
    await signOut(auth);
  }, []);

  const isAdmin = Boolean(user && user.email?.endsWith(ADMIN_DOMAIN));

  const value = {
    user,
    loading,
    login,
    loginWithGoogle,
    logout,
    isAdmin,
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
