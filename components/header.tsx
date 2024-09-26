"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

import { FiSearch } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { FaAngleDown } from "react-icons/fa";
import { FaBarsStaggered } from "react-icons/fa6";

import Link from "next/link";
import Image from "next/image";

import { Input } from "./ui/input";
import { Button } from "./ui/button";

import { MenuState } from "@/types/header-types";
import menuMobile from "@/constants/menu-mobile";

const MenuMobile = dynamic(() => import("@/app/(home)/menu-mobile"), { ssr: false });
const CategoriesMenu = dynamic(() => import("@/app/(home)/categories-menu"), { ssr: false });
const HealthCheckMenu = dynamic(() => import("@/app/(home)/health-check-menu"), { ssr: false });

const Header = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [menuState, setMenuState] = useState<MenuState>({
    tabActive: null, isOpenMenuMobile: false
  });

  const handleToggleMenuMobile = () => {
    setMenuState(prev => ({
      ...prev, isOpenMenuMobile: !prev.isOpenMenuMobile
    }));
  };

  const handleToggleMenu = (menuName: string) => {
    setMenuState((prev) => ({
      ...prev, tabActive: prev.tabActive === menuName ? null : menuName
    }));
  };

  return (
    <header className="h-[65px] sticky top-0 left-0 right-0 border-b bg-white px-6 shadow-sm z-50">
      <div className="h-full flex items-center justify-between gap-3">
        <div className="flex items-center gap-8">
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

          <div className="hidden xl:flex items-center gap-6">
            <div className="relative w-[280px]">
              <FiSearch
                size="22"
                className={cn(
                  "absolute top-1/2 left-4 -translate-y-1/2 transition-colors duration-500",
                  isFocused ? "text-blue-500" : "text-[#172B4C]"
                )}
              />
              <Input
                type="text"
                spellCheck={false}
                placeholder="Tìm kiếm..."
                aria-label="Search"
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="w-full text-[15px] pl-12 pr-4 border focus:border-primary focus:shadow-input-primary transition duration-500"
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
                    menuState.tabActive === value ? "text-primary" : "text-[#172B4C]"
                  )}
                >
                  <p>{label}</p>
                  <FaAngleDown
                    size="12"
                    className={cn(
                      "group-hover:text-primary transition duration-500",
                      menuState.tabActive === value ? "text-primary" : "text-[#172B4C]"
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
            className="hidden md:flex items-center gap-3 hover:bg-[#e3f2ff] transition duration-500"
            aria-label="Book appointment with a doctor"
          >
            <Image
              loading="lazy"
              src="/doctor.svg"
              alt="Doctor"
              width={24}
              height={24}
            />
            <p className="text-[15px] font-semibold text-[#172B4C]">
              Đặt lịch với bác sĩ
            </p>
          </Button>

          <div className="hidden sm:flex items-center gap-3">
            <Button
              type="button"
              className="w-[120px] text-[#2D87F3] font-medium border border-[#2D87F3] bg-white hover:bg-[#2D87F3]/10 rounded-md transition duration-500"
            >
              Đăng ký
            </Button>

            <Button
              type="button"
              className="w-[120px] text-white font-medium bg-[#2D87F3] hover:bg-[#2D87F3]/60 rounded-md transition duration-500"
            >
              Đăng nhập
            </Button>
          </div>

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
    </header >
  );
};

export default Header;