"use client";

import dynamic from "next/dynamic";

const RegisterPage = dynamic(() => import("./register-page"), { ssr: false });

const Register = () => {
  return (
    <RegisterPage />
  );
};

export default Register;