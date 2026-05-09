const { createSlice } = require("@reduxjs/toolkit");

const artSlice = createSlice({
  name: "arts",
  initialState: {
    refresh: false,
  },
  reducers: {
    refreshList: (state, action) => {
      state.refresh = action.payload;
    },
  },
});

export const { refreshList } = artSlice.actions;

export default artSlice.reducer;
