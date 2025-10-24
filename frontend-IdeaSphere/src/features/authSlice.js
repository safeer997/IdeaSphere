import { createSlice } from '@reduxjs/toolkit';
import { login as loginApi, logout as logoutApi, getCurrentUser } from './authApi.js';

const initialState = {
  isLoggedIn: false,
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Start loading
    startLoading: (state) => {
      state.loading = true;
      state.error = null;
    },

    // Local login / OAuth login success
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isLoggedIn = true;
      state.user = action.payload;
      state.error = null;
    },

    // Login / fetch failure
    authFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isLoggedIn = false;
      state.user = null;
    },

    // Logout
    logoutSuccess: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const { startLoading, loginSuccess, authFailure, logoutSuccess } = authSlice.actions;

export default authSlice.reducer;


// -------------------- Helper functions --------------------
// These can be imported in your component and dispatched

export const performLogin = (identifier, password) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const res = await loginApi(identifier, password);
    if (!res.success) throw new Error(res.message);
    dispatch(loginSuccess(res.data));
  } catch (err) {
    dispatch(authFailure(err.message));
  }
};

export const performLogout = () => async (dispatch) => {
  await logoutApi();
  dispatch(logoutSuccess());
};

export const fetchUser = () => async (dispatch) => {
  try {
    const user = await getCurrentUser();
    if (user) dispatch(loginSuccess(user));
  } catch {
    dispatch(logoutSuccess());
  }
};
