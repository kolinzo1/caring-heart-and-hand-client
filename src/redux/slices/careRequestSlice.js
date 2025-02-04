import { createSlice } from "@reduxjs/toolkit";

const careRequestSlice = createSlice({
  name: "careRequests",
  initialState: {
    requests: [],
    loading: false,
    error: null,
  },
  reducers: {
    setRequests: (state, action) => {
      state.requests = action.payload;
    },
    addRequest: (state, action) => {
      state.requests.push(action.payload);
    },
    updateRequest: (state, action) => {
      const index = state.requests.findIndex(
        (req) => req.id === action.payload.id
      );
      if (index !== -1) {
        state.requests[index] = action.payload;
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

export const { setRequests, addRequest, updateRequest, setLoading, setError } =
  careRequestSlice.actions;

export default careRequestSlice.reducer;
