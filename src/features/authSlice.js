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
      const { email, password } = action.payload;
      const normalizedEmail = email.trim().toLowerCase();

      if (normalizedEmail === "admin@gmail.com" && password === "12345") {
        const user = {
          email: normalizedEmail,
          name: "admin",
        };

        state.isAuthenticated = true;
        state.user = user;
        state.error = null;
        localStorage.setItem("authUser", JSON.stringify(user));
        return;
      }

      state.isAuthenticated = false;
      state.user = null;
      state.error = "Invalid email or password";
      localStorage.removeItem("authUser");
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
