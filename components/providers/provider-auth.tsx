"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setLoginStatus } from "@/store/slices/auth-slice";

import Cookies from "js-cookie";

const ProviderAuth = ({
  children
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const accessToken = Cookies.get("access_token");
    if (accessToken) {
      dispatch(setLoginStatus(true));
    }
  }, []);

  return (
    <div>{children}</div>
  );
};

export default ProviderAuth;