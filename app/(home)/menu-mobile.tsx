import { useState, memo } from "react";
import { cn } from "@/lib/utils";

import { FiSearch } from "react-icons/fi";

import Link from "next/link";
import Image from "next/image";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import menuMobile from "@/constants/menu-mobile";

interface MenuMobileProps {
  isOpenMenu: boolean;
  tabActive: string | null;
  handleToggleMenu: (menuName: string) => void;
}

const MenuMobile = memo(({ isOpenMenu, tabActive, handleToggleMenu }: MenuMobileProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={cn(
      "h-[calc(100vh-65px)] border-t bg-white p-6 shadow-sm transition duration-500",
      isOpenMenu ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
    )}>
      <div className="h-full flex flex-col justify-between">
        <div className="flex flex-col gap-8">
          <div className="relative w-full">
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
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="w-full text-[15px] pl-12 pr-4 border focus:border-primary focus:shadow-input-primary transition duration-500"
            />
          </div>

          <Link href="/booking-doctor" className="w-full flex items-center gap-3">
            <Image
              loading="lazy"
              src="/doctor.svg"
              alt="Doctor"
              width={24}
              height={24}
            />
            <p className="text-[15px] font-semibold text-[#172B4C] hover:text-primary transition duration-500">
              Đặt lịch với bác sĩ
            </p>
          </Link>

          <div className="flex flex-col gap-3">
            {menuMobile.map(({ value, label }) => (
              <Button
                key={value}
                variant="ghost"
                onClick={() => handleToggleMenu(value)}
                className={cn(
                  "group flex items-center justify-between gap-3 text-[15px] font-semibold hover:text-primary p-0 hover:bg-transparent transition duration-500 cursor-pointer select-none",
                  tabActive === value ? "text-primary" : "text-[#172B4C]"
                )}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            className="w-full text-[#2D87F3] font-medium border border-[#2D87F3] bg-white hover:bg-[#2D87F3]/10 rounded-md transition duration-500"
          >
            Đăng ký
          </Button>

          <Button
            type="button"
            className="w-full text-white font-medium bg-[#2D87F3] hover:bg-[#2D87F3]/60 rounded-md transition duration-500"
          >
            Đăng nhập
          </Button>
        </div>
      </div>
    </div>
  );
});

MenuMobile.displayName = "MenuMobile";

export default MenuMobile;