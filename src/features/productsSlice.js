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

export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (productId, { rejectWithValue }) => {
    try {
      const res = await fetch(`https://dummyjson.com/products/${productId}`);

      if (!res.ok) {
        throw new Error("Failed to fetch product details");
      }

      return await res.json();
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch product details");
    }
  },
);

const initialState = {
  products: [],
  loading: false,
  error: null,
  selectedProductId: null,
  selectedProduct: null,
  selectedProductLoading: false,
  selectedProductError: null,
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
      state.cart = state.cart.filter((cartItem) => cartItem.quantity > 0);
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },

    selectProduct: (state, action) => {
      state.selectedProductId = action.payload;
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
      })
      .addCase(fetchProductById.pending, (state, action) => {
        state.selectedProductId = action.meta.arg;
        state.selectedProduct = null;
        state.selectedProductLoading = true;
        state.selectedProductError = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.selectedProductLoading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.selectedProductLoading = false;
        state.selectedProduct = null;
        state.selectedProductError =
          action.payload || "Failed to fetch product details";
      });
  },
});

export const {
  addToCart,
  removeFromCart,
  clearCart,
  decreaseQuantity,
  increaseQuantity,
  selectProduct,
} = productSlice.actions;

export default productSlice.reducer;
