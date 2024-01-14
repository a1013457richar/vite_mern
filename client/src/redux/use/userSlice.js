import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userData: null,
    loading: false,
    error: false,
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
        signInSuccess: (state,action) => {
            state.userData = action.payload;//從action.payload取得資料
            state.loading = false;
            state.error = false;
        },
        signInFail: (state,action) => {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const { signInStart, signInSuccess, signInFail } = userSlice.actions;
export default userSlice.reducer;
