
import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { User } from "@/types";
import { toast } from "sonner";

// Mock data for demo
const MOCK_USER: User = {
  id: "demo-user-123",
  username: "demouser",
  profileImage: "https://picsum.photos/id/1012/200",
  points: 75,
  postsShared: 5,
  repostsReceived: 12,
  repostsMade: 8
};

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signInWithGoogle: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  signInWithGoogle: async () => {},
  isAuthenticated: false
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Initialize with mock data
  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setUser(MOCK_USER);
      setIsLoading(false);
    }, 1000);
  }, []);
  
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Demo login - always succeeds
      setTimeout(() => {
        setUser(MOCK_USER);
        toast.success("Login successful");
        setIsLoading(false);
      }, 800);
    } catch (error: any) {
      toast.error(`Login failed: ${error.message}`);
      setIsLoading(false);
      throw error;
    }
  };
  
  const register = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Demo register - always succeeds
      setTimeout(() => {
        setUser(MOCK_USER);
        toast.success("Registration successful!");
        setIsLoading(false);
      }, 800);
    } catch (error: any) {
      toast.error(`Registration failed: ${error.message}`);
      setIsLoading(false);
      throw error;
    }
  };
  
  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);
      // Demo Google sign in - always succeeds
      setTimeout(() => {
        setUser(MOCK_USER);
        toast.success("Google sign-in successful!");
        setIsLoading(false);
      }, 800);
    } catch (error: any) {
      toast.error(`Google sign in failed: ${error.message}`);
      throw error;
    }
  };
  
  const logout = async () => {
    try {
      setUser(null);
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Logout failed");
    }
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        signInWithGoogle,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
