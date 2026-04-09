import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchData = createAsyncThunk(
  "products/fetchproductData",
  async () => {
    // const res = await fetch("https://fakestoreapi.com/products");
    const res = await fetch("https://dummyjson.com/products");
    const data = await res.json();
    return data;
  },
);

const initialState = {
  products: [],
  //   cart: [],
  loading: false,
  error: null,
  cart: JSON.parse(localStorage.getItem("cart")) || [],
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;

      const existingitem = state.cart.find((p) => p.id === item.id);

      if (existingitem) {
        existingitem.quantity += 1;
      } else {
        state.cart.push({ ...item, quantity: 1 });
      }

      localStorage.setItem("cart", JSON.stringify(state.cart));
    },

    removeFromCart: (state, action) => {
      state.cart = state.cart.filter((item) => item.id !== action.payload);

      localStorage.setItem("cart", JSON.stringify(state.cart));
    },

    clearCart: (state, action) => {
      state.cart = [];

      localStorage.setItem("cart", JSON.stringify(state.cart));
    },

    increaseQuantity: (state, action) => {
      const item = state.cart.find((i) => i.id === action.payload);
      if (item) {
        item.quantity += 1;
      }
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },

    decreaseQuantity: (state, action) => {
      const item = state.cart.find((i) => i.id === action.payload);
      if (item && item.quantity > 0) {
        item.quantity -= 1;
      }
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.loading = false;
        state.products = Array.isArray(action.payload)
          ? action.payload
          : action.payload.products || [];
      })
      .addCase(fetchData.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch products";
      });
  },
});

export const {
  addToCart,
  removeFromCart,
  clearCart,
  decreaseQuantity,
  increaseQuantity,
} = productSlice.actions;

export default productSlice.reducer;
