import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import chartService from '../services/chartService';

const initialState = {
  chartType: 'bar',
  xAxisKey: null,
  yAxisKey: null,
  zAxisKey: null,
  isSaving: false,
  isSaveSuccess: false,
  isSaveError: false,
  saveMessage: '',
  history: [],
  isHistoryLoading: false,
};

// --- ACTION: SAVE A CHART ---
export const saveChart = createAsyncThunk(
  'charts/save',
  async (chartData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await chartService.saveChart(chartData, token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// --- ACTION: GET ALL CHARTS ---
export const getCharts = createAsyncThunk(
  'charts/getHistory',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await chartService.getCharts(token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// --- ACTION: DELETE A CHART ---
export const deleteChart = createAsyncThunk(
  'charts/delete',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await chartService.deleteChart(id, token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const chartSlice = createSlice({
  name: 'chart',
  initialState,
  reducers: {
    setChartConfig: (state, action) => {
      state.xAxisKey = action.payload.xAxisKey;
      state.yAxisKey = action.payload.yAxisKey;
      state.zAxisKey = action.payload.zAxisKey;
    },
    clearChartConfig: (state) => {
      state.xAxisKey = null;
      state.yAxisKey = null;
      state.zAxisKey = null;
    },
    resetSaveState: (state) => {
      state.isSaving = false;
      state.isSaveSuccess = false;
      state.isSaveError = false;
      state.saveMessage = '';
    },
    loadHistoricalChart: (state, action) => {
      state.chartType = action.payload.chartType;
      state.xAxisKey = action.payload.xKey;
      state.yAxisKey = action.payload.yKey;
      state.zAxisKey = action.payload.zKey;
    },
  },
  extraReducers: (builder) => {
    builder
      // Cases for saving a chart
      .addCase(saveChart.pending, (state) => {
        state.isSaving = true;
      })
      .addCase(saveChart.fulfilled, (state, action) => {
        state.isSaving = false;
        state.isSaveSuccess = true;
        state.saveMessage = 'Chart saved successfully!';
        state.history.unshift(action.payload);
      })
      .addCase(saveChart.rejected, (state, action) => {
        state.isSaving = false;
        state.isSaveError = true;
        state.saveMessage = action.payload;
      })
      // Cases for getting chart history
      .addCase(getCharts.pending, (state) => {
        state.isHistoryLoading = true;
      })
      .addCase(getCharts.fulfilled, (state, action) => {
        state.isHistoryLoading = false;
        state.history = action.payload;
      })
      .addCase(getCharts.rejected, (state, action) => {
        state.isHistoryLoading = false;
      })
      // Cases for deleting a chart
      .addCase(deleteChart.pending, (state) => {
        state.isHistoryLoading = true;
      })
      .addCase(deleteChart.fulfilled, (state, action) => {
        state.isHistoryLoading = false;
        state.history = state.history.filter(
          (chart) => chart._id !== action.payload.id
        );
      })
      .addCase(deleteChart.rejected, (state, action) => {
        state.isHistoryLoading = false;
        console.error('Failed to delete chart:', action.payload);
      });
  },
});

export const { setChartConfig, clearChartConfig, resetSaveState, loadHistoricalChart } = chartSlice.actions;
export default chartSlice.reducer;