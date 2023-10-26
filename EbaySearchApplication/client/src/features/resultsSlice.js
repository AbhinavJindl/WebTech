import { createSlice } from '@reduxjs/toolkit';
const _ = require('lodash');

export const resultsSlice = createSlice({
  name: 'results',
  initialState: {
    items: [],
    wishlistItems: [],
    pageNumber: 1,
    resultsActiveTab: true,
    currentLocation: "90007",
    isClear: true,
    isLoading: false,
    suggestions: [],
  },
  reducers: {
    setItems: (state, action) => {
      state.items = action.payload ;
    },
    setWishlistItems: (state, action) => {
        state.wishlistItems = action.payload;
    },
    setCurrentLocation: (state, action) => {
        state.currentLocation = action.payload;
    },
    setResultsTab: (state, action) => {
        state.resultsActiveTab = true;
    },
    unsetResultsTab: (state, action) => {
        state.resultsActiveTab = false;
    },
    updateWishlistItem: (state, action) => {
        let idx = state.wishlistItems.findIndex(item => item.itemId === action.payload.itemId)
        if (idx !== -1) {
            state.wishlistItems[idx] = action.payload;
        } else {
            state.wishlistItems.push(action.payload);
        }
    },
    incrementPage: state => {
        state.pageNumber += 1 ;
    },
    decrementPage: state => {
        state.pageNumber -= 1 ;
    },
    setPage: (state, action) => {
        state.pageNumber = action.payload ;
    },
    setIsLoading: (state, action) => {
        state.isLoading = action.payload;
    },
    setClear: (state, action) => {
        if (action.payload) {
            state.isClear = true;
            state.items = []
            state.pageNumber = 1;
        } else {
            state.isClear = false;
        }
    },
    setSuggestions: (state, action) => {
        state.suggestions = action.payload;
    },
  }
});

export const {
    setItems, 
    setWishlistItems, 
    updateWishlistItem,
    incrementPage, 
    decrementPage, 
    setPage, 
    setResultsTab,
    unsetResultsTab,
    setCurrentLocation,
    setClear,
    setIsLoading,
    setSuggestions,
} = resultsSlice.actions;
export const items = state => state.results.items;
export const wishlistItems = state => _.filter(state.results.wishlistItems, {'wishListed': true});
export const pageNumber = state => state.results.pageNumber;
export const resultsActiveTab = state => state.results.resultsActiveTab;
export const currentLocation = state => state.results.currentLocation;
export const isClear = state => state.results.isClear;
export const isLoading = state => state.results.isLoading;
export const suggestions = state => state.results.suggestions;
export default resultsSlice.reducer;
