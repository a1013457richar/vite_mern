import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userData: null,
  loading: false,
  error: null,
};
//the name of the slice is user
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    //actions
    signInStart: (state) => {
      state.loading = true;
    },
    signInSuccess: (state, action) => {
      state.userData = action.payload; //從action.payload取得資料
      state.loading = false;
      state.error = null;
    },
    signInFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateUserStart: (state) => {
      state.loading = true;
    },
    updateUserSuccess: (state, action) => {
      state.userData = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateUserFail: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    deleteUserStart: (state) => {
      state.loading = true;
    },
    deleteUserSuccess: (state) => {
      state.userData = null;
      state.loading = false;
      state.error = null;
    },
    deleteUserFail: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    signOutUserStart: (state) => {
      state.loading = true;
    },
    signOutUserSuccess: (state) => {
      state.userData = null;
      state.loading = false;
      state.error = null;
    },
    signOutUserFail: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  signInStart,
  signInSuccess,
  signInFail,
  updateUserFail,
  updateUserSuccess,
  updateUserStart,
  deleteUserStart,

  deleteUserSuccess,
  deleteUserFail,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFail,
} = userSlice.actions;
export default userSlice.reducer;
