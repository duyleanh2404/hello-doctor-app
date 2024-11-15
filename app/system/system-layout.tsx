"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { useDispatch } from "react-redux";
import { resetUserData, setLoginStatus } from "@/store/slices/auth-slice";

import Cookies from "js-cookie";
import toast from "react-hot-toast";

import { FiLogOut } from "react-icons/fi";
import { FaRegBell } from "react-icons/fa6";
import { BsClipboard2PlusFill } from "react-icons/bs";
import { IoMdHelpCircleOutline } from "react-icons/io";
import { IoTime, IoSettingsOutline } from "react-icons/io5";
import { FaRegNewspaper, FaRegCalendarAlt } from "react-icons/fa";

import { UserData } from "@/types/user-types";
import { getCurrentUser, editUser } from "@/services/user-serivce";

import {
  Avatar,
  AvatarImage,
  AvatarFallback
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Hint from "@/components/hint";
import Spinner from "@/components/spinner";
import SidebarButton from "@/components/sidebar-button";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const currentPath = usePathname();

  const [user, setUser] = useState<UserData | null>(null);
  const [isChanged, setIsChanged] = useState<boolean>(false);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const accessToken = Cookies.get("access_token");
      if (!accessToken) return;

      try {
        const { user } = await getCurrentUser(accessToken);
        setUser(user);
      } catch (error: any) {
        console.error(error);
        toast.error("Có lỗi xảy ra. Vui lòng thử lại sau ít phút nữa!");
      } finally {
        setIsChanged(false);
      }
    };

    fetchCurrentUser();
  }, [isChanged]);

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const accessToken = Cookies.get("access_token");
    if (!accessToken || !user) return;

    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await editUser(accessToken, { id: user._id, image: file });
      toast.success("Cập nhật ảnh đại diện thành công!");
      setIsChanged(true);
    } catch (error: any) {
      console.error(error);
      toast.error("Cập nhật ảnh đại diện thất bại. Vui lòng thử lại sau ít phút nữa!");
    } finally {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleLogout = () => {
    toast.success("Tài khoản của bạn đã được đăng xuất!");
    Cookies.remove("access_token");
    dispatch(resetUserData());
    dispatch(setLoginStatus(false));
    router.replace("/");
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-[18%] h-screen flex flex-col justify-between bg-[#1c3f66]">
        <div className="flex flex-col gap-6">
          <Link href="/admin/manage-users">
            <Image loading="lazy" src="/logo-admin.jpg" alt="Logo" width="320" height="170" className="py-4" />
          </Link>

          <div className="flex flex-col">
            <SidebarButton
              text="Đơn đặt lịch khám"
              path="/system/manage-appointments"
              currentPath={currentPath}
              icon={<BsClipboard2PlusFill size="18" className="text-white" />}
            />

            <SidebarButton
              text="Lịch trình"
              path="/system/manage-schedules"
              currentPath={currentPath}
              icon={<FaRegCalendarAlt size="17" className="text-white" />}
            />

            <SidebarButton
              text="Bài viết/ tin tức"
              path="/system/manage-posts"
              currentPath={currentPath}
              addLabel="Thêm bài viết mới"
              addPath="/system/manage-posts/create-post"
              icon={<FaRegNewspaper size="17" className="text-white" />}
            />

            <SidebarButton
              text="Thời khóa biểu"
              path="/system/manage-timetable"
              currentPath={currentPath}
              icon={<IoTime size="19" className="text-white" />}
            />
          </div>
        </div>

        <Button
          type="button"
          variant="default"
          onClick={handleLogout}
          className="flex items-center justify-start gap-3 text-[17px] font-medium text-white py-4 px-6 bg-transparent hover:bg-black hover:bg-opacity-20 transition duration-500 select-none"
        >
          <FiLogOut size="20" /> Đăng xuất
        </Button>
      </div>

      <div className="relative flex-1 h-screen flex flex-col gap-6 p-6 ml-[18%]">
        <div className="absolute top-4 right-6 flex items-center gap-8 select-none">
          <div className="flex items-center">
            <Hint label="Cài đặt">
              <Button type="button" variant="ghost">
                <IoSettingsOutline size="22" />
              </Button>
            </Hint>

            <Hint label="Hỗ trợ">
              <Button type="button" variant="ghost">
                <IoMdHelpCircleOutline size="24" />
              </Button>
            </Hint>

            <Hint label="Thông báo">
              <Button type="button" variant="ghost">
                <FaRegBell size="22" />
              </Button>
            </Hint>
          </div>

          {!user ? (
            <Spinner className="w-10 h-10" />
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-3 cursor-pointer select-none">
                  <Avatar>
                    <AvatarImage src={user?.image} alt="User Avatar" />
                    <AvatarFallback className="text-lg font-medium text-white bg-primary">
                      {user?.fullname.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <p className="hidden sm:flex font-medium">{user?.fullname}</p>
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-[320px] -translate-x-5">
                <div className="flex items-center gap-4 cursor-pointer select-none p-3">
                  <div className="group relative">
                    <label htmlFor="avatarInput" className="cursor-pointer">
                      <Avatar className="w-[2.8rem] h-[2.8rem]">
                        <AvatarImage src={user?.image} alt="User Avatar" />
                        <AvatarFallback className="text-lg font-medium text-white bg-primary">
                          {user?.fullname.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <Image
                        loading="lazy"
                        src="/my-profile/change-avatar.svg"
                        alt="Change Avatar"
                        width="20"
                        height="20"
                        className="opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto absolute -bottom-1 -right-1 transition duration-500 z-10"
                      />
                    </label>

                    <Input id="avatarInput" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                  </div>

                  <div className="flex flex-col">
                    <p className="font-medium">{user?.fullname}</p>
                    <p className="text-sm text-primary">{user?.email}</p>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {children}
      </div>
    </>
  );
};

export default MainLayout;