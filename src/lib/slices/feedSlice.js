import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  feed: [],
  loading: false,
  error: null,
};

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    fetchFeedStart: (state) => {
      state.loading = true;
    },
    fetchFeedSuccess: (state, action) => {
      state.loading = false;
      state.feed = action.payload;
    },
    fetchFeedFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addToFeed: (state, action) => {
      state.feed.unshift(action.payload);
    },
    likeFeedItem: (state, action) => {
      const item = state.feed.find(f => f.id === action.payload);
      if (item) {
        item.likes += 1;
      }
    },
  },
});

export const {
  fetchFeedStart,
  fetchFeedSuccess,
  fetchFeedFailure,
  addToFeed,
  likeFeedItem,
} = feedSlice.actions;

export default feedSlice.reducer;