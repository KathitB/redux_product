import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orders: JSON.parse(localStorage.getItem("orders")) || [],
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    addOrder: (state, action) => {
      state.orders.push(action.payload);
      localStorage.setItem("orders", JSON.stringify(state.orders));
    },
  },
});

export const { addOrder } = orderSlice.actions;
export default orderSlice.reducer;


