"use client";

import { usePathname } from "next/navigation";

import {
  FaUserEdit,
  FaRegNewspaper,
  FaClinicMedical,
  FaRegCalendarAlt
} from "react-icons/fa";

import { FiLogOut } from "react-icons/fi";
import { BsClipboard2PlusFill } from "react-icons/bs";
import { FaRegBell, FaUserDoctor } from "react-icons/fa6";

import { Button } from "@/components/ui/button";
import { SidebarButton } from "./sidebar-button";

import Link from "next/link";
import Image from "next/image";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const currentPath = usePathname();

  return (
    <div>
      <div className="fixed top-0 left-0 w-[17%] h-screen flex flex-col justify-between bg-[#1c3f66]">
        <div className="flex flex-col gap-6">
          {/* Navigation link to admin page */}
          <Link href="/admin">
            <Image
              loading="lazy"
              src="/logo-admin.jpg"
              alt="Logo"
              width="320"
              height="170"
              className="py-4"
            />
          </Link>

          {/* Sidebar buttons */}
          <div className="flex flex-col">
            <SidebarButton
              text="Bệnh nhân"
              path="/admin/users"
              currentPath={currentPath}
              icon={<FaUserEdit size="18" className="text-white" />}
            />

            <SidebarButton
              text="Bác sĩ"
              path="/admin/doctors"
              currentPath={currentPath}
              icon={<FaUserDoctor size="18" className="text-white" />}
            />

            <SidebarButton
              text="Chuyên khoa"
              path="/admin/specialties"
              currentPath={currentPath}
              icon={<BsClipboard2PlusFill size="18" className="text-white" />}
            />

            <SidebarButton
              text="Bệnh viện"
              path="/admin/clinics"
              currentPath={currentPath}
              icon={<FaClinicMedical size="18" className="text-white" />}
            />

            <SidebarButton
              text="Lịch trình của bác sĩ"
              path="/admin/schedules"
              currentPath={currentPath}
              icon={<FaRegCalendarAlt size="17" className="text-white" />}
            />

            <SidebarButton
              text="Bài viết/ tin tức"
              path="/admin/posts"
              currentPath={currentPath}
              icon={<FaRegNewspaper size="17" className="text-white" />}
            />
          </div>
        </div>

        {/* Logout button */}
        <Button
          type="button"
          variant="default"
          className="flex items-center justify-start gap-3 text-[17px] font-medium text-white py-4 px-6 bg-transparent hover:bg-black hover:bg-opacity-20 transition duration-500 select-none"
        >
          <FiLogOut size="20" />
          Đăng xuất
        </Button>
      </div>

      <div className="relative flex-1 h-screen flex flex-col gap-6 p-6 ml-[17%]">
        {/* Notification bell and user profile */}
        <div className="absolute top-4 right-6 flex items-center gap-8 select-none">
          {/* Notification bell button */}
          <Button type="button" variant="ghost">
            <FaRegBell size="22" />
          </Button>

          {/* User avatar and name */}
          <div className="flex items-center gap-3">
            <Image
              loading="lazy"
              src="/avatar-default.png"
              alt="Avatar"
              width="40"
              height="40"
              className="object-cover rounded-full"
            />
            <p className="font-medium">User fullname</p>
          </div>
        </div>

        {/* Render child components (content) below the header */}
        {children}
      </div>
    </div>
  );
};

export default MainLayout;