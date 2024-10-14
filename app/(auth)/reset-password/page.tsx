"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, SubmitHandler } from "react-hook-form";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import toast from "react-hot-toast";

import Link from "next/link";
import Image from "next/image";

import { cn } from "@/lib/utils";
import {
  setVerificationEmail,
  setResettingPasswordStatus
} from "@/store/slices/auth-slice";
import { RootState } from "@/store/store";
import { resetPassword } from "@/services/auth-service";
import useToggle from "@/hooks/use-toggle";
import validatePassword from "@/utils/validate-password";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/spinner";
import ProtectRoute from "./protect-route";

interface ResetPasswordInputs {
  newPassword: string;
  confirmNewPassword: string;
};

const ResetPassword = () => {
  const router = useRouter();

  const dispatch = useDispatch();
  const { verificationEmail, isResettingPassword } = useSelector((state: RootState) => state.auth);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showNewPassword, toggleNewPasswordVisibility] = useToggle(false);
  const [showConfirmPassword, toggleConfirmPasswordVisibility] = useToggle(false);

  const {
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInputs>();

  const newPassword = watch("newPassword");
  const confirmNewPassword = watch("confirmNewPassword");

  const passwordMatchError =
    newPassword && confirmNewPassword && newPassword !== confirmNewPassword
      ? "Mật khẩu không khớp!"
      : undefined;

  useEffect(() => {
    if (isResettingPassword) return;
    router.push("/login");
  }, [isResettingPassword]);


  const handleResetPassword: SubmitHandler<ResetPasswordInputs> = async ({ newPassword }) => {
    try {
      setIsLoading(true);

      await resetPassword({
        email: verificationEmail,
        newPassword: newPassword
      });

      setIsLoading(false);
      toast.success("Đặt lại mật khẩu thành công!");

      dispatch(setVerificationEmail(""));
      dispatch(setResettingPasswordStatus(false));
    } catch (err: any) {
      router.push("/");
      toast.error("Có lỗi xảy ra. Vui lòng thử lại sau ít phút nữa!");
    }
  };

  if (isLoading) {
    return <Spinner center />;
  }

  return (
    <ProtectRoute>
      <div className="h-screen py-20 bg-[#f7f9fc] overflow-y-auto">
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
            onSubmit={handleSubmit(handleResetPassword)}
            className="w-full sm:w-[550px] h-auto p-8 bg-white rounded-xl sm:rounded-md shadow-md"
          >
            <div className="flex flex-col gap-10">
              <h1 className="text-[22px] font-bold text-center">Đặt lại mật khẩu</h1>

              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-2">
                    <label className="text-[15px] font-semibold">Mật khẩu mới</label>
                    <div className="relative">
                      <Input
                        type={showNewPassword ? "text" : "password"}
                        spellCheck={false}
                        placeholder="Nhập mật khẩu mới của bạn"
                        {...register("newPassword", {
                          required: "Vui lòng nhập mật khẩu mới của bạn!",
                          validate: validatePassword
                        })}
                        className={cn(
                          "w-full placeholder:text-[#A9A9A9] p-3 border focus:border-primary focus:shadow-input-primary rounded-md transition duration-500",
                          errors.newPassword ? "border-red-500" : "border-gray-300"
                        )}
                      />

                      <Button
                        type="button"
                        variant="ghost"
                        onClick={toggleNewPasswordVisibility}
                        className="absolute top-1/2 right-4 -translate-y-1/2 h-0 p-0 hover:bg-transparent"
                      >
                        {showNewPassword ? (
                          <FaRegEye size="18" />
                        ) : (
                          <FaRegEyeSlash size="18" />
                        )}
                      </Button>
                    </div>

                    {errors.newPassword && (
                      <span className="text-sm text-red-500">{errors.newPassword.message}</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-2">
                    <label className="text-[15px] font-semibold">Nhập lại mật khẩu mới</label>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        spellCheck={false}
                        placeholder="Nhập lại mật khẩu mới của bạn"
                        {...register("confirmNewPassword", {
                          required: "Vui lòng nhập lại mật khẩu mới của bạn!",
                          validate: () => passwordMatchError || true
                        })}
                        className={cn(
                          "w-full placeholder:text-[#A9A9A9] p-3 border focus:border-primary focus:shadow-input-primary rounded-md transition duration-500",
                          errors.confirmNewPassword ? "border-red-500" : "border-gray-300"
                        )}
                      />

                      <Button
                        type="button"
                        variant="ghost"
                        onClick={toggleConfirmPasswordVisibility}
                        className="absolute top-1/2 right-4 -translate-y-1/2 h-0 p-0 hover:bg-transparent"
                      >
                        {showConfirmPassword ? (
                          <FaRegEye size="18" />
                        ) : (
                          <FaRegEyeSlash size="18" />
                        )}
                      </Button>
                    </div>

                    {errors.confirmNewPassword && (
                      <span className="text-sm text-red-500">
                        {errors.confirmNewPassword.message || passwordMatchError}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                variant="default"
                disabled={isLoading}
                className={cn(
                  "w-full h-14 text-lg font-medium text-white py-4 bg-primary hover:bg-[#2c74df] rounded-md shadow-md transition duration-500 select-none",
                  isLoading && "opacity-50 cursor-not-allowed"
                )}
              >
                Đặt lại mật khẩu
              </Button>
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
    </ProtectRoute>
  );
};

export default ResetPassword;