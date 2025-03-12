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
       const userData = JSON.parse(atob(token.split('.')[1]));
       setUser(userData);
     } catch (error) {
       console.error("Invalid token:", error);
       localStorage.removeItem("token");
     }
   }
   setIsLoading(false);
 };

 const login = async (credentials) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    localStorage.setItem('token', data.token);
    
    // Set user data from the response
    const userData = data.user;
    setUser(userData);
    
    return { success: true, role: userData.role };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

 const logout = () => {
   localStorage.removeItem("token");
   setUser(null);
   navigate("/login");
 };

 const value = {
   user,
   isAuthenticated: !!user,
   login,
   logout,
   token: localStorage.getItem("token")
 };

 if (isLoading) {
   return <div>Loading...</div>;
 }

 return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
 const context = useContext(AuthContext);
 if (!context) {
   throw new Error("useAuth must be used within an AuthProvider");
 }
 return context;
};

export default AuthContext;