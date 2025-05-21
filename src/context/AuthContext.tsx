
import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { User } from "@/types";
import { supabase, authUtils, getCurrentUserProfile } from "@/lib/supabase";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  isAuthenticated: false
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Initialize auth state and listen for changes
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      
      try {
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Get user profile data
          const profile = await getCurrentUserProfile();
          
          if (profile) {
            setUser({
              id: session.user.id,
              username: profile.username || session.user.email?.split('@')[0] || 'user',
              profileImage: profile.profile_image || undefined,
              points: profile.points,
              postsShared: profile.posts_shared,
              repostsReceived: profile.reposts_received,
              repostsMade: profile.reposts_made
            });
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
    
    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setIsLoading(true);
          const profile = await getCurrentUserProfile();
          
          if (profile) {
            setUser({
              id: session.user.id,
              username: profile.username || session.user.email?.split('@')[0] || 'user',
              profileImage: profile.profile_image || undefined,
              points: profile.points,
              postsShared: profile.posts_shared,
              repostsReceived: profile.reposts_received,
              repostsMade: profile.reposts_made
            });
          }
          setIsLoading(false);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await authUtils.login(email, password);
      
      if (error) {
        throw error;
      }
      
      if (data?.user) {
        toast.success("Login successful");
      }
    } catch (error: any) {
      toast.error(`Login failed: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const register = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await authUtils.register(email, password);
      
      if (error) {
        throw error;
      }
      
      if (data?.user) {
        toast.success("Registration successful! Please check your email for verification.");
      }
    } catch (error: any) {
      toast.error(`Registration failed: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = async () => {
    try {
      await authUtils.logout();
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
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
