import { createSlice } from "@reduxjs/toolkit";

const socialSlice = createSlice({
  name: "socialPersistence",
  initialState: {
    followedUserIds: [], // Stores stringified IDs
  },
  reducers: {
    localFollow: (state, action) => {
      const id = String(action.payload);
      if (!state.followedUserIds.includes(id)) {
        state.followedUserIds.push(id);
      }
    },
    localUnfollow: (state, action) => {
      const id = String(action.payload);
      state.followedUserIds = state.followedUserIds.filter(item => item !== id);
    },
    clearSocialPersistence: (state) => {
      state.followedUserIds = [];
    }
  },
});

export const { localFollow, localUnfollow, clearSocialPersistence } = socialSlice.actions;
export default socialSlice.reducer;
