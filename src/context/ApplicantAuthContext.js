import React, { createContext, useContext, useState, useEffect } from "react";

const ApplicantAuthContext = createContext();

export const useApplicantAuth = () => useContext(ApplicantAuthContext);

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";
const TOKEN_KEY = "applicant_token";

export const ApplicantAuthProvider = ({ children }) => {
  const [applicant, setApplicant] = useState(null);
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY) || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      if (!storedToken) {
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`${API_URL}/api/applicant-auth/me`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        if (response.ok) {
          const data = await response.json();
          setApplicant(data);
          setToken(storedToken);
        } else {
          localStorage.removeItem(TOKEN_KEY);
          setToken(null);
        }
      } catch (error) {
        console.error("Applicant auth check failed:", error);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const response = await fetch(`${API_URL}/api/applicant-auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }
    localStorage.setItem(TOKEN_KEY, data.token);
    setToken(data.token);
    setApplicant(data.applicant);
    return data.applicant;
  };

  const register = async (email, password) => {
    const response = await fetch(`${API_URL}/api/applicant-auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }
    localStorage.setItem(TOKEN_KEY, data.token);
    setToken(data.token);
    setApplicant(data.applicant);
    return data.applicant;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setApplicant(null);
  };

  return (
    <ApplicantAuthContext.Provider
      value={{
        applicant,
        token,
        login,
        register,
        logout,
        isAuthenticated: !!token,
        loading,
      }}
    >
      {children}
    </ApplicantAuthContext.Provider>
  );
};

export default ApplicantAuthProvider;
