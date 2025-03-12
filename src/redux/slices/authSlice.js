import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: localStorage.getItem("token"),
  userRole: localStorage.getItem("userRole"),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.userRole = action.payload.userRole;
      state.loading = false;
      state.error = null;
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("userRole", action.payload.userRole);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.userRole = null;
      state.loading = false;
      state.error = null;
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
    },
    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { 
  setLoading, 
  setError, 
  loginSuccess, 
  logout,
  clearCredentials 
} = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
export const selectUserRole = (state) => state.auth.userRole;