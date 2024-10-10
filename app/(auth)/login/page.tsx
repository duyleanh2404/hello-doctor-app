"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { Client, Account, OAuthProvider } from "appwrite";
import {
  login as loginService,
  resendOtp as resendOtpService,
  loginOrRegisterWithGoogle as loginOrRegisterWithGoogleService
} from "@/services/auth-service";

import { useDispatch } from "react-redux";
import { setEmailValue, setLoginStatus } from "@/store/slices/auth-slice";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import Link from "next/link";
import Image from "next/image";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import Spinner from "@/components/spinner";
import validateEmail from "@/utils/validate-email";

interface LoginFormInputs {
  email: string;
  password: string;
};

const LoginPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Create a new instance of the Appwrite Client
  const client = new Client()
    // Set the endpoint for the Appwrite API
    .setEndpoint("https://cloud.appwrite.io/v1") // Replace with your Appwrite server endpoint
    // Set the project ID for your Appwrite project
    .setProject("66827f98002b29546db2"); // Replace with your Appwrite project ID

  // Create a new instance of the Account service using the client
  const account = new Account(client);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<LoginFormInputs>();

  // Toggle password visibility on button click
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // Start the OAuth2 session for Google login
  const handleGoogleLogin = async () => {
    await account.createOAuth2Session(
      OAuthProvider.Google, // Specify Google as the OAuth provider
      "http://localhost:3000/", // Redirect URI after successful login
      "http://localhost:3000/login" // URI to handle the login process
    );

    // Get the user's information from the OAuth session
    const user = await account.get();

    // Call the service to log in or register the user with the obtained Google user info
    const { accessToken } = await loginOrRegisterWithGoogleService({
      email: user.email,
      name: user.name
    });

    Cookies.set("access_token", accessToken);
    toast.success("Đăng nhập thành công!");
    dispatch(setLoginStatus(true));
  };

  // Handle form submission with valid data
  const onSubmit: SubmitHandler<LoginFormInputs> = async (userData) => {
    setIsLoading(true);
    dispatch(setEmailValue(userData.email));

    // Call the login service with the user data and destructure the response
    const { errorCode, accessToken } = await loginService(userData);

    // Check if the email is not verified
    if (errorCode === "EMAIL_NOT_VERIFIED") {
      router.push("/verify-otp");
      setIsLoading(false);

      // Resend OTP to the user's email
      await resendOtpService({ email: userData.email });
      return;
    }
    // Check if the user needs to log in using Google
    else if (errorCode === "GOOGLE_LOGIN_REQUIRED") {
      setError("email", {
        type: "manual",
        message: "Email này đã được đăng ký với Google!"
      });
      setIsLoading(false);
      return;
    }
    // Check for email not found or invalid password
    else if (errorCode === "EMAIL_NOT_FOUND" || errorCode === "INVALID_PASSWORD") {
      setError("password", {
        type: "manual",
        message: "Email hoặc mật khẩu không chính xác!"
      });
      setIsLoading(false);
      return;
    }

    router.push("/");
    setIsLoading(false);
    dispatch(setLoginStatus(true));
    toast.success("Đăng nhập thành công");
    Cookies.set("access_token", accessToken);
  };

  // If the registration process is loading, show the loading spinner
  if (isLoading) {
    return (
      <Spinner />
    );
  }

  return (
    <div className="h-screen py-10 bg-[#f7f9fc] overflow-y-auto">
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

        {/* Login form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full sm:w-[550px] h-auto p-8 bg-white rounded-xl sm:rounded-md shadow-md"
        >
          <div className="flex flex-col gap-10">
            {/* Form title */}
            <h1 className="text-[22px] font-bold text-center">Đăng nhập</h1>

            <div className="flex flex-col gap-6">
              {/* Email input field */}
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
                    "placeholder:text-[#A9A9A9] p-3 border focus:border-primary focus:shadow-input-primary rounded-md transition duration-500",
                    errors.email ? "border-red-500" : "border-gray-300"
                  )}
                />

                {errors.email && (
                  <span className="text-sm text-red-500">{errors.email.message}</span>
                )}
              </div>

              {/* Password input field */}
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
                        "w-full placeholder:text-[#A9A9A9] p-3 border focus:border-primary focus:shadow-input-primary rounded-md transition duration-500",
                        errors.password ? "border-red-500" : "border-gray-300"
                      )}
                    />

                    {/* Password visibility toggle button */}
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={togglePasswordVisibility}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute top-1/2 right-4 -translate-y-1/2 h-0 p-0 hover:bg-transparent"
                    >
                      {showPassword ? (
                        <FaRegEye size="18" /> // Eye icon when password is visible
                      ) : (
                        <FaRegEyeSlash size="18" /> // Eye slash icon when password is hidden
                      )}
                    </Button>
                  </div>

                  {errors.password && (
                    <span className="text-sm text-red-500">{errors.password.message}</span>
                  )}
                </div>

                {/* Remember me and forgot password links */}
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
                    href="/forgot-password"
                    className="text-primary hover:font-semibold hover:underline"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
              </div>
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              variant="default"
              disabled={isLoading}
              className={cn(
                "h-14 text-lg font-medium text-white py-4 bg-primary hover:bg-[#2c74df] rounded-md shadow-md transition duration-500 select-none",
                isLoading && "opacity-50 cursor-not-allowed"
              )}
            >
              Đăng nhập
            </Button>

            {/* Alternative login option */}
            <p className="text-[15px] font-medium text-center">hoặc đăng nhập với</p>

            {/* Google login button */}
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleLogin}
              className="h-16 flex items-center justify-center gap-4 py-4 px-4 border border-[#ccc] rounded-md transition duration-500"
            >
              <Image
                loading="lazy"
                src="/auth/google.svg"
                alt="Google Icon"
                width={22}
                height={22}
              />
              <p className="text-[17px] font-medium text-center">Tiếp tục với Google</p>
            </Button>

            {/* Registration link */}
            <div className="flex items-center justify-center gap-1">
              <p>Chưa có tài khoản?</p>
              <Link href="/register" className="font-semibold text-primary hover:underline">
                Đăng ký ngay!
              </Link>
            </div>
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

export default LoginPage;