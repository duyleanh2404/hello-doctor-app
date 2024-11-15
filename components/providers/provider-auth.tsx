"use client";

import { useEffect } from "react";

import { useDispatch } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Cookies from "js-cookie";

import { setLoginStatus } from "@/store/slices/auth-slice";

const ProviderAuth = ({ children }: Readonly<{ children: React.ReactNode; }>) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const accessToken = Cookies.get("access_token");
    if (!accessToken) return;
    dispatch(setLoginStatus(true));
  }, []);

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      {children}
    </GoogleOAuthProvider>
  );
};

export default ProviderAuth;