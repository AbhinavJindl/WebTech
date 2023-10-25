import { createSlice } from '@reduxjs/toolkit';

export const itemDetailSlice = createSlice({
  name: 'itemDetail',
  initialState: {
    details: {},
    detailPageOpen: false,
    similarPhotos: {},
    similarProducts: {},
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
    setSimilarPhotos: (state, action) => {
        state.similarPhotos = action.payload;
    },
    setSimilarProducts: (state, action) => {
        state.similarProducts = action.payload;
    },
  }
});

export const { 
    setDetails, 
    setDetailPageOpen, 
    setSimilarPhotos, 
    setSimilarProducts, 
} = itemDetailSlice.actions;
export const details = state => state.itemDetail.details;
export const isDetailPageOpen = state => state.itemDetail.detailPageOpen;
export const similarPhotos = state => state.itemDetail.similarPhotos;
export const similarProducts = state => state.itemDetail.similarProducts;
export default itemDetailSlice.reducer;
