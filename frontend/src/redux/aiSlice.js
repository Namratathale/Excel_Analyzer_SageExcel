import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Use a relative path to leverage the Vite proxy.
const API_URL = '/api/ai/';

// Thunk to generate summary
export const generateAiSummary = createAsyncThunk(
  'ai/generateSummary',
  async (headers, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const response = await axios.post(API_URL + 'summary', { headers }, config);
      return response.data.summary;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const initialState = {
  summary: '',
  isLoading: false,
  isError: false,
  message: '',
};

export const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    resetAiState: (state) => {
      state.summary = '';
      state.isLoading = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateAiSummary.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(generateAiSummary.fulfilled, (state, action) => {
        state.isLoading = false;
        state.summary = action.payload;
      })
      .addCase(generateAiSummary.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetAiState } = aiSlice.actions;
export default aiSlice.reducer;
