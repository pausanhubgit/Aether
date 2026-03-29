const { createSlice } = require("@reduxjs/toolkit");

const eventSlice = createSlice({
  name: "events",
  initialState: {
    refresh: false,
  },
  reducers: {
    refreshList: (state, action) => {
      state.refresh = action.payload;
    },
  },
});

export const { refreshList } = eventSlice.actions;

export default eventSlice.reducer;
