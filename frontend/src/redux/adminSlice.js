import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import adminService from '../services/adminService';

const initialState = {
  users: [],
  stats: {},
  isLoading: false,
  isError: false,
  message: '',
};

// Thunk for getting all users
export const getUsers = createAsyncThunk(
  'admin/getUsers',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await adminService.getUsers(token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Thunk for getting stats
export const getStats = createAsyncThunk(
    'admin/getStats',
    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await adminService.getStats(token);
        } catch (error) {
            const message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Cases for getting users
      .addCase(getUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Cases for getting stats
      .addCase(getStats.fulfilled, (state, action) => {
          state.stats = action.payload;
      })
      .addCase(getStats.rejected, (state, action) => {
          // You can optionally handle stat errors here
          console.error('Failed to load stats');
      });
  },
});

export default adminSlice.reducer;

