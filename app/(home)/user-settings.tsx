import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

import { User } from "@/types/user-types";
import { RootState } from "@/store/store";
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
import { Button } from "@/components/ui/button";
import Spinner from "@/components/spinner";

const UserSettings = () => {
  const router = useRouter();

  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);

  const [user, setUser] = useState<User | null>(null);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const accessToken = Cookies.get("access_token");
        if (!accessToken) return;

        const userData = await getCurrentUser(accessToken);
        setUser(userData.user);
      } catch (err: any) {
        toast.error("Có lỗi xảy ra. Vui lòng thử lại sau ít phút nữa!");
        router.push("/");
      }
    };

    if (isLoggedIn) {
      fetchCurrentUser();
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    Cookies.remove("access_token");
    dispatch(setLoginStatus(false));
    toast.success("Tài khoản của bạn đã được đăng xuất!");
  };

  if (!isMounted) {
    return <Spinner />
  };

  return (
    isLoggedIn ? (
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
      <div className="hidden sm:flex items-center gap-3">
        <Button
          type="button"
          variant="default"
          onClick={() => router.push("/register")}
          className="w-[120px] text-[#2D87F3] font-medium border border-[#2D87F3] bg-white hover:bg-[#2D87F3]/10 rounded-md transition duration-500"
        >
          Đăng ký
        </Button>
        <Button
          type="button"
          variant="default"
          onClick={() => router.push("/login")}
          className="w-[120px] text-white font-medium bg-[#2D87F3] hover:bg-[#2D87F3]/80 rounded-md transition duration-500"
        >
          Đăng nhập
        </Button>
      </div>
    )
  );
};

export default UserSettings;