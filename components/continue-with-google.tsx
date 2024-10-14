import { useDispatch } from "react-redux";
import { Client, Account, OAuthProvider } from "appwrite";
import Image from "next/image";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

import { Button } from "./ui/button";
import { setLoginStatus } from "@/store/slices/auth-slice";
import { loginOrRegisterWithGoogle } from "@/services/auth-service";

const ContinueWithGoogle = () => {
  const dispatch = useDispatch();

  const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject("66827f98002b29546db2");

  const account = new Account(client);

  const handleContinueWithGoogle = async () => {
    await account.createOAuth2Session(
      OAuthProvider.Google,
      "http://localhost:3000/",
      "http://localhost:3000/login"
    );

    const { email, name } = await account.get();
    const { accessToken } = await loginOrRegisterWithGoogle({ email, name });

    dispatch(setLoginStatus(true));
    toast.success("Đăng nhập thành công!");
    Cookies.set("access_token", accessToken, {
      secure: true,
      sameSite: "strict",
      expires: 1
    });
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleContinueWithGoogle}
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
  );
};

export default ContinueWithGoogle;