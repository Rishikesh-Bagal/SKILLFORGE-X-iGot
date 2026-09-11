import React, { createContext, useContext, useState, useEffect } from "react";
import { UserProfile, UserRole } from "../types";
import { api } from "../services/api";
import {
  auth,
  googleProvider,
  signInWithPopup,
  signOut,
  testConnection,
  syncUserProfileToFirestore,
  fetchUserProfileFromFirestore
} from "../lib/firebase";

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  loading: boolean;
  demoMode: boolean;
  setDemoMode: (val: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  firebaseConnected: boolean;
  login: (input?: string | { email?: string; password?: string }) => Promise<{ user: UserProfile; message: string }>;
  loginWithGoogle: (data?: { email?: string; name?: string }) => Promise<{ user: UserProfile; message: string }>;
  register: (data: {
    fullName: string;
    email: string;
    password?: string;
    employeeId?: string;
    department: string;
    designation: string;
    jobRole: string;
    organization?: string;
  }) => Promise<{ user: UserProfile; message?: string }>;
  logout: () => void;
  switchRole: (role: UserRole) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [demoMode, setDemoMode] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [firebaseConnected, setFirebaseConnected] = useState<boolean>(false);

  // Verify Firebase Firestore live connection on startup
  useEffect(() => {
    testConnection().then((connected) => {
      setFirebaseConnected(connected);
      console.info("[Firebase] Firestore Live Connection State:", connected ? "Active" : "Ready");
    }).catch((err) => {
      console.warn("[Firebase] Initial test note:", err);
    });
  }, []);

  const refreshUser = async () => {
    try {
      const data = await api.getMe();
      setUser(data.user);
      // Synchronize current profile state to Firestore
      if (data.user?.id) {
        syncUserProfileToFirestore(data.user).catch((e) => {
          console.warn("[Firestore sync note]", e);
        });
      }
    } catch (err) {
      console.warn("Could not fetch user session, attempting default demo login", err);
      try {
        const loginData = await api.login("rajesh.kumar@mospi.gov.in");
        setUser(loginData.user);
        if (loginData.user?.id) {
          syncUserProfileToFirestore(loginData.user).catch(() => {});
        }
      } catch (loginErr) {
        console.error("Failed demo login", loginErr);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (input?: string | { email?: string; password?: string }) => {
    setLoading(true);
    try {
      const data = await api.login(input);
      setUser(data.user);

      // Persist profile to Cloud Firestore
      if (data.user?.id) {
        syncUserProfileToFirestore(data.user).catch((err) => {
          console.warn("[Firestore sync notice]", err);
        });
      }

      if (!data.user.onboardingCompleted && data.user.role === "employee") {
        setActiveTab("onboarding");
      } else {
        setActiveTab(data.user.role === "admin" ? "admin" : data.user.role === "trainer" ? "trainer" : "dashboard");
      }
      return data;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (data?: { email?: string; name?: string }) => {
    setLoading(true);
    try {
      let resolvedEmail = data?.email;
      let resolvedName = data?.name;

      // Attempt interactive Firebase Google SSO popup
      try {
        const fbResult = await signInWithPopup(auth, googleProvider);
        if (fbResult.user) {
          resolvedEmail = fbResult.user.email || resolvedEmail;
          resolvedName = fbResult.user.displayName || resolvedName;
        }
      } catch (fbErr: any) {
        console.info("[Firebase SSO Notice]: Popup bypassed or blocked in iframe sandbox, falling back to official SSO auth channel:", fbErr?.code || fbErr?.message);
      }

      const res = await api.loginWithGoogle({
        email: resolvedEmail,
        name: resolvedName
      });

      setUser(res.user);

      // Persist to Cloud Firestore
      if (res.user?.id) {
        syncUserProfileToFirestore(res.user).catch((e) => {
          console.warn("[Firestore user sync]", e);
        });
      }

      if (!res.user.onboardingCompleted && res.user.role === "employee") {
        setActiveTab("onboarding");
      } else {
        setActiveTab("dashboard");
      }
      return res;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: {
    fullName: string;
    email: string;
    password?: string;
    employeeId?: string;
    department: string;
    designation: string;
    jobRole: string;
    organization?: string;
  }) => {
    setLoading(true);
    try {
      const res = await api.register(data);
      setUser(res.user);

      // Persist to Cloud Firestore
      if (res.user?.id) {
        syncUserProfileToFirestore(res.user).catch((e) => {
          console.warn("[Firestore register sync]", e);
        });
      }

      setActiveTab("onboarding");
      return res;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    signOut(auth).catch(() => {});
    setUser(null);
    setActiveTab("login");
  };

  const switchRole = async (targetRole: UserRole) => {
    setLoading(true);
    try {
      const data = await api.switchDemoRole(targetRole);
      setUser(data.user);

      if (data.user?.id) {
        syncUserProfileToFirestore(data.user).catch(() => {});
      }

      if (targetRole === "admin") {
        setActiveTab("admin");
      } else if (targetRole === "trainer") {
        setActiveTab("trainer");
      } else {
        setActiveTab("dashboard");
      }
    } catch (err) {
      console.error("Failed to switch demo role", err);
    } finally {
      setLoading(false);
    }
  };

  const role = user?.role || "employee";

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        loading,
        demoMode,
        setDemoMode,
        activeTab,
        setActiveTab,
        firebaseConnected,
        login,
        loginWithGoogle,
        register,
        logout,
        switchRole,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
