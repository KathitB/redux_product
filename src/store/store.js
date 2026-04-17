import { configureStore } from "@reduxjs/toolkit";
import productReducer from "../features/productsSlice";
import authReducer from "../features/authSlice";
import orderReducer from "../features/orderSlice";

export const store = configureStore({
  reducer: {
    products: productReducer,
    auth: authReducer,
    orders: orderReducer,
  },
});
