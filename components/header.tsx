"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

import { RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { setIsBannerVisible } from "@/store/slices/common-slice";

import { X } from "lucide-react";
import { FiSearch } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { FaAngleDown } from "react-icons/fa";
import { FaBarsStaggered } from "react-icons/fa6";

import { Input } from "./ui/input";
import { Button } from "./ui/button";

import { MenuState } from "@/types/header-types";
import menuMobile from "@/constants/menu-mobile";

import Link from "next/link";
import Image from "next/image";

// Dynamically importing components to reduce the initial load time
const MenuMobile = dynamic(() => import("@/app/(home)/menu-mobile"), { ssr: false });
const CategoriesMenu = dynamic(() => import("@/app/(home)/categories-menu"), { ssr: false });
const HealthCheckMenu = dynamic(() => import("@/app/(home)/health-check-menu"), { ssr: false });

const Header = () => {
  const router = useRouter();

  const [isFocused, setIsFocused] = useState(false);

  const dispatch = useDispatch();
  const { isBannerVisible } = useSelector((state: RootState) => state.common);

  // State to manage the menu's active tab and mobile menu visibility
  const [menuState, setMenuState] = useState<MenuState>({
    tabActive: null,
    isOpenMenuMobile: false
  });

  // Function to toggle the mobile menu's visibility
  const handleToggleMenuMobile = () => {
    setMenuState((prev) => ({
      ...prev,
      isOpenMenuMobile: !prev.isOpenMenuMobile,
    }));
  };

  // Function to toggle the active tab of the menu
  const handleToggleMenu = (menuName: string) => {
    setMenuState((prev) => ({
      ...prev,
      tabActive: prev.tabActive === menuName ? null : menuName, // Toggle active state
    }));
  };

  return (
    <div
      className={cn(
        "sticky top-0 left-0 right-0 flex flex-col z-50",
        isBannerVisible ? "h-[120px]" : "h-[65px]" // Adjust height based on banner visibility
      )}
    >
      {/* Conditional rendering of the banner */}
      {isBannerVisible && (
        <div className="flex-1 relative flex items-center justify-between sm:justify-center text-sm sm:text-lg text-white bg-[#284a75] px-6">
          {/* Banner message */}
          <p className="animate-bounce">⏬ Tải App Hello Bacsi - Nhận ngay 100K</p>
          {/* Close button to hide banner */}
          <Button
            type="button"
            variant="ghost"
            onClick={() => dispatch(setIsBannerVisible(false))} // Dispatch action to hide banner
            className="absolute top-1/2 right-5 -translate-y-1/2 hover:text-white/60 hover:bg-transparent p-0 transition duration-500"
          >
            <X />
          </Button>
        </div>
      )}

      {/* Main navigation bar */}
      <div className="h-[65px] border-b bg-white px-6 shadow-sm z-50">
        <div className="h-full flex items-center justify-between gap-3">
          <div className="flex items-center gap-8">
            {/* Logo link */}
            <Link href="/" aria-label="Home">
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

            {/* Search bar and menu items (visible only on larger screens) */}
            <div className="hidden xl:flex items-center gap-6">
              <div className="relative w-[280px]">
                {/* Search icon */}
                <FiSearch
                  size="22"
                  className={cn(
                    "absolute top-1/2 left-4 -translate-y-1/2 transition duration-500",
                    isFocused && "text-primary" // Change color on focus
                  )}
                />
                {/* Search input field */}
                <Input
                  type="text"
                  spellCheck={false}
                  placeholder="Tìm kiếm..."
                  aria-label="Search"
                  onFocus={() => setIsFocused(true)} // Set focus state
                  onBlur={() => setIsFocused(false)} // Reset focus state
                  className="w-full h-12 text-[15px] pl-12 pr-4 border focus:border-primary focus:shadow-input-primary transition duration-500"
                />
              </div>

              {/* Menu buttons */}
              <div className="flex items-center gap-8">
                {menuMobile.map(({ value, label }) => (
                  <Button
                    key={value}
                    variant="ghost"
                    onClick={() => handleToggleMenu(value)} // Handle menu toggle
                    className={cn(
                      "group flex items-center gap-3 text-[15px] font-semibold hover:text-primary hover:bg-transparent p-0 transition duration-500 cursor-pointer select-none",
                      menuState.tabActive === value && "text-primary" // Active menu item styling
                    )}
                  >
                    <p>{label}</p>
                    <FaAngleDown
                      size="12"
                      className={cn(
                        "group-hover:text-primary transition duration-500",
                        menuState.tabActive === value && "text-primary" // Active icon color
                      )}
                    />
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Right side of the navigation bar */}
          <div className="flex items-center gap-8">
            {/* Booking button (visible only on medium and larger screens) */}
            <Button
              variant="ghost"
              aria-label="Book appointment with a doctor"
              onClick={() => router.push("/booking-doctor")} // Navigate to booking page
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

            {/* Registration and login buttons (visible only on larger screens) */}
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
                className="w-[120px] text-white font-medium bg-[#2D87F3] hover:bg-[#2D87F3]/60 rounded-md transition duration-500"
              >
                Đăng nhập
              </Button>
            </div>

            {/* Mobile menu toggle button */}
            <div
              onClick={handleToggleMenuMobile} // Toggle mobile menu
              className="relative flex md:hidden items-center justify-center w-[30px] h-[30px] hover:bg-[#f2f2f2] transition duration-500 rounded-md cursor-pointer select-none"
            >
              {menuState.isOpenMenuMobile ? (
                <IoClose size="26" /> // Close icon when menu is open
              ) : (
                <FaBarsStaggered size="19" /> // Hamburger icon when menu is closed
              )}
            </div>
          </div>
        </div>

        {/* Rendering dynamic menu components based on state */}
        <MenuMobile
          isOpenMenu={menuState.isOpenMenuMobile}
          tabActive={menuState.tabActive}
          handleToggleMenu={handleToggleMenu}
        />

        {/* Category menu */}
        <CategoriesMenu
          tabActive={menuState.tabActive}
          setMenuState={setMenuState}
        />

        {/* Health check menu */}
        <HealthCheckMenu
          tabActive={menuState.tabActive}
          setMenuState={setMenuState}
        />
      </div>
    </div>
  );
};

export default Header;