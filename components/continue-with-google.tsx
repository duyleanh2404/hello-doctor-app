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

const ContinueWithGoogle = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleContinueWithGoogle = useGoogleLogin({
    onSuccess: async (response) => {
      const { email, name, picture: image } = await getGoogleInfo(response.access_token);

      try {
        const { user, accessToken } = await continueWithGoogle({ email, name, image });
        NProgress.start();
        toast.success("Đăng nhập thành công!");
        Cookies.set("access_token", accessToken, {
          expires: 1,
          secure: true,
          sameSite: "strict"
        });

        dispatch(setUserData({
          email: user.email,
          fullname: user.fullname,
          role: user.role,
          image: user.image
        }));
        dispatch(setLoginStatus(true));
      } catch (error: any) {
        toast.error("Đăng nhập thất bại!");
      } finally {
        router.replace("/");
      }
    },
    onError: () => {
      toast.error("Đăng nhập thất bại!");
    }
  });

  return (
    <>
      <Button
        type="button"
        size="xl"
        variant="outline"
        onClick={() => handleContinueWithGoogle()}
        className="relative"
      >
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