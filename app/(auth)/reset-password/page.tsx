"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { resetPassword as resetPasswordService } from "@/services/auth-service";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import Spinner from "@/components/spinner";
import validatePassword from "@/utils/validate-password";

interface ResetPasswordInputs {
  newPassword: string;
  confirmNewPassword: string;
};

const ResetPassword = () => {
  const router = useRouter();
  const { emailValue } = useSelector((state: RootState) => state.auth);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const {
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInputs>();

  const newPassword = watch("newPassword"); // Monitor new password value
  const confirmNewPassword = watch("confirmNewPassword"); // Monitor password confirmation value

  // Check password matches
  const passwordMatchError = newPassword && confirmNewPassword && newPassword !== confirmNewPassword
    ? "Mật khẩu không khớp"
    : undefined;

  // Toggle new password visibility
  const toggleNewPasswordVisibility = () => {
    setShowNewPassword((prev) => !prev);
  };

  // Toggle confirm password visibility
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  // Handle form submission
  const onSubmit: SubmitHandler<ResetPasswordInputs> = async (userData) => {
    setIsLoading(true);

    // Call the resetPasswordService to reset the password
    await resetPasswordService({
      email: emailValue, // User's email value
      newPassword: userData.newPassword // New password from the form
    });

    router.push("/login");
    toast.success("Đặt lại mật khẩu thành công!");
    setIsLoading(false);
  };

  // If the registration process is loading, show the loading spinner
  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="h-screen py-20 bg-[#f7f9fc] overflow-y-auto">
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

        {/* Reset password form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full sm:w-[550px] h-auto p-8 bg-white rounded-xl sm:rounded-md shadow-md"
        >
          <div className="flex flex-col gap-10">
            {/* Form title */}
            <h1 className="text-[22px] font-bold text-center">Đặt lại mật khẩu</h1>

            <div className="flex flex-col gap-6">
              {/* New password input field */}
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

                    {/* Password visibility toggle button */}
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={toggleNewPasswordVisibility}
                      aria-label={showNewPassword ? "Hide password" : "Show password"}
                      className="absolute top-1/2 right-4 -translate-y-1/2 h-0 p-0 hover:bg-transparent"
                    >
                      {showNewPassword ? (
                        <FaRegEye size="18" /> // Eye icon when password is visible
                      ) : (
                        <FaRegEyeSlash size="18" /> // Eye slash icon when password is hidden
                      )}
                    </Button>
                  </div>

                  {errors.newPassword && (
                    <span className="text-sm text-red-500">{errors.newPassword.message}</span>
                  )}
                </div>
              </div>

              {/* Confirm new password input field */}
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
                        validate: () => passwordMatchError || true // Check password matches
                      })}
                      className={cn(
                        "w-full placeholder:text-[#A9A9A9] p-3 border focus:border-primary focus:shadow-input-primary rounded-md transition duration-500",
                        errors.confirmNewPassword ? "border-red-500" : "border-gray-300"
                      )}
                    />

                    {/* Password visibility toggle button */}
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={toggleConfirmPasswordVisibility}
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      className="absolute top-1/2 right-4 -translate-y-1/2 h-0 p-0 hover:bg-transparent"
                    >
                      {showConfirmPassword ? (
                        <FaRegEye size="18" /> // Eye icon when password is visible
                      ) : (
                        <FaRegEyeSlash size="18" /> // Eye slash icon when password is hidden
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

            {/* Submit button */}
            <Button
              type="submit"
              variant="default"
              disabled={isLoading}
              className={cn(
                "w-full h-14 text-[17px] font-semibold text-white py-4 bg-primary hover:bg-[#2c74df] rounded-md shadow-md transition duration-500 select-none",
                isLoading && "opacity-50 cursor-not-allowed"
              )}
            >
              Đặt lại mật khẩu
            </Button>
          </div>
        </form>
      </div>

      {/* Decorative aside images */}
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

export default ResetPassword;