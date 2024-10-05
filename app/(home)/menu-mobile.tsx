import { cn } from "@/lib/utils";
import { useState, memo } from "react";
import { FiSearch } from "react-icons/fi";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import Link from "next/link";
import Image from "next/image";
import menuMobile from "@/constants/menu-mobile";

interface MenuMobileProps {
  isOpenMenu: boolean;
  tabActive: string | null;
  handleToggleMenu: (menuName: string) => void;
};

const MenuMobile = memo(({ isOpenMenu, tabActive, handleToggleMenu }: MenuMobileProps) => {
  const [isFocused, setIsFocused] = useState(false); // State to track if the search input is focused

  return (
    <div className={cn(
      "absolute top-[65px] left-0 right-0 w-full h-[calc(100vh-65px)] p-6 border-t bg-white shadow-sm transition duration-500",
      isOpenMenu ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
    )}>
      <div className="h-full flex flex-col justify-between">
        <div className="flex flex-col gap-8">
          <div className="relative w-full">
            {/* Search icon */}
            <FiSearch
              size="22"
              className={cn(
                "absolute top-1/2 left-4 -translate-y-1/2 transition duration-500",
                isFocused && "text-primary" // Change color when focused
              )}
            />

            {/* Search input */}
            <Input
              type="text"
              spellCheck={false}
              placeholder="Tìm kiếm..."
              onBlur={() => setIsFocused(false)}
              onFocus={() => setIsFocused(true)}
              className="w-full text-[15px] pl-12 pr-4 border focus:border-primary focus:shadow-input-primary transition duration-500"
            />
          </div>

          {/* Link to booking page */}
          <Link href="/booking-doctor" className="w-full flex items-center gap-3">
            <Image
              loading="lazy"
              src="/doctor.svg"
              alt="Doctor"
              width={24}
              height={24}
            />
            <p className="text-[15px] font-semibold hover:text-primary transition duration-500">
              Đặt lịch với bác sĩ
            </p>
          </Link>

          <div className="flex flex-col gap-3">
            {/* Render mobile menu buttons */}
            {menuMobile.map(({ value, label }) => (
              <Button
                key={value}
                variant="ghost"
                onClick={() => handleToggleMenu(value)}
                className={cn(
                  "group flex items-center justify-between gap-3 text-[15px] font-semibold hover:text-primary p-0 hover:bg-transparent transition duration-500 cursor-pointer select-none",
                  tabActive === value && "text-primary"
                )}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Registration button */}
          <Button
            type="button"
            variant="default"
            className="w-full text-[#2D87F3] font-medium border border-[#2D87F3] bg-white hover:bg-[#2D87F3]/10 rounded-md transition duration-500"
          >
            Đăng ký
          </Button>

          {/* Login button */}
          <Button
            type="button"
            variant="default"
            className="w-full text-white font-medium bg-[#2D87F3] hover:bg-[#2D87F3]/60 rounded-md transition duration-500"
          >
            Đăng nhập
          </Button>
        </div>
      </div>
    </div>
  );
});

export default MenuMobile;