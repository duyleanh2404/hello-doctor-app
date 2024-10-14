"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useForm, SubmitHandler } from "react-hook-form";

import Link from "next/link";
import Image from "next/image";

import { cn } from "@/lib/utils";
import {
  setVerificationEmail,
  setVerifyingForgotPasswordStatus
} from "@/store/slices/auth-slice";
import { RootState } from "@/store/store";
import { resendOtp } from "@/services/auth-service";
import validateEmail from "@/utils/validate-email";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/spinner";

const ForgotPassword = () => {
  const router = useRouter();

  const dispatch = useDispatch();
  const { isVerifyingForgotPassword } = useSelector((state: RootState) => state.auth);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    register,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm<{ email: string }>();

  useEffect(() => {
    if (!isVerifyingForgotPassword) return;
    router.push("/forgot-password/verify-otp");
  }, []);

  const onSubmit: SubmitHandler<{ email: string }> = async ({ email }) => {
    setIsLoading(true);
    dispatch(setVerificationEmail(email));

    const { errorCode } = await resendOtp({ email });
    if (errorCode === "GOOGLE_LOGIN_REQUIRED") {
      setError("email", {
        type: "manual",
        message: "Email này đã được đăng ký với Google!"
      });
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    router.push("/forgot-password/verify-otp");

    dispatch(setVerifyingForgotPasswordStatus(true));
  };

  if (isLoading || isVerifyingForgotPassword) {
    return <Spinner center />;
  }

  return (
    <div className="h-screen py-24 bg-[#f7f9fc] overflow-y-auto">
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
          onSubmit={handleSubmit(onSubmit)}
          className="w-full sm:w-[550px] h-auto py-10 px-8 bg-white rounded-xl sm:rounded-md shadow-md"
        >
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-4">
              <h1 className="text-[22px] font-bold text-center">Đặt lại mật khẩu</h1>
              <p className="text-center">Vui lòng nhập email mà bạn đã đăng ký tài khoản với Hello Bacsi</p>
            </div>

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
            </div>

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

      <aside className="hidden xl:block fixed bottom-0 left-0" >
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

export default ForgotPassword;