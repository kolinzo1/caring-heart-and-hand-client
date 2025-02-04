import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        // Decode the mock token
        const userData = JSON.parse(atob(token));
        setUser(userData);
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token");
      }
    }
    setIsLoading(false);
  };

  const login = async (credentials) => {
    // Mock credentials for testing
    const mockUsers = {
      "staff@example.com": {
        password: "staffpass123",
        role: "staff",
        name: "John Staff",
      },
      "admin@example.com": {
        password: "adminpass123",
        role: "admin",
        name: "Jane Admin",
      },
    };

    const user = mockUsers[credentials.email];

    if (user && user.password === credentials.password) {
      // Create mock token
      const mockToken = btoa(
        JSON.stringify({
          email: credentials.email,
          role: user.role,
          name: user.name,
        })
      );

      // Store token and user data
      localStorage.setItem("token", mockToken);
      setUser({
        email: credentials.email,
        role: user.role,
        name: user.name,
      });

      // Return success
      return { success: true, role: user.role };
    } else {
      throw new Error("Invalid credentials");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
