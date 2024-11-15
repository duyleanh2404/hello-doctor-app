"use client";

import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";

import { useDispatch, useSelector } from "react-redux";
import { useForm, SubmitHandler } from "react-hook-form";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import NProgress from "nprogress";
import toast from "react-hot-toast";
import "nprogress/nprogress.css";

import {
  setVerificationEmail,
  setVerifyingAuthStatus
} from "@/store/slices/auth-slice";
import { RootState } from "@/store/store";

import { District, Province, RegisterForm } from "@/types/auth-types";
import { register } from "@/services/auth-service";
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

const ContinueWithGoogle = dynamic(() => import("@/components/continue-with-google"), { ssr: false });

const RegisterPage = () => {
  const router = useRouter();

  const dispatch = useDispatch();
  const { isVerifyingAuth } = useSelector((state: RootState) => state.auth);

  const [isLoading, setLoading] = useState<boolean>(false);
  const [isPasswordVisible, togglePasswordVisibility] = useToggle(false);

  const [selectedProvince, setSelectedProvince] = useState<Province | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);

  const {
    watch, setValue, setError, clearErrors, handleSubmit, formState: { errors }, register: registerForm
  } = useForm<RegisterForm>();

  useEffect(() => {
    NProgress.done();
    if (isVerifyingAuth) router.replace("/verify-otp");
  }, []);

  const formattedUserData = (userData: RegisterForm) => ({
    email: userData.email,
    fullname: userData.fullname,
    gender: userData.gender,
    password: userData.password,
    phoneNumber: userData.phoneNumber,
    dateOfBirth: `${userData.day}/${userData.month}/${userData.year}`,
    address: `${userData.street}, ${userData.ward}, ${userData.district}, ${userData.province}`
  });

  const handleRegister: SubmitHandler<RegisterForm> = async (userData) => {
    setLoading(true);
    dispatch(setVerificationEmail(userData.email));

    try {
      await register(formattedUserData(userData));
      redirectToOtpVerification();
    } catch (status: any) {
      handleRegisterError(status);
    }
  };

  const redirectToOtpVerification = () => {
    dispatch(setVerifyingAuthStatus(true));
    router.replace("/verify-otp");
  };

  const handleRegisterError = (status: number) => {
    setLoading(false);
    window.scrollTo({ top: 0, behavior: "smooth" });

    switch (status) {
      case 409:
        handleEmailConflictError();
        break;
      default:
        handleGeneralError();
        break;
    }
  };

  const handleEmailConflictError = () => {
    setError("email", {
      type: "manual",
      message: "Email đã được sử dụng. Vui lòng chọn email khác!"
    });
  };

  const handleGeneralError = () => {
    toast.error("Có lỗi xảy ra. Vui lòng thử lại sau ít phút nữa!");
    router.replace("/");
  };

  if (isLoading || isVerifyingAuth) {
    return <Spinner center />;
  }

  return (
    <div className="h-auto bg-[#f7f9fc] overflow-y-auto">
      <div className="sm:wrapper flex flex-col items-center gap-8 sm:gap-12 py-12">
        <Link href="/" onClick={() => NProgress.start()}>
          <Image loading="lazy" src="/logo.png" alt="Logo" width={140} height={30} />
        </Link>

        <Suspense fallback={<Spinner center />}>
          <form
            onSubmit={handleSubmit(handleRegister)}
            className="flex flex-col gap-8 w-full sm:w-[580px] h-auto py-10 px-6 sm:p-8 bg-white rounded-3xl sm:rounded-lg shadow-md"
          >
            <h1 className="text-[22px] font-bold text-center">Đăng ký tài khoản</h1>

            <div className="flex flex-col gap-2">
              <label className="text-[15px] font-medium">Email</label>
              <Input
                type="text"
                spellCheck={false}
                placeholder="Nhập email của bạn"
                {...registerForm("email", {
                  required: "Vui lòng nhập email của bạn!",
                  validate: validateEmail
                })}
                className={cn(errors.email ? "border-red-500" : "border-gray-300")}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[15px] font-medium">Tên đầy đủ</label>
              <Input
                type="text"
                spellCheck={false}
                placeholder="Nhập tên đầy đủ của bạn"
                {...registerForm("fullname", {
                  required: "Vui lòng nhập tên đầy đủ của bạn!",
                  validate: validateFullName
                })}
                className={cn(errors.fullname ? "border-red-500" : "border-gray-300")}
              />
              {errors.fullname && <p className="text-sm text-red-500">{errors.fullname.message}</p>}
            </div>

            <SelectAddress
              watch={watch}
              errors={errors}
              setValue={setValue}
              register={registerForm}
              clearErrors={clearErrors}
              selectedProvince={selectedProvince}
              selectedDistrict={selectedDistrict}
              setSelectedProvince={setSelectedProvince}
              setSelectedDistrict={setSelectedDistrict}
            />

            <div className="flex flex-col gap-2">
              <label className="text-[15px] font-medium">Ngày sinh</label>
              <SelectDateOfBirth
                errors={errors}
                setValue={setValue}
                register={registerForm}
                clearErrors={clearErrors}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[15px] font-medium">Số điện thoại</label>
              <Input
                type="text"
                spellCheck={false}
                placeholder="Nhập số điện thoại của bạn"
                {...registerForm("phoneNumber", {
                  required: "Vui lòng nhập số điện thoại của bạn!",
                  validate: validatePhoneNumber
                })}
                className={cn(errors.phoneNumber ? "border-red-500" : "border-gray-300")}
              />
              {errors.phoneNumber && <p className="text-sm text-red-500">{errors.phoneNumber.message}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[15px] font-medium">Mật khẩu</label>
              <div className="relative">
                <Input
                  placeholder="Nhập mật khẩu của bạn"
                  type={isPasswordVisible ? "text" : "password"}
                  {...registerForm("password", {
                    required: "Vui lòng nhập mật khẩu của bạn!",
                    validate: validatePassword
                  })}
                  className={cn(errors.password ? "border-red-500" : "border-gray-300")}
                />
                <Button
                  type="button"
                  variant="ghost"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 h-0 px-2 hover:bg-transparent"
                >
                  {isPasswordVisible ? <FaRegEye /> : <FaRegEyeSlash />}
                </Button>
              </div>
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[15px] font-medium">Giới tính</label>
              <div className="flex gap-8">
                {["male", "female"].map((gender) => (
                  <label key={gender} className="flex items-center gap-2">
                    <Input
                      type="radio"
                      value={gender}
                      className="w-4 h-4"
                      {...registerForm("gender", { required: "Vui lòng chọn giới tính!" })}
                    />
                    {gender === "male" ? "Nam" : "Nữ"}
                  </label>
                ))}
              </div>
              {errors.gender && <p className="text-sm text-red-500">{errors.gender.message}</p>}
            </div>

            <Button type="submit" size="xl" variant="main" disabled={isLoading}>Đăng ký</Button>
            <p className="text-center">
              Bạn đã có tài khoản? {" "}
              <Link href="/login" className="font-semibold text-primary hover:underline">Đăng nhập ngay!</Link>
            </p>
            <ContinueWithGoogle />
          </form>
        </Suspense>
      </div>
    </div>
  );
};

export default RegisterPage;