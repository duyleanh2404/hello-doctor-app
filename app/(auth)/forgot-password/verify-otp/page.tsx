"use client";

import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";

import { IoChevronBack } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import NProgress from "nprogress";
import toast from "react-hot-toast";
import "nprogress/nprogress.css";

import {
  resetToLogin,
  setVerifyingForgotPasswordSuccess
} from "@/store/slices/auth-slice";
import { RootState } from "@/store/store";

import { resendOtp, verifyOtp } from "@/services/auth-service";
import useTimer from "@/hooks/use-timer";

import {
  InputOTP,
  InputOTPSlot,
  InputOTPGroup
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/spinner";

const VerifyOtpPage = () => {
  const router = useRouter();

  const dispatch = useDispatch();
  const { verificationEmail, isVerifyingForgotPassword } = useSelector((state: RootState) => state.auth);

  const { isDisabled, timeLeft, resetTimer } = useTimer(60);
  const [isLoading, setLoading] = useState<boolean>(false);

  const [otp, setOtp] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  if (!isVerifyingForgotPassword) {
    router.replace("/reset-password");
    return <Spinner center />;
  }

  const handleResendOtp = async () => {
    resetTimer(60);
    await resendOtp(verificationEmail);
  };

  const handleVerifyOtp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");

    if (otp.length !== 6) {
      setLoading(false);
      setErrorMessage("Vui lòng nhập đầy đủ mã xác thực!");
      return;
    }

    try {
      await verifyOtp({ email: verificationEmail, otp });
      toast.success("Xác thực tài khoản thành công!");
      dispatch(setVerifyingForgotPasswordSuccess());
      router.replace("/reset-password");
    } catch (status: any) {
      handleVerifyOtpError(status);
    }
  };

  const handleVerifyOtpError = (status: number) => {
    setLoading(false);

    switch (status) {
      case 401:
        handleInvalidOtpError();
        break;
      case 400:
        handleExpiredOtpError();
        break;
      default:
        handleGeneralError();
        break;
    }
  };

  const handleInvalidOtpError = () => {
    setErrorMessage("Mã xác thực không chính xác!");
  };

  const handleExpiredOtpError = () => {
    setErrorMessage("Mã xác thực đã hết hạn. Vui lòng chọn gửi lại mã xác thực!");
  };

  const handleGeneralError = () => {
    toast.error("Có lỗi xảy ra. Vui lòng thử lại sau ít phút nữa!");
    router.replace("/");
  };

  if (isLoading) {
    return <Spinner center />;
  }

  return (
    <div className="h-screen flex flex-col justify-between bg-[#f7f9fc] overflow-y-auto">
      <div className="sm:wrapper flex flex-col items-center gap-12 py-12">
        <Link href="/" onClick={() => NProgress.start()}>
          <Image loading="lazy" src="/logo.png" alt="Logo" width={140} height={30} />
        </Link>

        <form
          onSubmit={handleVerifyOtp}
          className="w-full sm:w-[550px] flex flex-col gap-12 p-6 sm:py-12 sm:px-8 bg-white rounded-xl shadow-md"
        >
          <div className="flex flex-col gap-4 text-center">
            <h1 className="text-[22px] font-bold">Xác thực tài khoản của bạn</h1>
            <p className="text-base font-medium">
              Chúng tôi đã gửi mã xác thực đến email của bạn: <strong>{verificationEmail}</strong>
            </p>
          </div>

          <div className="flex flex-col gap-6">
            <InputOTP autoFocus maxLength={6} value={otp} onChange={setOtp}>
              <InputOTPGroup>
                {Array.from({ length: 6 }).map((_, index) => <InputOTPSlot key={index} index={index} />)}
              </InputOTPGroup>
            </InputOTP>

            {errorMessage && <span className="text-[15px] text-red-500 text-center">{errorMessage}</span>}

            <div className="flex flex-col gap-10">
              <Button type="submit" size="xl" variant="main" disabled={isLoading}>Xác thực</Button>
              <Button type="button" size="xl" variant="back" onClick={() => dispatch(resetToLogin())}>
                <IoChevronBack />
                Quay về trang đăng nhập
              </Button>
            </div>

            <Button
              type="button"
              variant="ghost"
              disabled={isDisabled}
              onClick={handleResendOtp}
              className="w-full text-[17px] font-medium text-black hover:text-primary hover:bg-transparent transition duration-500"
            >
              {isDisabled ? (
                <p>Gửi lại mã xác thực sau <span className="text-red-500">{timeLeft}</span> giây</p>
              ) : (
                <p>Gửi lại mã xác thực?</p>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtpPage;