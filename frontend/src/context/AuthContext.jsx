import { createContext, useContext, useEffect, useMemo, useState } from "react";
import apiClient from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    const savedToken = localStorage.getItem("token");
    if (!savedToken) return;

    const response = await apiClient.get("/auth/me");
    setUser(response.data.user);
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await fetchCurrentUser();
      } catch (error) {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const contextValue = useMemo(() => {
    return {
      user,
      loading,
      login: (data) => {
        localStorage.setItem("token", data.token);
        setUser(data.user);
      },
      logout: () => {
        localStorage.removeItem("token");
        setUser(null);
      },
    };
  }, [user, loading]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}