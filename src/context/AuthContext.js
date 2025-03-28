import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  // Check for existing auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
          // Verify token validity with the backend
          const API_URL = process.env.REACT_APP_API_URL;
          
          try {
            const response = await fetch(`${API_URL}/api/auth/verify`, {
              method: "GET",
              headers: {
                "Authorization": `Bearer ${storedToken}`,
                "Content-Type": "application/json"
              },
              credentials: "include"
            });

            if (response.ok) {
              const userData = await response.json();
              setUser(userData);
              setToken(storedToken);
            } else {
              console.warn("Token verification failed, clearing auth state");
              localStorage.removeItem("token");
              setToken(null);
              setUser(null);
            }
          } catch (err) {
            console.error("Token verification error:", err);
            // Keep the token if it's a network error, might be offline
            if (!navigator.onLine) {
              console.log("Device appears to be offline, keeping token");
            } else {
              localStorage.removeItem("token");
              setToken(null);
              setUser(null);
            }
          }
        }
      } catch (error) {
        console.error("Auth verification error:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      console.log("Login attempt with:", credentials.email);
      
      const API_URL = process.env.REACT_APP_API_URL;
      console.log("Using API URL:", API_URL);
      
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
        credentials: "include", // Important for cookies
      });

      console.log("Login response status:", response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Login failed:", errorData);
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();
      console.log("Login successful, received data with token:", !!data.token);
      
      if (!data.token) {
        throw new Error("No token received from server");
      }
      
      // Store token in localStorage for persistence
      localStorage.setItem("token", data.token);
      
      // Update context state
      setToken(data.token);
      setUser(data.user);
      
      return data.user;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = () => {
    // Clear auth data
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    
    // Call logout endpoint if available
    try {
      const API_URL = process.env.REACT_APP_API_URL;
      fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        credentials: "include"
      }).catch(err => console.warn("Logout API call failed:", err));
    } catch (err) {
      console.warn("Error during logout:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
