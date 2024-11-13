import {
  LoginData,
  RegisterData,
  VerifyOtpData,
  ResetPasswordData,
  ContinueWithGoogleData
} from "@/types/auth-types";
import { handleResponse } from "@/utils/handle-response";

export const login = async (userData: LoginData) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData)
  });

  const responseData = await response.json();
  if (!response.ok) {
    throw responseData.statusCode;
  }

  return responseData;
};

export const register = async (userData: RegisterData) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData)
  });

  const responseData = await response.json();
  if (!response.ok) {
    throw responseData.statusCode;
  }

  return responseData;
};

export const getGoogleInfo = async (accessToken: string) => {
  const response = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  return handleResponse(response);
};

export const continueWithGoogle = async (userData: ContinueWithGoogleData) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData)
  });

  return handleResponse(response);
};

export const resetPassword = async (userData: ResetPasswordData) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData)
  });

  return handleResponse(response);
};

export const resendOtp = async (email: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/resend-otp?email=${email}`, {
    method: "POST"
  });

  const responseData = await response.json();
  if (!response.ok) {
    throw responseData.statusCode;
  }

  return responseData;
};

export const verifyOtp = async (userData: VerifyOtpData) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData)
  });

  const responseData = await response.json();
  if (!response.ok) {
    throw responseData.statusCode;
  }

  return responseData;
};

export const getWards = async (districtId: string) => {
  const response = await fetch(`https://open.oapi.vn/location/wards/${districtId}?size=100`);
  return handleResponse(response);
};

export const getDisctricts = async (provinceId: string) => {
  const response = await fetch(`https://open.oapi.vn/location/districts/${provinceId}?size=100`);
  return handleResponse(response);
};

export const getProvinces = async () => {
  const response = await fetch("https://open.oapi.vn/location/provinces?size=100");
  return handleResponse(response);
};