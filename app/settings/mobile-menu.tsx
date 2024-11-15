import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";

import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

import { RootState } from "@/store/store";
import { setOpenMenuMobile } from "@/store/slices/settings-slice";

import { Button } from "@/components/ui/button";
import ProfileTab from "./profile-tab";

const MobileMenu = () => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();

  const { isBannerVisible } = useSelector((state: RootState) => state.common);
  const { openMenuMobile } = useSelector((state: RootState) => state.settings);

  return (
    <div
      className={cn(
        "wrapper w-full h-full fixed left-0 flex flex-col gap-4 py-3 bg-white shadow-md rounded-lg transition duration-500 z-10",
        openMenuMobile ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        isBannerVisible ? "top-[120px]" : "top-[65px]"
      )}
    >
      <Button
        type="button"
        variant="ghost"
        className="p-0 ml-auto hover:bg-transparent"
        onClick={() => dispatch(setOpenMenuMobile(false))}
      >
        <IoClose size="27" />
      </Button>

      <ProfileTab
        label="Hồ sơ của tôi"
        icon={`user${pathname === "/settings/my-profile" ? "-active" : ""}.svg`}
        isActive={pathname === "/settings/my-profile"}
        onClick={() => {
          NProgress.start();
          dispatch(setOpenMenuMobile(false));
          router.replace("/settings/my-profile");
        }}
      />

      <ProfileTab
        label="Lịch sử đặt chỗ"
        icon="calendar.svg"
        isActive={pathname === "/settings/history-booking"}
        onClick={() => {
          NProgress.start();
          dispatch(setOpenMenuMobile(false));
          router.replace("/settings/history-booking");
        }}
      />
    </div>
  );
};

export default MobileMenu;