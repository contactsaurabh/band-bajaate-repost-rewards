
import React, { createContext, useState, useContext, ReactNode } from "react";
import { User } from "@/types";
import { mockCurrentUser } from "@/lib/mock-data";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  login: async () => {},
  logout: () => {},
  isAuthenticated: false
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API authentication
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setUser(mockCurrentUser);
      toast.success("Login successful");
    } catch (error) {
      toast.error("Login failed");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = () => {
    setUser(null);
    toast.success("Logged out successfully");
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
