import { configureStore } from '@reduxjs/toolkit';
import resultsReducer from './features/resultsSlice';
import itemDetailReducer from './features/itemDetailSlice';

export const store = configureStore({
  reducer: {
    results: resultsReducer,
    itemDetail: itemDetailReducer,
  }
});
