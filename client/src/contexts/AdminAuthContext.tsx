import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface AdminAuthContextValue {
  isAuthenticated: boolean;
  adminUsername: string | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(undefined);

// Credenciales por defecto
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Verificar si hay sesión guardada en localStorage
    if (typeof window !== "undefined") {
      return localStorage.getItem("adminAuth") === "true";
    }
    return false;
  });
  const [adminUsername, setAdminUsername] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("adminUsername");
    }
    return null;
  });

  const login = useCallback((username: string, password: string): boolean => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setAdminUsername(username);
      localStorage.setItem("adminAuth", "true");
      localStorage.setItem("adminUsername", username);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setAdminUsername(null);
    localStorage.removeItem("adminAuth");
    localStorage.removeItem("adminUsername");
  }, []);

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, adminUsername, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth debe usarse dentro de AdminAuthProvider");
  }
  return context;
}
