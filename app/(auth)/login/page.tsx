"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

import Link from "next/link";
import Image from "next/image";

import validateEmail from "@/utils/validate-email";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface LoginFormInputs {
  email: string;
  password: string;
};

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormInputs>();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmit: SubmitHandler<LoginFormInputs> = (userData) => {
    console.log(userData);
  };

  return (
    <div className="h-screen bg-[#f7f9fc] overflow-y-auto py-10">
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
          className="w-full sm:w-[550px] h-auto bg-white p-8 rounded-xl sm:rounded-md shadow-md"
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
                    "p-3 placeholder:text-[#A9A9A9] border focus:border-primary focus:shadow-input-primary rounded-md transition duration-500",
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
                      type={showPassword ? "text" : "password"}
                      spellCheck={false}
                      placeholder="Nhập mật khẩu của bạn"
                      {...register("password", { required: "Vui lòng nhập mật khẩu của bạn!" })}
                      className={cn(
                        "w-full p-3 placeholder:text-[#A9A9A9] border focus:border-primary focus:shadow-input-primary rounded-md transition duration-500",
                        errors.password ? "border-red-500" : "border-gray-300"
                      )}
                    />

                    <Button
                      type="button"
                      variant="ghost"
                      className="absolute top-1/2 right-4 -translate-y-1/2 h-0 p-0 hover:bg-transparent"
                      onClick={togglePasswordVisibility}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <FaRegEye size="18" /> : <FaRegEyeSlash size="18" />}
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
                    href="/"
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
              className="h-14 relative text-[17px] font-semibold text-white py-4 rounded-md shadow-md bg-primary hover:bg-[#2c74df] transition duration-500"
            >
              Đăng nhập
            </Button>

            <p className="text-[15px] font-medium text-center">hoặc đăng nhập với</p>

            <Button
              variant="outline"
              className="h-14 flex items-center justify-center gap-4 py-4 px-4 border border-[#ccc] rounded-md transition duration-500"
            >
              <Image
                loading="lazy"
                src="/auth/google.svg"
                alt="Google"
                width="22"
                height="22"
              />
              <p className="text-[17px] font-medium text-center">Tiếp tục với Google</p>
            </Button>

            <div className="flex items-center justify-center gap-1">
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
          alt="Aside"
          width="320"
          height="258"
        />
      </aside>

      <aside className="hidden xl:block fixed bottom-0 right-5">
        <Image
          loading="lazy"
          src="/auth/aside-right.svg"
          alt="Aside"
          width="320"
          height="258"
        />
      </aside>
    </div>
  );
};

export default LoginPage;