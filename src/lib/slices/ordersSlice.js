import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import orderApi from "@/api/order";

export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await orderApi.getOrders();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const fetchOrdersByUser = createAsyncThunk(
  "orders/fetchOrdersByUser",
  async (status, { rejectWithValue }) => {
    try {
      const response = await orderApi.getOrdersByUser(status);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const fetchOrdersByMerchant = createAsyncThunk(
  "orders/fetchOrdersByMerchant",
  async (_, { rejectWithValue }) => {
    try {
      const response = await orderApi.getOrdersByMerchant();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const createNewOrder = createAsyncThunk(
  "orders/createOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await orderApi.createOrder(orderData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const updateOrderAsync = createAsyncThunk(
  "orders/updateOrder",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await orderApi.updateOrder(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const deleteOrderAsync = createAsyncThunk(
  "orders/deleteOrder",
  async (id, { rejectWithValue }) => {
    try {
      await orderApi.deleteOrder(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const payOrderViaKhalti = createAsyncThunk(
  "orders/payViaKhalti",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await orderApi.payViaKhalti(orderId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const payOrderViaStripe = createAsyncThunk(
  "orders/payViaStripe",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await orderApi.payViaStripe(orderId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const confirmOrderPayment = createAsyncThunk(
  "orders/confirmPayment",
  async ({ orderId, data }, { rejectWithValue }) => {
    try {
      const response = await orderApi.confirmPayment(orderId, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

const initialState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchOrdersByUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrdersByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrdersByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchOrdersByMerchant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrdersByMerchant.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrdersByMerchant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createNewOrder.fulfilled, (state, action) => {
        state.orders.push(action.payload);
        state.currentOrder = action.payload;
      })
      .addCase(updateOrderAsync.fulfilled, (state, action) => {
        const index = state.orders.findIndex(
          (order) => order.id === action.payload.id,
        );
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        if (state.currentOrder?.id === action.payload.id) {
          state.currentOrder = action.payload;
        }
      })
      .addCase(deleteOrderAsync.fulfilled, (state, action) => {
        state.orders = state.orders.filter(
          (order) => order.id !== action.payload,
        );
        if (state.currentOrder?.id === action.payload) {
          state.currentOrder = null;
        }
      });
  },
});

export const { clearError, setCurrentOrder } = ordersSlice.actions;

export default ordersSlice.reducer;
