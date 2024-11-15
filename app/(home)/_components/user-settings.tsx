import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import NProgress from "nprogress";
import toast from "react-hot-toast";
import "nprogress/nprogress.css";

import { RootState } from "@/store/store";
import { resetUserData, setLoginStatus } from "@/store/slices/auth-slice";

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/spinner";

const UserSettings = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState<boolean>(false);

  const dispatch = useDispatch();
  const { isLoggedIn, userData } = useSelector((state: RootState) => state.auth);

  useEffect(() => setIsMounted(true), []);

  const handleLogout = () => {
    toast.success("Tài khoản của bạn đã được đăng xuất!");
    Cookies.remove("access_token");
    dispatch(resetUserData());
    dispatch(setLoginStatus(false));
    router.replace("/");
  };

  if (!isMounted) {
    return <Spinner />;
  };

  return (
    isLoggedIn ? (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center gap-3 cursor-pointer select-none">
            <Avatar>
              <AvatarImage src={userData?.image || "/avatar-default.png"} alt="User Avatar" />
            </Avatar>
            <p className="hidden sm:flex font-medium">{userData?.fullname}</p>
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-[300px] -translate-x-5">
          <div className="flex items-center gap-3 cursor-pointer select-none p-3">
            <Avatar>
              <AvatarImage src={userData?.image || "/avatar-default.png"} alt="User Avatar" />
            </Avatar>
            <div className="flex flex-col">
              <p className="font-medium">{userData?.fullname}</p>
              <p className="text-sm text-primary">{userData?.email}</p>
            </div>
          </div>

          {userData?.role === "user" && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  pathname !== "/settings/my-profile" && NProgress.start();
                  router.replace("/settings/my-profile");
                }}
                className="flex items-center gap-3 p-3 cursor-pointer select-none"
              >
                <Image src="/profile.svg" alt="Profile Icon" width={25} height={25} />
                <p>Hồ sơ của tôi</p>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  pathname !== "/settings/history-booking" && NProgress.start();
                  router.replace("/settings/history-booking");
                }}
                className="flex items-center gap-3 p-3 cursor-pointer select-none"
              >
                <Image src="/history-booking.svg" alt="History Booking Icon" width={25} height={25} />
                <p>Lịch sử đặt chỗ</p>
              </DropdownMenuItem>
            </>
          )}

          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            className="flex items-center gap-3 p-3 cursor-pointer select-none"
          >
            <Image src="/logout.svg" alt="Logout Icon" width={25} height={25} />
            <p>Đăng xuất</p>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ) : (
      <div className="hidden sm:flex items-center gap-3">
        <Button
          type="button"
          variant="default"
          onClick={() => {
            NProgress.start();
            router.push("/register");
          }}
          className="w-[120px] text-[#2D87F3] font-medium border border-[#2D87F3] bg-white hover:bg-[#2D87F3]/10 rounded-md transition duration-500"
        >
          Đăng ký
        </Button>

        <Button
          type="button"
          variant="default"
          onClick={() => {
            NProgress.start();
            router.push("/login");
          }}
          className="w-[120px] text-white font-medium bg-[#2D87F3] hover:bg-[#2D87F3]/80 rounded-md transition duration-500"
        >
          Đăng nhập
        </Button>
      </div>
    )
  );
};

export default UserSettings;