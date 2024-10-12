import { User } from "@/types/user-types";
import { RootState } from "@/store/store";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser } from "@/services/user-serivce";
import { setLoginStatus } from "@/store/slices/auth-slice";

import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import Image from "next/image";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const UserSettings = () => {
  const router = useRouter();

  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);

  const [user, setUser] = useState<User | null>(null);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  // Effect to mark that the client has mounted
  useEffect(() => {
    setIsMounted(true); // Mark that the client has rendered
  }, []);

  // Effect to fetch the current user data
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const accessToken = Cookies.get("access_token");
        if (!accessToken) return;

        const userData = await getCurrentUser(accessToken);
        setUser(userData.user);
      } catch (err) {
        console.error(err);
      }
    };

    if (isLoggedIn) {
      fetchCurrentUser();
    }
  }, [isLoggedIn]);

  // Handle logout account
  const handleLogout = () => {
    Cookies.remove("access_token");
    Cookies.remove("logged_in");
    dispatch(setLoginStatus(false));
    toast.success("Tài khoản của bạn đã được đăng xuất!");
  };

  // Prevent rendering until mounted
  if (!isMounted) {
    return (
      <div className="border-t-4 border-primary border-solid rounded-full w-6 h-6 animate-spin" />
    );
  };

  return (
    isLoggedIn ? (
      // Rendered when the user is logged in
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center gap-3 cursor-pointer select-none">
            <Avatar>
              <AvatarImage src={user?.image} alt="User Avatar" />
              <AvatarFallback className="text-lg font-medium text-white bg-primary">
                {user?.fullname.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <p className="font-medium">{user?.fullname}</p>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[300px] -translate-x-5">
          <div className="flex items-center gap-3 cursor-pointer select-none p-3">
            <Avatar>
              <AvatarImage src={user?.image} alt="User Avatar" />
              <AvatarFallback className="text-lg font-medium text-white bg-primary">
                {user?.fullname.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="font-medium">{user?.fullname}</p>
              <p className="text-sm text-primary">{user?.email}</p>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex items-center gap-3 p-3 cursor-pointer select-none">
            <Image
              src="/profile.svg"
              alt="Profile Icon"
              width={25}
              height={25}
            />
            <p>Hồ sơ của tôi</p>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center gap-3 p-3 cursor-pointer select-none">
            <Image
              src="/history-booking.svg"
              alt="History Booking Icon"
              width={25}
              height={25}
            />
            <p>Lịch sử đặt chỗ</p>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            className="flex items-center gap-3 p-3 cursor-pointer select-none"
          >
            <Image
              src="/logout.svg"
              alt="Logout Icon"
              width={25}
              height={25}
            />
            <p>Đăng xuất</p>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ) : (
      // Registration and login buttons (visible only on larger screens)
      <div className="hidden sm:flex items-center gap-3">
        <Button
          type="button"
          onClick={() => router.push("/register")} // Navigate to register page
          className="w-[120px] text-[#2D87F3] font-medium border border-[#2D87F3] bg-white hover:bg-[#2D87F3]/10 rounded-md transition duration-500"
        >
          Đăng ký
        </Button>
        <Button
          type="button"
          onClick={() => router.push("/login")} // Navigate to login page
          className="w-[120px] text-white font-medium bg-[#2D87F3] hover:bg-[#2D87F3]/80 rounded-md transition duration-500"
        >
          Đăng nhập
        </Button>
      </div>
    )
  );
};

export default UserSettings;