import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import fileReducer from './fileSlice';
import chartReducer from './chartSlice'; // <-- Import the chart reducer
import aiReducer from './aiSlice'; 
import adminReducer from './adminSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    file: fileReducer,
    chart: chartReducer, 
    ai: aiReducer,
    admin: adminReducer, 
  },
});