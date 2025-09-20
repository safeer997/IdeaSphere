import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  user: {},
  error: '',
};
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state, action) => {
      //do something here
    },
    onSuccess: (state, action) => {
      //do something here
    },
    onFailure: (state, action) => {
      //do something here
    },
  },
});

export const { loginStart, onSuccess, onFailure } = authSlice.actions;
export default authSlice.reducer;
