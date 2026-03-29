const { createSlice } = require("@reduxjs/toolkit");

const musicSlice = createSlice({
  name: "music",
  initialState: {
    refresh: false,
  },
  reducers: {
    refreshList: (state, action) => {
      state.refresh = action.payload;
    },
  },
});

export const { refreshList } = musicSlice.actions;

export default musicSlice.reducer;
