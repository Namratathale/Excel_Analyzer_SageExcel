import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as XLSX from 'xlsx';
import { logout } from './authSlice'; // <-- Import the logout action


const initialState = {
  fileName: null,
  headers: [],
  rows: [],
  isParsing: false,
  error: null,
};

export const parseFile = createAsyncThunk(
  'file/parseFile',
  async (file, { rejectWithValue }) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = event.target.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          if (json.length === 0) {
              return rejectWithValue('Excel file is empty.');
          }
          const headers = json[0];
          const rows = json.slice(1).map(row => {
            let rowData = {};
            headers.forEach((header, index) => {
              rowData[header] = row[index] !== undefined ? row[index] : '';
            });
            return rowData;
          });
          resolve({ fileName: file.name, headers, rows });
        } catch (e) {
          rejectWithValue('Error parsing file. Please ensure it is a valid Excel file.');
        }
      };
      reader.onerror = () => rejectWithValue('Error reading file.');
      reader.readAsBinaryString(file);
    });
  }
);

export const fileSlice = createSlice({
  name: 'file',
  initialState,
  reducers: {
    clearFileData: (state) => {
      state.fileName = null;
      state.headers = [];
      state.rows = [];
      state.error = null;
    },
    loadHistoricalFile: (state, action) => {
        state.fileName = action.payload.originalFileName;
        state.headers = action.payload.headers;
        state.rows = action.payload.rows;
        state.isParsing = false;
        state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(parseFile.pending, (state) => {
        state.isParsing = true;
        state.error = null;
      })
      .addCase(parseFile.fulfilled, (state, action) => {
        state.isParsing = false;
        state.fileName = action.payload.fileName;
        state.headers = action.payload.headers;
        state.rows = action.payload.rows;
      })
      .addCase(parseFile.rejected, (state, action) => {
        state.isParsing = false;
        state.error = action.payload;
        state.fileName = null;
        state.headers = [];
        state.rows = [];
      })
       .addCase(logout.fulfilled, (state) => {
        Object.assign(state, initialState);
      });
  },
});

// Ensure all actions are exported correctly from the slice
export const { clearFileData, loadHistoricalFile } = fileSlice.actions;
export default fileSlice.reducer;