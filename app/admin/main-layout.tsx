"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

import {
  FaUserEdit,
  FaRegNewspaper,
  FaClinicMedical,
  FaRegCalendarAlt
} from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { IoSettingsOutline } from "react-icons/io5";
import { BsClipboard2PlusFill } from "react-icons/bs";
import { IoMdHelpCircleOutline } from "react-icons/io";
import { FaRegBell, FaUserDoctor } from "react-icons/fa6";

import { resetUserData, setLoginStatus } from "@/store/slices/auth-slice";

import { Button } from "@/components/ui/button";
import Hint from "@/components/hint";
import SidebarButton from "@/components/sidebar-button";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const currentPath = usePathname();

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
            <Image
              loading="lazy"
              src="/logo-admin.jpg"
              alt="Logo"
              width="320"
              height="170"
              className="py-4 object-contain"
            />
          </Link>

          <div className="flex flex-col">
            <SidebarButton
              text="Bệnh nhân"
              path="/admin/manage-users"
              currentPath={currentPath}
              icon={<FaUserEdit size="18" className="text-white" />}
            />

            <SidebarButton
              text="Bác sĩ"
              path="/admin/manage-doctors"
              currentPath={currentPath}
              addLabel="Thêm bác sĩ mới"
              addPath="/admin/manage-doctors/create-doctor"
              icon={<FaUserDoctor size="18" className="text-white" />}
            />

            <SidebarButton
              text="Chuyên khoa"
              path="/admin/manage-specialties"
              currentPath={currentPath}
              addLabel="Thêm chuyên khoa mới"
              addPath="/admin/manage-specialties/create-specialty"
              icon={<BsClipboard2PlusFill size="18" className="text-white" />}
            />

            <SidebarButton
              text="Bệnh viện"
              path="/admin/manage-clinics"
              currentPath={currentPath}
              addLabel="Thêm bệnh viện mới"
              addPath="/admin/manage-clinics/create-clinic"
              icon={<FaClinicMedical size="18" className="text-white" />}
            />

            <SidebarButton
              text="Lịch trình của bác sĩ"
              path="/admin/manage-schedules"
              currentPath={currentPath}
              addLabel="Thêm lịch trình mới"
              addPath="/admin/manage-schedules/create-schedule"
              icon={<FaRegCalendarAlt size="17" className="text-white" />}
            />

            <SidebarButton
              text="Bài viết/ tin tức"
              path="/admin/manage-posts"
              currentPath={currentPath}
              addLabel="Thêm bài viết mới"
              addPath="/admin/manage-posts/create-post"
              icon={<FaRegNewspaper size="17" className="text-white" />}
            />
          </div>
        </div>

        <Button
          type="button"
          variant="default"
          onClick={handleLogout}
          className="flex items-center justify-start gap-3 text-[17px] font-medium text-white py-4 px-6 bg-transparent hover:bg-black hover:bg-opacity-20 transition duration-500 select-none"
        >
          <FiLogOut size="20" />
          Đăng xuất
        </Button>
      </div>

      <div className="relative flex-1 h-screen flex flex-col gap-6 p-6 ml-[18%]">
        <div className="absolute top-4 right-6 flex items-center gap-4 select-none">
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

          <div className="flex items-center gap-3">
            <Image
              loading="lazy"
              src="/avatar-default.png"
              alt="Avatar"
              width="40"
              height="40"
              className="object-cover rounded-full"
            />
            <p className="font-medium">Admin</p>
          </div>
        </div>

        {children}
      </div>
    </>
  );
};

export default MainLayout;