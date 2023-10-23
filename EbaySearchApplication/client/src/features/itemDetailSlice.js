import { createSlice } from '@reduxjs/toolkit';

export const itemDetailSlice = createSlice({
  name: 'itemDetail',
  initialState: {
    details: {},
    detailPageOpen: false,
  },

  reducers: {
    setDetails: (state, action) => {
      state.details = action.payload ;
    },
    setDetailPageOpen: (state, action) => {
        state.detailPageOpen = action.payload
        if (!action.payload) {
            state.details = {};
        }
    },
  }
});

export const { setDetails, setDetailPageOpen } = itemDetailSlice.actions;
export const details = state => state.itemDetail.details;
export const isDetailPageOpen = state => state.itemDetail.detailPageOpen;
export default itemDetailSlice.reducer;
