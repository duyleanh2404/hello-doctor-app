import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isLoggedIn: boolean;
  emailValue: string;
}

const initialState: AuthState = {
  isLoggedIn: false,
  emailValue: ""
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoginStatus: (state, action: PayloadAction<boolean>) => {
      state.isLoggedIn = action.payload;
    },
    setEmailValue: (state, action: PayloadAction<string>) => {
      state.emailValue = action.payload;
    }
  }
});

export const { setLoginStatus, setEmailValue } = authSlice.actions;
export default authSlice.reducer;