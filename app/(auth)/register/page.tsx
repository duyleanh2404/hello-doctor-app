"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, SubmitHandler } from "react-hook-form";

import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";

import Link from "next/link";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { RootState } from "@/store/store";
import { registerUser } from "@/services/auth-service";
import { RegisterFormInputs } from "@/types/auth-types";
import { setVerificationEmail, setVerifyingAuthStatus } from "@/store/slices/auth-slice";
import useToggle from "@/hooks/use-toggle";

import { validateEmail } from "@/utils/validate-email";
import { validateFullName } from "@/utils/validate-fullname";
import { validatePassword } from "@/utils/validate-password";
import { validatePhoneNumber } from "@/utils/validate-phone-number";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/spinner";
import SelectAddress from "@/components/select-address";
import SelectDateOfBirth from "@/components/select-date-of-birth";
import ContinueWithGoogle from "@/components/continue-with-google";

const RegisterPage = () => {
  const router = useRouter();

  const dispatch = useDispatch();
  const { isVerifyingAuth } = useSelector((state: RootState) => state.auth);

  const {
    watch,
    register,
    setValue,
    setError,
    clearErrors,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterFormInputs>();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPasswordVisible, togglePasswordVisibility] = useToggle(false);

  useEffect(() => {
    if (!isVerifyingAuth) return;
    router.push("/verify-otp");
  }, []);

  const handleRegister: SubmitHandler<RegisterFormInputs> = async (userData) => {
    setIsLoading(true);
    dispatch(setVerificationEmail(userData.email));

    const userDetails = {
      email: userData.email,
      gender: userData.gender,
      fullname: userData.fullname,
      password: userData.password,
      phoneNumber: userData.phoneNumber,
      dateOfBirth: `${userData.day}/${userData.month}/${userData.year}`,
      address: `${userData.street}, ${userData.ward}, ${userData.district}, ${userData.province}`
    };

    const { errorCode } = await registerUser(userDetails);
    if (errorCode === "EMAIL_ALREADY_EXISTS") {
      setError("email", {
        type: "manual",
        message: "Email đã được sử dụng. Vui lòng chọn email khác!"
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setIsLoading(false);
    router.push("/verify-otp");
    dispatch(setVerifyingAuthStatus(true));
  };

  if (isLoading || isVerifyingAuth) {
    return <Spinner center />;
  }

  return (
    <div className="h-auto bg-[#f7f9fc] overflow-y-auto">
      <div className="sm:wrapper flex flex-col items-center gap-12 py-12">
        <Link href="/">
          <Image
            loading="lazy"
            src="/logo.png"
            alt="Logo"
            width={140}
            height={30}
          />
        </Link>

        <div className="w-full sm:w-[580px] h-auto p-6 sm:p-8 bg-white rounded-xl sm:rounded-lg shadow-md">
          <form
            onSubmit={handleSubmit(handleRegister)}
            className="flex flex-col gap-8"
          >
            <h1 className="text-[22px] font-bold text-center">Đăng ký tài khoản</h1>

            <div className="flex flex-col gap-2">
              <label className="text-[15px] font-medium">Email</label>
              <Input
                type="text"
                spellCheck={false}
                placeholder="Nhập email của bạn"
                {...register("email", {
                  required: "Vui lòng nhập email của bạn!",
                  validate: validateEmail
                })}
                className={cn(
                  "placeholder:text-[#A9A9A9] p-3 border border-gray-300 rounded-md transition duration-500",
                  errors.email ? "border-[#ff4d4f]" : "focus:border-primary focus:shadow-input-primary"
                )}
              />

              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[15px] font-medium">Tên đầy đủ</label>
              <Input
                type="text"
                spellCheck={false}
                placeholder="Nhập tên đầy đủ của bạn"
                {...register("fullname", {
                  required: "Vui lòng nhập tên đầy đủ của bạn!",
                  validate: validateFullName
                })}
                className={cn(
                  "placeholder:text-[#A9A9A9] p-3 border border-gray-300 rounded-md transition duration-500",
                  errors.fullname ? "border-[#ff4d4f]" : "focus:border-primary focus:shadow-input-primary"
                )}
              />

              {errors.fullname && (
                <p className="text-sm text-red-500">{errors.fullname.message}</p>
              )}
            </div>

            <SelectAddress
              watch={watch}
              errors={errors}
              register={register}
              setValue={setValue}
              clearErrors={clearErrors}
            />

            <div className="flex flex-col gap-2">
              <label className="text-[15px] font-medium">Ngày sinh</label>
              <SelectDateOfBirth
                errors={errors}
                register={register}
                setValue={setValue}
                clearErrors={clearErrors}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[15px] font-medium">Số điện thoại</label>
              <Input
                type="text"
                spellCheck={false}
                placeholder="Nhập số điện thoại của bạn"
                {...register("phoneNumber", {
                  required: "Vui lòng nhập số điện thoại của bạn!",
                  validate: validatePhoneNumber
                })}
                className={cn(
                  "placeholder:text-[#A9A9A9] p-3 border border-gray-300 rounded-md transition duration-500",
                  errors.phoneNumber ? "border-[#ff4d4f]" : "focus:border-primary focus:shadow-input-primary"
                )}
              />

              {errors.phoneNumber && (
                <p className="text-sm text-red-500">{errors.phoneNumber.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[15px] font-medium">Mật khẩu</label>
              <div className="relative">
                <Input
                  type={isPasswordVisible ? "text" : "password"}
                  placeholder="Nhập mật khẩu của bạn"
                  {...register("password", {
                    required: "Vui lòng nhập mật khẩu của bạn!",
                    validate: validatePassword
                  })}
                  className={cn(
                    "placeholder:text-[#A9A9A9] p-3 border border-gray-300 rounded-md transition duration-500",
                    errors.password ? "border-[#ff4d4f]" : "focus:border-primary focus:shadow-input-primary"
                  )}
                />

                <Button
                  type="button"
                  variant="ghost"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 h-0 px-2 hover:bg-transparent"
                >
                  {isPasswordVisible ? (
                    <FaRegEye className="size-5" />
                  ) : (
                    <FaRegEyeSlash className="size-5" />
                  )}
                </Button>
              </div>

              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[15px] font-medium">Giới tính</label>
              <div className="flex gap-8">
                <label className="flex items-center gap-2">
                  <Input
                    type="radio"
                    value="male"
                    className="w-4 h-4"
                    {...register("gender", { required: "Vui lòng chọn giới tính!" })}
                  />
                  Nam
                </label>

                <label className="flex items-center gap-2">
                  <Input
                    type="radio"
                    value="female"
                    className="w-4 h-4"
                    {...register("gender", { required: "Vui lòng chọn giới tính!" })}
                  />
                  Nữ
                </label>
              </div>

              {errors.gender && (
                <p className="text-sm text-red-500">{errors.gender.message}</p>
              )}
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
              Đăng ký
            </Button>

            <p className="text-[15px] font-medium text-center">hoặc đăng ký với</p>

            <ContinueWithGoogle />

            <div className="flex items-center justify-center gap-2">
              <p>Đã có tài khoản?</p>
              <Link href="/login" className="font-semibold text-primary hover:underline">
                Đăng nhập ngay!
              </Link>
            </div>
          </form>
        </div>
      </div>

      <aside className="hidden xl:block fixed bottom-0 left-0" >
        <Image
          loading="lazy"
          src="/auth/aside-left.svg"
          alt="Aside Left"
          width={320}
          height={258}
        />
      </aside >

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

export default RegisterPage;