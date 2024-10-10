"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { resendOtp, verifyOtp as verifyOtpService } from "@/services/auth-service";

import {
  InputOTP,
  InputOTPSlot,
  InputOTPGroup
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";

import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import Spinner from "@/components/spinner";

const VerifyOtp = ({ route }: { route: string }) => {
  const router = useRouter();
  const { emailValue } = useSelector((state: RootState) => state.auth);

  const [otpValue, setOtpValue] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [resendTimer, setResendTimer] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [resendDisabled, setResendDisabled] = useState<boolean>(false);

  // Handle resend OTP with timer
  const handleResendOtp = async () => {
    // Start countdown
    setResendTimer(60);  // Set the timer to 60 seconds
    setResendDisabled(true);

    await resendOtp({ email: emailValue });
  };

  // Countdown logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setResendDisabled(false); // Enable the resend button after countdown
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    event.preventDefault();

    // Check if the OTP (One Time Password) is exactly 6 characters long
    if (otpValue.length !== 6) {
      setIsLoading(false);
      setErrorMessage("Vui lòng nhập đầy đủ mã xác thực!");
      return;
    }

    // Call the OTP verification service with the provided email and OTP
    const { statusCode } = await verifyOtpService({ email: emailValue, otp: otpValue });
    if (statusCode === 400) {
      setIsLoading(false);
      setErrorMessage("Mã xác thực không chính xác!");
      return;
    }

    setIsLoading(false);
    setErrorMessage("");
    router.push(route ? route : "/login");
    toast.success("Xác thực tài khoản thành công!");
  };

  // If the registration process is loading, show the loading spinner
  if (isLoading) {
    return (
      <Spinner />
    );
  }

  return (
    <div className="h-screen bg-[#f7f9fc] overflow-y-auto flex flex-col justify-between">
      {/* Main container for the registration form */}
      <div className="sm:wrapper flex flex-col items-center gap-12 py-12">
        {/* Logo linking to the home page */}
        <Link href="/">
          <Image
            loading="lazy"
            src="/logo.png"
            alt="Logo"
            width={140}
            height={30}
          />
        </Link>

        {/* Form verify OTP */}
        <form
          onSubmit={handleSubmit}
          className="w-full sm:w-[550px] flex flex-col gap-12 p-6 sm:py-12 sm:px-8 bg-white rounded-xl sm:rounded-lg shadow-md"
        >
          {/* Title of the form */}
          <div className="flex flex-col gap-4">
            <h1 className="text-[22px] font-bold text-center">Xác thực tài khoản của bạn</h1>
            <p className="text-base font-medium text-center">
              Chúng tôi đã gửi mã xác thực đến email của bạn: <strong>duyleanh2404@gmail.com</strong>
            </p>
          </div>

          {/* OTP input field */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-center">
                <InputOTP
                  autoFocus
                  maxLength={6}
                  value={otpValue}
                  aria-label="Nhập mã OTP"
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

              {/* Error message for OTP input */}
              {errorMessage && (
                <span className="text-[15px] text-red-500 text-center">{errorMessage}</span>
              )}
            </div>

            <div className="flex flex-col items-center gap-10">
              {/* Submit button for the form */}
              <Button
                type="submit"
                variant="default"
                disabled={isLoading}
                className={cn(
                  "w-full h-14 text-[17px] font-semibold text-white py-4 bg-primary hover:bg-[#2c74df] rounded-md shadow-md transition duration-500 select-none",
                  isLoading && "opacity-50 cursor-not-allowed"
                )}
              >
                Xác thực
              </Button>

              {/* Resend verify button for the form */}
              <Button
                type="button"
                variant="ghost"
                onClick={handleResendOtp}
                disabled={resendDisabled}
                className="w-full h-0 text-[17px] font-medium text-black hover:text-primary hover:bg-transparent shadow-none transition duration-500"
              >
                {resendDisabled
                  ? (
                    <p>
                      Gửi lại mã xác thực sau {""}
                      <span className="text-red-500">{resendTimer}</span> giây
                    </p>
                  )
                  : "Gửi lại mã xác thực"}
              </Button>
            </div>
          </div>
        </form>
      </div>

      {/* Aside images for visual appeal, hidden on smaller screens */}
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

export default VerifyOtp;