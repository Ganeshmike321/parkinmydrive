import React, { useState, createContext, useContext, useEffect } from "react";
import type { ReactNode } from "react";

// Define the shape of the context
interface AppContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  ownerToken: string | null;
  setOwnerToken: (token: string | null) => void;
  currentUser: any;
  setCurrentUser: (user: any) => void;
  role: string | null;
  setRole: (role: string | null) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  logout: () => void;
}

// Default context value
const defaultContext: AppContextType = {
  token: null,
  setToken: () => {},
  ownerToken: null,
  setOwnerToken: () => {},
  currentUser: null,
  setCurrentUser: () => {},
  role: null,
  setRole: () => {},
  isAuthenticated: true,
  setIsAuthenticated: () => {},
  logout: () => {},
};

const AppContext = createContext<AppContextType>(defaultContext);

// Props interface for provider
interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [ownerToken, setOwnerToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem("isAuthenticated"));

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem("isAuthenticated"));
    setToken(localStorage.getItem("ACCESS_TOKEN"));
    setOwnerToken(localStorage.getItem("ACCESS_OWNER_TOKEN"));
  }, []);

  const logout = () => {
    setIsAuthenticated(false);
    setToken("");
    setOwnerToken("");
    localStorage.clear();
  };

  return (
    <AppContext.Provider
      value={{
        token,
        setToken,
        ownerToken,
        setOwnerToken,
        currentUser,
        setCurrentUser,
        role,
        setRole,
        isAuthenticated,
        setIsAuthenticated,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useAuthContext = (): AppContextType => {
  return useContext(AppContext);
};

export { AuthProvider, useAuthContext };
