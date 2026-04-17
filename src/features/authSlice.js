import { createSlice } from "@reduxjs/toolkit";

const storedUser = JSON.parse(localStorage.getItem("authUser"));

const initialState = {
  isAuthenticated: Boolean(storedUser),
  user: storedUser,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      const { name, phone } = action.payload;
      const normalizedName = name.trim();
      const normalizedPhone = phone.trim();

      if (!normalizedName || !normalizedPhone) {
        state.isAuthenticated = false;
        state.user = null;
        state.error = "Name and phone number are required";
        localStorage.removeItem("authUser");
        return;
      }

      const user = {
        name: normalizedName,
        phone: normalizedPhone,
      };

      state.isAuthenticated = true;
      state.user = user;
      state.error = null;
      localStorage.setItem("authUser", JSON.stringify(user));
    },

    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
      localStorage.removeItem("authUser");
    },

    clearAuthError: (state) => {
      state.error = null;
    },
  },
});

export const { login, logout, clearAuthError } = authSlice.actions;

export default authSlice.reducer;
