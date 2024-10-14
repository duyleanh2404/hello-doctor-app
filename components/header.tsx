"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import dynamic from "next/dynamic";

import { X } from "lucide-react";
import { IoClose } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";
import { FaAngleDown } from "react-icons/fa";
import { FaBarsStaggered } from "react-icons/fa6";

import Link from "next/link";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { RootState } from "@/store/store";
import { MenuState } from "@/types/header-types";
import { setIsBannerVisible } from "@/store/slices/common-slice";
import menuMobile from "@/constants/menu-mobile";

import { Input } from "./ui/input";
import { Button } from "./ui/button";
import UserSettings from "@/app/(home)/user-settings";

const MenuMobile = dynamic(() => import("@/app/(home)/menu-mobile"), { ssr: false });
const CategoriesMenu = dynamic(() => import("@/app/(home)/categories-menu"), { ssr: false });
const HealthCheckMenu = dynamic(() => import("@/app/(home)/health-check-menu"), { ssr: false });

const Header = () => {
  const router = useRouter();
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const dispatch = useDispatch();
  const { isBannerVisible } = useSelector((state: RootState) => state.common);

  const [menuState, setMenuState] = useState<MenuState>({
    tabActive: null,
    isOpenMenuMobile: false
  });

  const handleToggleMenuMobile = () => {
    setMenuState((prev) => ({
      ...prev,
      isOpenMenuMobile: !prev.isOpenMenuMobile,
    }));
  };

  const handleToggleMenu = (menuName: string) => {
    setMenuState((prev) => ({
      ...prev,
      tabActive: prev.tabActive === menuName ? null : menuName
    }));
  };

  return (
    <div
      className={cn(
        "sticky top-0 left-0 right-0 flex flex-col z-50",
        isBannerVisible ? "h-[120px]" : "h-[65px]"
      )}
    >
      {isBannerVisible && (
        <div className="flex-1 relative flex items-center justify-between sm:justify-center text-sm sm:text-lg text-white bg-[#284a75] px-6">
          <p className="animate-bounce">⏬ Tải App Hello Bacsi - Nhận ngay 100K</p>
          <Button
            type="button"
            variant="ghost"
            onClick={() => dispatch(setIsBannerVisible(false))}
            className="absolute top-1/2 right-5 -translate-y-1/2 hover:text-white/80 hover:bg-transparent p-0 transition duration-500"
          >
            <X />
          </Button>
        </div>
      )}

      <div className="h-[65px] border-b bg-white px-6 shadow-sm z-50">
        <div className="h-full flex items-center justify-between gap-3">
          <div className="flex items-center gap-8">
            <Link href="/">
              <div>
                <Image
                  loading="lazy"
                  src="/logo.png"
                  alt="Company Logo"
                  width={120}
                  height={120}
                />
              </div>
            </Link>

            <div className="hidden xl:flex items-center gap-6">
              <div className="relative w-[280px]">
                <FiSearch
                  size="22"
                  className={cn(
                    "absolute top-1/2 left-4 -translate-y-1/2 transition duration-500",
                    isFocused && "text-primary"
                  )}
                />
                <Input
                  type="text"
                  spellCheck={false}
                  placeholder="Tìm kiếm..."
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  className="w-full h-12 text-[15px] pl-12 pr-4 border focus:border-primary focus:shadow-input-primary transition duration-500"
                />
              </div>

              <div className="flex items-center gap-8">
                {menuMobile.map(({ value, label }) => (
                  <Button
                    key={value}
                    variant="ghost"
                    onClick={() => handleToggleMenu(value)}
                    className={cn(
                      "group flex items-center gap-3 text-[15px] font-semibold hover:text-primary hover:bg-transparent p-0 transition duration-500 cursor-pointer select-none",
                      menuState.tabActive === value && "text-primary"
                    )}
                  >
                    <p>{label}</p>
                    <FaAngleDown
                      size="12"
                      className={cn(
                        "group-hover:text-primary transition duration-500",
                        menuState.tabActive === value && "text-primary"
                      )}
                    />
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <Button
              variant="ghost"
              onClick={() => router.push("/booking-doctor")}
              className="hidden md:flex items-center gap-3 hover:bg-[#e3f2ff] transition duration-500"
            >
              <Image
                loading="lazy"
                src="/doctor.svg"
                alt="Doctor"
                width={24}
                height={24}
              />
              <p className="text-[15px] font-semibold">
                Đặt lịch với bác sĩ
              </p>
            </Button>

            <UserSettings />

            <div
              onClick={handleToggleMenuMobile}
              className="relative flex md:hidden items-center justify-center w-[30px] h-[30px] hover:bg-[#f2f2f2] transition duration-500 rounded-md cursor-pointer select-none"
            >
              {menuState.isOpenMenuMobile ? (
                <IoClose size="26" />
              ) : (
                <FaBarsStaggered size="19" />
              )}
            </div>
          </div>
        </div>

        <MenuMobile
          isOpenMenu={menuState.isOpenMenuMobile}
          tabActive={menuState.tabActive}
          handleToggleMenu={handleToggleMenu}
        />

        <CategoriesMenu
          tabActive={menuState.tabActive}
          setMenuState={setMenuState}
        />

        <HealthCheckMenu
          tabActive={menuState.tabActive}
          setMenuState={setMenuState}
        />
      </div>
    </div>
  );
};

export default Header;