"use client";

import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";

import { useDispatch, useSelector } from "react-redux";
import { useForm, SubmitHandler } from "react-hook-form";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import Cookies from "js-cookie";
import NProgress from "nprogress";
import toast from "react-hot-toast";
import "nprogress/nprogress.css";

import {
  setUserData,
  setLoginSuccess,
  setVerificationEmail,
  setVerifyingAuthStatus
} from "@/store/slices/auth-slice";
import { RootState } from "@/store/store";

import { UserData } from "@/types/user-types";
import { LoginForm } from "@/types/auth-types";

import { validateEmail } from "@/utils/validate-email";
import { login, resendOtp } from "@/services/auth-service";
import useToggle from "@/hooks/use-toggle";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Spinner from "@/components/spinner";
import ContinueWithGoogle from "@/components/continue-with-google";

const LoginPage = () => {
  const router = useRouter();

  const dispatch = useDispatch();
  const { isVerifyingAuth } = useSelector((state: RootState) => state.auth);

  const [isLoading, setLoading] = useState<boolean>(false);
  const [isPasswordVisible, togglePasswordVisibility] = useToggle(false);

  const { register, setError, handleSubmit, formState: { errors } } = useForm<LoginForm>();

  useEffect(() => {
    NProgress.done();
    if (isVerifyingAuth) router.replace("/verify-otp");
  }, []);

  const handleLogin: SubmitHandler<LoginForm> = async (userData) => {
    setLoading(true);
    dispatch(setVerificationEmail(userData.email));

    try {
      const { user, accessToken } = await login(userData);
      handleLoginSuccess(user, accessToken);
    } catch (status: any) {
      handleLoginError(status, userData);
    }
  };

  const handleLoginSuccess = (user: UserData, accessToken: string) => {
    NProgress.start();
    toast.success("Đăng nhập thành công!");
    Cookies.set("access_token", accessToken, {
      expires: 1, secure: true, sameSite: "strict"
    });
    dispatch(setUserData(user));
    dispatch(setLoginSuccess());
    router.replace("/");
  };

  const handleLoginError = async (status: number, userData: LoginForm) => {
    setLoading(false);

    switch (status) {
      case 404:
        handleEmailNotRegisteredError();
        break;
      case 409:
        handleEmailGoogleRegisteredError();
        break;
      case 400:
        handleInvalidCredentialsError();
        break;
      case 401:
        await handleOtpVerificationError(userData.email);
        break;
      default:
        handleGeneralError();
        break;
    }
  };

  const handleEmailNotRegisteredError = () => {
    setError("email", {
      type: "manual",
      message: "Email chưa được đăng ký tài khoản!"
    });
  };

  const handleEmailGoogleRegisteredError = () => {
    setError("email", {
      type: "manual",
      message: "Email này đã được đăng ký với Google. Vui lòng tiếp tục với Google!"
    });
  };

  const handleInvalidCredentialsError = () => {
    setError("email", { type: "manual" });
    setError("password", {
      type: "manual",
      message: "Email hoặc mật khẩu không chính xác!"
    });
  };

  const handleOtpVerificationError = async (email: string) => {
    await resendOtp(email);
    dispatch(setVerifyingAuthStatus(true));
    router.replace("/verify-otp");
  };

  const handleGeneralError = () => {
    toast.error("Có lỗi xảy ra. Vui lòng thử lại sau ít phút nữa!");
    router.replace("/");
  };

  if (isLoading || isVerifyingAuth) {
    return <Spinner center />;
  }

  return (
    <div className="h-screen py-10 bg-[#f7f9fc] overflow-y-auto">
      <div className="sm:wrapper flex flex-col items-center gap-8 sm:gap-12">
        <Link href="/" onClick={() => NProgress.start()}>
          <Image loading="lazy" src="/logo.png" alt="Logo" width={140} height={30} />
        </Link>

        <Suspense fallback={<Spinner center />}>
          <form
            onSubmit={handleSubmit(handleLogin)}
            className="w-full sm:w-[550px] h-auto py-10 px-6 sm:p-8 bg-white rounded-3xl sm:rounded-md shadow-md"
          >
            <div className="flex flex-col gap-10">
              <h1 className="text-[22px] font-bold text-center">Đăng nhập</h1>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[15px] font-semibold">Email</label>
                  <Input
                    type="text"
                    spellCheck={false}
                    placeholder="Nhập email của bạn"
                    {...register("email", {
                      required: "Vui lòng nhập email của bạn!",
                      validate: validateEmail
                    })}
                    className={cn(errors.email ? "border-red-500" : "border-gray-300")}
                  />
                  {errors.email && <span className="text-sm text-red-500">{errors.email.message}</span>}
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-2">
                    <label className="text-[15px] font-semibold">Mật khẩu</label>
                    <div className="relative">
                      <Input
                        spellCheck={false}
                        placeholder="Nhập mật khẩu của bạn"
                        type={isPasswordVisible ? "text" : "password"}
                        {...register("password", { required: "Vui lòng nhập mật khẩu của bạn!" })}
                        className={cn(errors.password ? "border-red-500" : "border-gray-300")}
                      />

                      <Button
                        type="button"
                        variant="ghost"
                        onClick={togglePasswordVisibility}
                        className="absolute top-1/2 right-4 -translate-y-1/2 h-0 p-0 hover:bg-transparent"
                      >
                        {isPasswordVisible ? <FaRegEye size="18" /> : <FaRegEyeSlash size="18" />}
                      </Button>
                    </div>
                    {errors.password && <span className="text-sm text-red-500">{errors.password.message}</span>}
                  </div>

                  <div className="flex items-center justify-between text-sm select-none">
                    <div className="flex items-center gap-2">
                      <Checkbox id="terms" />
                      <label htmlFor="terms" className="text-sm font-medium leading-none">Nhớ mật khẩu</label>
                    </div>
                    <Link href="/forgot-password" className="text-primary hover:font-semibold hover:underline">
                      Quên mật khẩu?
                    </Link>
                  </div>
                </div>
              </div>

              <Button type="submit" size="xl" variant="main" disabled={isLoading}>Đăng nhập</Button>
              <p className="text-[15px] font-medium text-center">hoặc đăng nhập với</p>
              <ContinueWithGoogle />

              <div className="flex items-center justify-center gap-2">
                <p>Không tìm thấy tài khoản?</p>
                <Link href="/register" className="font-semibold text-primary hover:underline">Đăng ký ngay!</Link>
              </div>
            </div>
          </form>
        </Suspense>
      </div>
    </div>
  );
};

export default LoginPage;