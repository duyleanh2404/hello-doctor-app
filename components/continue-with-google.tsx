import { useRouter } from "next/navigation";
import Image from "next/image";

import { useGoogleLogin } from "@react-oauth/google";
import Cookies from "js-cookie";
import NProgress from "nprogress";
import toast from "react-hot-toast";
import "nprogress/nprogress.css";

import { useDispatch } from "react-redux";
import { setLoginStatus, setUserData } from "@/store/slices/auth-slice";

import { continueWithGoogle, getGoogleInfo } from "@/services/auth-service";

import { Button } from "./ui/button";
import { UserData } from "@/types/user-types";

const ContinueWithGoogle = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleContinueWithGoogle = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        const { email, name, picture: image } = await getGoogleInfo(response.access_token);
        const { user, accessToken } = await continueWithGoogle({ email, name, image });
        handleLoginSuccess(user, accessToken);
      } catch (error: any) {
        console.error(error);
        toast.error("Đăng nhập thất bại!");
      } finally {
        router.replace("/");
      }
    },
    onError: () => {
      toast.error("Đăng nhập thất bại!");
    }
  });

  const handleLoginSuccess = (user: UserData, accessToken: string) => {
    NProgress.start();
    toast.success("Đăng nhập thành công!");
    Cookies.set("access_token", accessToken, { expires: 1, secure: true, sameSite: "strict" });
    dispatch(setUserData(user));
    dispatch(setLoginStatus(true));
  }

  return (
    <>
      <Button type="button" size="xl" variant="outline" onClick={() => handleContinueWithGoogle()} className="relative">
        <Image
          loading="lazy"
          src="/auth/google.svg"
          alt="Google Icon"
          width={22}
          height={22}
          className="absolute top-1/2 left-6 -translate-y-1/2"
        />
        <p className="text-[17px] font-medium text-center">Tiếp tục với Google</p>
      </Button>
    </>
  );
};

export default ContinueWithGoogle; 