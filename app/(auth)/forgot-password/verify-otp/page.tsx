"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { IoChevronBack } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import Link from "next/link";
import Image from "next/image";

import { cn } from "@/lib/utils";
import {
  setVerificationEmail,
  setResettingPasswordStatus,
  setVerifyingForgotPasswordStatus
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
import ProtectRoute from "./protect-route";

const VerifyOtp = () => {
  const router = useRouter();

  const dispatch = useDispatch();
  const { verificationEmail, isVerifyingForgotPassword } = useSelector((state: RootState) => state.auth);

  const [otpValue, setOtpValue] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { timeLeft, isDisabled, resetTimer } = useTimer(0);

  useEffect(() => {
    if (isVerifyingForgotPassword) return;
    router.push("/reset-password");
  }, [isVerifyingForgotPassword]);

  const handleResendOtp = async () => {
    resetTimer(60);
    await resendOtp({ email: verificationEmail });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    event.preventDefault();

    if (otpValue.length !== 6) {
      setIsLoading(false);
      setErrorMessage("Vui lòng nhập đầy đủ mã xác thực!");
      return;
    }

    const { errorCode } = await verifyOtp({ email: verificationEmail, otp: otpValue });
    if (errorCode === "INVALID_OTP") {
      setIsLoading(false);
      setErrorMessage("Mã xác thực không chính xác!");
      return;
    }

    setIsLoading(false);
    setErrorMessage("");

    dispatch(setResettingPasswordStatus(true));
    dispatch(setVerifyingForgotPasswordStatus(false));
    toast.success("Xác thực tài khoản thành công!");
  };

  if (isLoading) {
    return <Spinner center />;
  }

  return (
    <ProtectRoute>
      <div className="h-screen bg-[#f7f9fc] overflow-y-auto flex flex-col justify-between">
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

          <form
            onSubmit={handleSubmit}
            className="w-full sm:w-[550px] flex flex-col gap-12 p-6 sm:py-12 sm:px-8 bg-white rounded-xl sm:rounded-lg shadow-md"
          >
            <div className="flex flex-col gap-4">
              <h1 className="text-[22px] font-bold text-center">Xác thực tài khoản của bạn</h1>
              <p className="text-base font-medium text-center leading-7">
                Chúng tôi đã gửi mã xác thực đến email của bạn: <strong>{verificationEmail}</strong>
              </p>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-center">
                  <InputOTP
                    autoFocus
                    maxLength={6}
                    value={otpValue}
                    onChange={(value) => setOtpValue(value)}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                {errorMessage && (
                  <span className="text-[15px] text-red-500 text-center">{errorMessage}</span>
                )}
              </div>

              <div className="flex flex-col items-center gap-10">
                <div className="w-full flex flex-col gap-4">
                  <Button
                    type="submit"
                    variant="default"
                    disabled={isLoading}
                    className={cn(
                      "w-full h-14 text-lg font-medium text-white py-4 bg-primary hover:bg-[#2c74df] rounded-md shadow-md transition duration-500 select-none",
                      isLoading && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    Xác thực
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      dispatch(setVerificationEmail(""));
                      dispatch(setVerifyingForgotPasswordStatus(false));
                    }}
                    className="w-full h-16 flex items-center gap-3 text-lg font-medium py-4 border border-gray-300 rounded-md shadow-md transition duration-500 select-none"
                  >
                    <IoChevronBack />
                    <p>Quay về trang đăng nhập</p>
                  </Button>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleResendOtp}
                  disabled={isDisabled}
                  className="w-full h-0 text-[17px] font-medium text-black hover:text-primary hover:bg-transparent shadow-none transition duration-500"
                >
                  {isDisabled ? (
                    <p>
                      Gửi lại mã xác thực sau {""}
                      <span className="text-red-500">{timeLeft}</span> giây
                    </p>
                  ) : (
                    <p>Gửi lại mã xác thực</p>
                  )}
                </Button>
              </div>
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
    </ProtectRoute>
  );
};

export default VerifyOtp;