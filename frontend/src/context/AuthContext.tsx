import { createContext, useContext, useEffect, useState } from "react";
import { connectSocket, disconnectSocket } from "../lib/socket";

interface AuthContextType {
  isAuthenticated: boolean;
  isAuthReady: boolean; // ✅ NEW
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false); // ✅ NEW

  // 🔑 Bootstrap auth on refresh
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setIsAuthenticated(true);
      connectSocket(token);
    }

    setIsAuthReady(true); // ✅ mark auth as resolved
  }, []);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
    connectSocket(token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    disconnectSocket();
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isAuthReady,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
