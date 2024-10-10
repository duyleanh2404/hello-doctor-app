"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setEmailValue } from "@/store/slices/auth-slice";
import { useForm, SubmitHandler } from "react-hook-form";
import { resendOtp as resendOtpService } from "@/services/auth-service";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import Link from "next/link";
import Image from "next/image";
import Spinner from "@/components/spinner";
import VerifyOtp from "../verify-otp/page";
import validateEmail from "@/utils/validate-email";

const ForgotPassword = () => {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isVerifyOtpMode, setIsVerifyOtpMode] = useState<boolean>(false);

  const {
    register,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm<{ email: string }>();

  // Handle form submission
  const onSubmit: SubmitHandler<{ email: string }> = async (userData) => {
    setIsLoading(true);
    dispatch(setEmailValue(userData.email));

    // Send OTP to the user's email
    const { errorCode } = await resendOtpService({ email: userData.email });

    // Check if the error code indicates that the email is registered with Google
    if (errorCode === "GOOGLE_LOGIN_REQUIRED") {
      // Set an error message for the email field in the form
      setError("email", {
        type: "manual",
        message: "Email này đã được đăng ký với Google!"
      });
      setIsLoading(false);
      return;
    }

    setIsVerifyOtpMode(true);
    setIsLoading(false);
  };

  // If the registration process is loading, show the loading spinner
  if (isLoading) {
    return (
      <Spinner />
    );
  }

  return (
    isVerifyOtpMode ? (
      // Form verify OTP
      <VerifyOtp route="/reset-password" />
    ) : (
      <div className="h-screen py-24 bg-[#f7f9fc] overflow-y-auto">
        <div className="sm:wrapper flex flex-col items-center gap-12">
          {/* Logo link to home */}
          <Link href="/">
            <Image
              loading="lazy"
              src="/logo.png"
              alt="Logo"
              width={140}
              height={30}
            />
          </Link>

          {/* Login form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full sm:w-[550px] h-auto py-10 px-8 bg-white rounded-xl sm:rounded-md shadow-md"
          >
            <div className="flex flex-col gap-10">
              {/* Form title */}
              <div className="flex flex-col gap-4">
                <h1 className="text-[22px] font-bold text-center">Đặt lại mật khẩu</h1>
                <p className="text-center">Vui lòng nhập email mà bạn đã đăng ký tài khoản với Hello Bacsi</p>
              </div>

              {/* Forgot password form */}
              <div className="flex flex-col gap-6">
                {/* Email input field */}
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
              </div>

              {/* Submit button */}
              <Button
                type="submit"
                variant="default"
                disabled={isLoading}
                className={cn(
                  "h-14 text-[17px] font-semibold text-white py-4 bg-primary hover:bg-[#2c74df] rounded-md shadow-md transition duration-500 select-none",
                  isLoading && "opacity-50 cursor-not-allowed"
                )}
              >
                Tiếp tục
              </Button>
            </div>
          </form>
        </div>

        {/* Decorative aside images */}
        < aside className="hidden xl:block fixed bottom-0 left-0" >
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
    )
  );
};

export default ForgotPassword;