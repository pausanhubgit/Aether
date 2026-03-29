const { createSlice } = require("@reduxjs/toolkit");

const videoSlice = createSlice({
  name: "video",
  initialState: {
    refresh: false,
  },
  reducers: {
    refreshList: (state, action) => {
      state.refresh = action.payload;
    },
  },
});

export const { refreshList } = videoSlice.actions;

export default videoSlice.reducer;
