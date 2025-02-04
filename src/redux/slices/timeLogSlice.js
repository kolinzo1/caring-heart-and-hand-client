import { createSlice } from "@reduxjs/toolkit";

const timeLogSlice = createSlice({
  name: "timeLogs",
  initialState: {
    logs: [],
    loading: false,
    error: null,
  },
  reducers: {
    setLogs: (state, action) => {
      state.logs = action.payload;
    },
    addLog: (state, action) => {
      state.logs.push(action.payload);
    },
    updateLog: (state, action) => {
      const index = state.logs.findIndex((log) => log.id === action.payload.id);
      if (index !== -1) {
        state.logs[index] = action.payload;
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setLogs, addLog, updateLog, setLoading, setError } =
  timeLogSlice.actions;

export default timeLogSlice.reducer;
