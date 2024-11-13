"use client";

import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

import { IoChevronBack } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useForm, SubmitHandler } from "react-hook-form";
import NProgress from "nprogress";
import toast from "react-hot-toast";
import "nprogress/nprogress.css";

import {
  setVerificationEmail,
  setVerifyingForgotPasswordStatus
} from "@/store/slices/auth-slice";
import { RootState } from "@/store/store";

import { resendOtp } from "@/services/auth-service";
import { validateEmail } from "@/utils/validate-email";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/spinner";

const ForgotPasswordPage = () => {
  const router = useRouter();
  const [isLoading, setLoading] = useState<boolean>(false);

  const dispatch = useDispatch();
  const { isResettingPassword, isVerifyingForgotPassword } = useSelector((state: RootState) => state.auth);

  const { register, setError, handleSubmit, formState: { errors } } = useForm<{ email: string }>();

  useEffect(() => {
    if (isResettingPassword) {
      router.replace("/reset-password");
    } else if (isVerifyingForgotPassword) {
      router.replace("/forgot-password/verify-otp");
    }
  }, []);

  const handleForgotPassword: SubmitHandler<{ email: string }> = async ({ email }) => {
    setLoading(true);
    dispatch(setVerificationEmail(email));

    try {
      await resendOtp(email);
      dispatch(setVerifyingForgotPasswordStatus(true));
      router.replace("/forgot-password/verify-otp");
    } catch (status: any) {
      handleError(status);
    }
  };

  const handleError = (status: number) => {
    setLoading(false);

    switch (status) {
      case 409:
        setError("email", {
          type: "manual",
          message: "Email này đã được đăng ký với Google. Vui lòng tiếp tục với Google!"
        });
        break;
      case 404:
        setError("email", {
          type: "manual",
          message: "Email chưa được đăng ký tài khoản!"
        });
        break;
      default:
        toast.error("Có lỗi xảy ra. Vui lòng thử lại sau ít phút nữa!");
        router.replace("/");
        break;
    }
  };

  if (isLoading || isResettingPassword || isVerifyingForgotPassword) {
    return <Spinner center />;
  }

  return (
    <div className="h-screen py-16 bg-[#f7f9fc] overflow-y-auto">
      <div className="sm:wrapper flex flex-col items-center gap-12">
        <Link href="/" onClick={() => NProgress.start()}>
          <Image loading="lazy" src="/logo.png" alt="Logo" width={140} height={30} />
        </Link>

        <form
          onSubmit={handleSubmit(handleForgotPassword)}
          className="w-full sm:w-[550px] h-auto flex flex-col gap-6 py-10 px-8 bg-white rounded-xl shadow-md"
        >
          <div className="flex flex-col gap-4">
            <h1 className="text-[22px] font-bold text-center">Đặt lại mật khẩu</h1>
            <p className="text-center">Vui lòng nhập email mà bạn đã đăng ký tài khoản với Hello Bacsi</p>
          </div>

          <div className="flex flex-col gap-6 mt-6">
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

            <Button type="submit" size="xl" variant="main" disabled={isLoading}>Tiếp tục</Button>
            <Button type="button" size="xl" variant="back" onClick={() => router.replace("/login")}>
              <IoChevronBack />
              <p>Quay về trang đăng nhập</p>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;