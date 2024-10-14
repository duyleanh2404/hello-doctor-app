import {
  LoginUserData,
  VerifyOtpData,
  RegisterUserData,
  ResetPasswordData,
  LoginOrRegisterWithGoogleData
} from "@/types/auth-types";

export const loginUser = async ({ email, password }: LoginUserData) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });

  return await response.json();
};

export const registerUser = async (userData: RegisterUserData) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(userData)
  });

  return await response.json();
};

export const loginOrRegisterWithGoogle = async (userData: LoginOrRegisterWithGoogleData) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(userData)
  });

  return await response.json();
};

export const verifyOtp = async ({ email, otp }: VerifyOtpData) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, otp })
  });

  return await response.json();
};

export const resendOtp = async ({ email }: { email: string }) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/resend-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email })
  });

  return await response.json();
};

export const resetPassword = async ({ email, newPassword }: ResetPasswordData) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, newPassword })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "An error occurred while resetting the password!");
  }

  return await response.json();
};

export const getProvinces = async () => {
  const response = await fetch("https://provinces.open-api.vn/api?depth=2");
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "An error occurred while fetching provinces!");
  }

  return await response.json();
};