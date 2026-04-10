import { configureStore } from "@reduxjs/toolkit";
import productReducer from "../features/productsSlice";
import authReducer from "../features/authSlice";

export const store = configureStore({
  reducer: {
    products: productReducer,
    auth: authReducer,
  },
});
