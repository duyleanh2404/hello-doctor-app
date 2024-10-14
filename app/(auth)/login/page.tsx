"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, SubmitHandler } from "react-hook-form";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

import Link from "next/link";
import Image from "next/image";

import { cn } from "@/lib/utils";
import {
  setLoginStatus,
  setVerifyingAuthStatus,
  setVerificationEmail
} from "@/store/slices/auth-slice";
import { RootState } from "@/store/store";
import { loginUser, resendOtp } from "@/services/auth-service";
import useToggle from "@/hooks/use-toggle";
import validateEmail from "@/utils/validate-email";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Spinner from "@/components/spinner";
import ContinueWithGoogle from "@/components/continue-with-google";

interface LoginFormInputs {
  email: string;
  password: string;
};

const LoginPage = () => {
  const router = useRouter();

  const dispatch = useDispatch();
  const { isVerifyingAuth } = useSelector((state: RootState) => state.auth);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPasswordVisible, togglePasswordVisibility] = useToggle(false);

  const {
    register,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormInputs>();

  useEffect(() => {
    if (!isVerifyingAuth) return;
    router.push("/verify-otp");
  }, []);

  const handleLogin: SubmitHandler<LoginFormInputs> = async ({ email, password }) => {
    setIsLoading(true);
    dispatch(setVerificationEmail(email));

    const { errorCode, accessToken } = await loginUser({ email, password });

    if (errorCode === "EMAIL_NOT_VERIFIED") {
      setIsLoading(false);
      dispatch(setVerifyingAuthStatus(true));

      router.push("/verify-otp");
      await resendOtp({ email });

      return;
    }

    if (errorCode === "GOOGLE_LOGIN_REQUIRED") {
      setIsLoading(false);
      setError("email", {
        type: "manual",
        message: "Email này đã được đăng ký với Google!"
      });
      return;
    }

    if (errorCode === "USER_NOT_FOUND" || errorCode === "INVALID_PASSWORD") {
      setIsLoading(false);
      setError("password", {
        type: "manual",
        message: "Email hoặc mật khẩu không chính xác!"
      });
      return;
    }

    router.push("/");
    setIsLoading(false);
    dispatch(setLoginStatus(true));
    toast.success("Đăng nhập thành công");
    Cookies.set("access_token", accessToken, {
      secure: true,
      sameSite: "strict",
      expires: 1
    });
  };

  if (isLoading || isVerifyingAuth) {
    return <Spinner center />;
  }

  return (
    <div className="h-screen py-10 bg-[#f7f9fc] overflow-y-auto">
      <div className="sm:wrapper flex flex-col items-center gap-12">
        <Link href="/">
          <Image
            loading="lazy"
            src="/logo.png"
            alt="Logo"
            width={140}
            height={30}
          />
        </Link>

        <form
          onSubmit={handleSubmit(handleLogin)}
          className="w-full sm:w-[550px] h-auto p-8 bg-white rounded-xl sm:rounded-md shadow-md"
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
                  className={cn(
                    "placeholder:text-[#A9A9A9] p-3 border focus:border-primary focus:shadow-input-primary rounded-md transition duration-500",
                    errors.email ? "border-red-500" : "border-gray-300"
                  )}
                />

                {errors.email && (
                  <span className="text-sm text-red-500">{errors.email.message}</span>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                  <label className="text-[15px] font-semibold">Mật khẩu</label>
                  <div className="relative">
                    <Input
                      type={isPasswordVisible ? "text" : "password"}
                      spellCheck={false}
                      placeholder="Nhập mật khẩu của bạn"
                      {...register("password", { required: "Vui lòng nhập mật khẩu của bạn!" })}
                      className={cn(
                        "w-full placeholder:text-[#A9A9A9] p-3 border focus:border-primary focus:shadow-input-primary rounded-md transition duration-500",
                        errors.password ? "border-red-500" : "border-gray-300"
                      )}
                    />

                    <Button
                      type="button"
                      variant="ghost"
                      onClick={togglePasswordVisibility}
                      className="absolute top-1/2 right-4 -translate-y-1/2 h-0 p-0 hover:bg-transparent"
                    >
                      {isPasswordVisible ? (
                        <FaRegEye size="18" />
                      ) : (
                        <FaRegEyeSlash size="18" />
                      )}
                    </Button>
                  </div>

                  {errors.password && (
                    <span className="text-sm text-red-500">{errors.password.message}</span>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm select-none">
                  <div className="flex items-center gap-2">
                    <Checkbox id="terms" />
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Nhớ mật khẩu
                    </label>
                  </div>

                  <Link
                    href="/forgot-password"
                    className="text-primary hover:font-semibold hover:underline"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              variant="default"
              disabled={isLoading}
              className={cn(
                "h-14 text-lg font-medium text-white py-4 bg-primary hover:bg-[#2c74df] rounded-md shadow-md transition duration-500 select-none",
                isLoading && "opacity-50 cursor-not-allowed"
              )}
            >
              Đăng nhập
            </Button>

            <p className="text-[15px] font-medium text-center">hoặc đăng nhập với</p>

            <ContinueWithGoogle />

            <div className="flex items-center justify-center gap-2">
              <p>Chưa có tài khoản?</p>
              <Link href="/register" className="font-semibold text-primary hover:underline">
                Đăng ký ngay!
              </Link>
            </div>
          </div>
        </form>
      </div>

      <aside className="hidden xl:block fixed bottom-0 left-0">
        <Image
          loading="lazy"
          src="/auth/aside-left.svg"
          alt="Aside Left"
          width={320}
          height={258}
        />
      </aside>

      <aside className="hidden xl:block fixed bottom-0 right-5">
        <Image
          loading="lazy"
          src="/auth/aside-right.svg"
          alt="Aside Right"
          width={320}
          height={258}
        />
      </aside>
    </div>
  );
};

export default LoginPage;