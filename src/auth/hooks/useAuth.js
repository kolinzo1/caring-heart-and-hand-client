import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setCredentials,
  logout,
  setError,
  setLoading,
} from "../../redux/slices/authSlice";
import authService from "../services/authService";

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    const validateToken = async () => {
      try {
        dispatch(setLoading(true));
        const userData = await authService.validateToken();
        if (userData) {
          dispatch(setCredentials(userData));
        } else {
          dispatch(logout());
        }
      } catch (error) {
        dispatch(setError(error.message));
      } finally {
        dispatch(setLoading(false));
      }
    };

    if (token && !user) {
      validateToken();
    }
  }, [dispatch, token, user]);

  const handleLogin = async (credentials) => {
    try {
      dispatch(setLoading(true));
      const userData = await authService.login(credentials);
      dispatch(setCredentials(userData));
      return userData;
    } catch (error) {
      dispatch(setError(error.message));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } finally {
      dispatch(logout());
    }
  };

  const handleRegister = async (userData) => {
    try {
      dispatch(setLoading(true));
      const response = await authService.register(userData);
      return response;
    } catch (error) {
      dispatch(setError(error.message));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleForgotPassword = async (email) => {
    try {
      dispatch(setLoading(true));
      const response = await authService.forgotPassword(email);
      return response;
    } catch (error) {
      dispatch(setError(error.message));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleResetPassword = async (token, newPassword) => {
    try {
      dispatch(setLoading(true));
      const response = await authService.resetPassword(token, newPassword);
      return response;
    } catch (error) {
      dispatch(setError(error.message));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated: !!user && !!token,
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister,
    forgotPassword: handleForgotPassword,
    resetPassword: handleResetPassword,
  };
};

export default useAuth;
