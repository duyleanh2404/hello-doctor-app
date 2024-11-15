import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

import NProgress from "nprogress";
import "nprogress/nprogress.css";

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

import ProfileTab from "./profile-tab";

const ProfileMenu = () => {
  const router = useRouter();
  const pathname = usePathname();

  const { userData } = useSelector((state: RootState) => state.auth);

  return (
    <div className="w-[22%] h-[calc(100vh-130px)] sticky top-[140px] hidden lg:flex flex-col gap-8 py-10 px-6 bg-white shadow-md rounded-2xl">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <Image
            loading="lazy"
            src={userData?.image || "/avatar-default.png"}
            alt="Profile Picture"
            width="60"
            height="60"
            className="object-cover rounded-full"
          />

          <div className="flex items-center gap-2 p-2 border border-primary rounded-full">
            <Image
              loading="lazy"
              src="/avatar-default.png"
              alt="Member Icon"
              width="20"
              height="20"
              className="object-cover rounded-full"
            />
            <p className="text-sm font-semibold">Thành viên</p>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-semibold">{userData?.fullname}</h1>
          <p className="text-primary">@{userData?.email}</p>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <ProfileTab
          label="Hồ sơ của tôi"
          icon={`user${pathname === "/settings/my-profile" ? "-active" : ""}.svg`}
          isActive={pathname === "/settings/my-profile"}
          onClick={() => {
            pathname !== "/settings/my-profile" && NProgress.start();
            router.replace("/settings/my-profile");
          }}
        />

        <ProfileTab
          label="Lịch sử đặt chỗ"
          icon="calendar.svg"
          isActive={pathname === "/settings/history-booking"}
          onClick={() => {
            pathname !== "/settings/history-booking" && NProgress.start();
            router.replace("/settings/history-booking");
          }}
        />
      </div>
    </div>
  );
};

export default ProfileMenu;