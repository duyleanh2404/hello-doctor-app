"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { IoChevronBack } from "react-icons/io5";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

import { useDispatch, useSelector } from "react-redux";
import { useForm, SubmitHandler } from "react-hook-form";
import NProgress from "nprogress";
import toast from "react-hot-toast";
import "nprogress/nprogress.css";

import {
  resetToLogin,
  setResetPasswordSuccess
} from "@/store/slices/auth-slice";
import { RootState } from "@/store/store";

import { ResetPasswordForm } from "@/types/auth-types";
import { resetPassword } from "@/services/auth-service";
import { validatePassword } from "@/utils/validate-password";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Spinner from "@/components/spinner";

const ResetPassword = () => {
  const router = useRouter();

  const dispatch = useDispatch();
  const { verificationEmail, isResettingPassword } = useSelector((state: RootState) => state.auth);

  const [isLoading, setLoading] = useState<boolean>(false);
  const [passwordVisibility, setPasswordVisibility] = useState({ newPassword: false, confirmPassword: false });

  const { watch, register, handleSubmit, formState: { errors } } = useForm<ResetPasswordForm>();

  const newPassword = watch("newPassword");
  const confirmNewPassword = watch("confirmNewPassword");

  const passwordMatchError = (
    newPassword && confirmNewPassword && newPassword !== confirmNewPassword ? "Mật khẩu không khớp!" : undefined
  );

  if (!isResettingPassword) {
    router.replace("/login");
    return <Spinner center />;
  }

  const handleResetPassword: SubmitHandler<ResetPasswordForm> = async ({ newPassword }) => {
    setLoading(true);

    try {
      await resetPassword({ email: verificationEmail, newPassword });
      handleResetPasswordSuccess();
    } catch (error: any) {
      handleResetPasswordError();
    }
  };

  const handleResetPasswordSuccess = () => {
    NProgress.start();
    toast.success("Đặt lại mật khẩu thành công!");
    dispatch(setResetPasswordSuccess());
    router.replace("/login");
  };

  const handleResetPasswordError = () => {
    toast.error("Đặt lại mật khẩu thất bại. Vui lòng thử lại sau ít phút nữa!");
    router.replace("/");
  };

  if (isLoading) {
    return <Spinner center />;
  }

  return (
    <div className="h-screen py-20 bg-[#f7f9fc] overflow-y-auto">
      <div className="sm:wrapper flex flex-col items-center gap-12">
        <Link href="/" onClick={() => NProgress.start()}>
          <Image loading="lazy" src="/logo.png" alt="Logo" width={140} height={30} />
        </Link>

        <form
          onSubmit={handleSubmit(handleResetPassword)}
          className="w-full sm:w-[550px] h-auto p-8 bg-white rounded-xl sm:rounded-md shadow-md"
        >
          <div className="flex flex-col gap-10">
            <h1 className="text-[22px] font-bold text-center">Đặt lại mật khẩu</h1>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[15px] font-semibold">Mật khẩu mới</label>
                <div className="relative">
                  <Input
                    spellCheck={false}
                    placeholder="Nhập mật khẩu mới của bạn"
                    type={passwordVisibility.newPassword ? "text" : "password"}
                    {...register("newPassword", {
                      required: "Vui lòng nhập mật khẩu mới của bạn!",
                      validate: validatePassword
                    })}
                    className={cn(errors.newPassword ? "border-red-500" : "border-gray-300")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() =>
                      setPasswordVisibility(prev => ({ ...prev, newPassword: !prev.newPassword }))}
                    className="absolute top-1/2 right-4 -translate-y-1/2 h-0 p-0"
                  >
                    {passwordVisibility.newPassword ? <FaRegEye size="18" /> : <FaRegEyeSlash size="18" />}
                  </Button>
                </div>
                {errors.newPassword && <span className="text-sm text-red-500">{errors.newPassword.message}</span>}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[15px] font-semibold">Mật khẩu mới</label>
                <div className="relative">
                  <Input
                    spellCheck={false}
                    placeholder="Nhập mật lại khẩu mới của bạn"
                    type={passwordVisibility.confirmPassword ? "text" : "password"}
                    {...register("confirmNewPassword", {
                      required: "Vui lòng nhập lại mật khẩu mới của bạn!",
                      validate: () => passwordMatchError || true
                    })}
                    className={cn(errors.confirmNewPassword ? "border-red-500" : "border-gray-300")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setPasswordVisibility(prev => ({ ...prev, confirmPassword: !prev.confirmPassword }))}
                    className="absolute top-1/2 right-4 -translate-y-1/2 h-0 p-0"
                  >
                    {passwordVisibility.confirmPassword ? <FaRegEye size="18" /> : <FaRegEyeSlash size="18" />}
                  </Button>
                </div>
                {errors.confirmNewPassword && (
                  <span className="text-sm text-red-500">{errors.confirmNewPassword.message}</span>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <Button type="submit" size="xl" variant="main" disabled={isLoading}>Đặt lại mật khẩu</Button>
              <Button type="button" size="xl" variant="back" onClick={() => dispatch(resetToLogin())}>
                <IoChevronBack />
                <p>Quay về trang đăng nhập</p>
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;