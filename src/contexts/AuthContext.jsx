
import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem("matrixUser");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("matrixUser");
      }
    }
    setLoading(false);
  }, []);

  const login = (username) => {
    // Generate a random anonymous ID
    const anonymousId = Math.random().toString(36).substring(2, 15);
    
    // Create user object with anonymous username
    const newUser = {
      id: anonymousId,
      username: username || `Anonymous${Math.floor(Math.random() * 10000)}`,
      joinedAt: new Date().toISOString(),
    };
    
    // Save to localStorage
    localStorage.setItem("matrixUser", JSON.stringify(newUser));
    setUser(newUser);
    
    toast({
      title: "Access Granted",
      description: "You have entered the Matrix.",
      duration: 3000,
    });
    
    return newUser;
  };

  const logout = () => {
    localStorage.removeItem("matrixUser");
    setUser(null);
    
    toast({
      title: "Disconnected",
      description: "You have been disconnected from the Matrix.",
      duration: 3000,
    });
  };

  const value = {
    user,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
