import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import cartApi from "@/api/cart";

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartApi.getCart();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  items: [],
  total: 0,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.items?.find((item) => (item._id || item.artId?._id) === (newItem._id || newItem.artId?._id));

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items?.push({ ...newItem, quantity: 1 });
      }

      state.total = state.items?.reduce((sum, item) => {
        const price = item.price || item.artId?.price || 0;
        return sum + (price * (item.quantity || 1));
      }, 0);
    },
    increaseQuantity: (state, action) => {
      const item = action.payload;
      const foundItem = state.items.find((i) => (i._id || i.artId?._id) === (item._id || item.artId?._id));
      if (foundItem) {
        foundItem.quantity += 1;
        state.total += (foundItem.price || foundItem.artId?.price || 0);
      }
    },
    decreaseQuantity: (state, action) => {
      const item = action.payload;
      const foundItem = state.items.find((i) => (i._id || i.artId?._id) === (item._id || item.artId?._id));
      if (foundItem && foundItem.quantity > 1) {
        foundItem.quantity -= 1;
        state.total -= (foundItem.price || foundItem.artId?.price || 0);
      }
    },
    removeFromCart: (state, action) => {
      const item = action.payload;
      state.items = state.items.filter((i) => (i._id || i.artId?._id) !== (item._id || item.artId?._id));
      state.total = state.items.reduce((sum, i) => sum + ((i.price || i.artId?.price || 0) * i.quantity), 0);
    },
    clearCart: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.total = action.payload.reduce((sum, item) => {
          const price = item.artId?.price || 0;
          return sum + (price * item.quantity);
        }, 0);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;