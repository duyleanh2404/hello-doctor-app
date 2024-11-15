"use client";

import dynamic from "next/dynamic";

const LoginPage = dynamic(() => import("./login-page"), { ssr: false });

const Login = () => {
  return (
    <LoginPage />
  );
};

export default Login;