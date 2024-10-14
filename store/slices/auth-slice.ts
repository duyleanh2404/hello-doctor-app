import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  verificationEmail: string;
  isLoggedIn: boolean;
  isVerifyingAuth: boolean;
  isResettingPassword: boolean;
  isVerifyingForgotPassword: boolean;
};

const initialState: AuthState = {
  verificationEmail: "",
  isLoggedIn: false,
  isVerifyingAuth: false,
  isResettingPassword: false,
  isVerifyingForgotPassword: false
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setVerificationEmail: (state, action: PayloadAction<string>) => {
      state.verificationEmail = action.payload;
    },
    setLoginStatus: (state, action: PayloadAction<boolean>) => {
      state.isLoggedIn = action.payload;
    },
    setVerifyingAuthStatus: (state, action: PayloadAction<boolean>) => {
      state.isVerifyingAuth = action.payload;
    },
    setVerifyingForgotPasswordStatus: (state, action: PayloadAction<boolean>) => {
      state.isVerifyingForgotPassword = action.payload;
    },
    setResettingPasswordStatus: (state, action: PayloadAction<boolean>) => {
      state.isResettingPassword = action.payload;
    }
  }
});

export const {
  setLoginStatus,
  setVerificationEmail,
  setVerifyingAuthStatus,
  setResettingPasswordStatus,
  setVerifyingForgotPasswordStatus
} = authSlice.actions;

export default authSlice.reducer;