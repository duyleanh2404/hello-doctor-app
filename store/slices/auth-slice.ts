import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserData {
  email: string;
  fullname: string;
  role: string;
  image: string;
};

interface AuthState {
  verificationEmail: string;
  userData: UserData | null;
  isLoggedIn: boolean;
  isVerifyingAuth: boolean;
  isResettingPassword: boolean;
  isVerifyingForgotPassword: boolean;
};

const initialState: AuthState = {
  verificationEmail: "",
  userData: null,
  isLoggedIn: false,
  isVerifyingAuth: false,
  isResettingPassword: false,
  isVerifyingForgotPassword: false
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetToLogin: () => {
      return initialState;
    },

    resetUserData: (state) => {
      state.userData = null;
    },

    setVerificationEmail: (state, action: PayloadAction<string>) => {
      state.verificationEmail = action.payload;
    },

    setUserData: (state, action: PayloadAction<Partial<UserData>>) => {
      if (state.userData) {
        state.userData = { ...state.userData, ...action.payload };
      } else {
        state.userData = action.payload as UserData;
      }
    },

    setLoginSuccess: (state) => {
      state.isLoggedIn = true;
      state.verificationEmail = "";
    },

    setResetPasswordSuccess: (state) => {
      state.verificationEmail = "";
      state.isResettingPassword = false;
    },

    setVerifyingAuthSuccess: (state) => {
      state.verificationEmail = "";
      state.isVerifyingAuth = false;
    },

    setVerifyingForgotPasswordSuccess: (state) => {
      state.isResettingPassword = true;
      state.isVerifyingForgotPassword = false;
    },

    setLoginStatus: (state, action: PayloadAction<boolean>) => {
      state.isLoggedIn = action.payload;
    },

    setVerifyingAuthStatus: (state, action: PayloadAction<boolean>) => {
      state.isVerifyingAuth = action.payload;
    },

    setResettingPasswordStatus: (state, action: PayloadAction<boolean>) => {
      state.isResettingPassword = action.payload;
    },

    setVerifyingForgotPasswordStatus: (state, action: PayloadAction<boolean>) => {
      state.isVerifyingForgotPassword = action.payload;
    }
  }
});

export const {
  resetToLogin,
  resetUserData,
  setVerificationEmail,
  setUserData,
  setLoginSuccess,
  setResetPasswordSuccess,
  setVerifyingAuthSuccess,
  setVerifyingForgotPasswordSuccess,
  setLoginStatus,
  setVerifyingAuthStatus,
  setResettingPasswordStatus,
  setVerifyingForgotPasswordStatus
} = authSlice.actions;

export default authSlice.reducer;