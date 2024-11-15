import { cn } from "@/lib/utils";
import { useState, memo } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { FiSearch } from "react-icons/fi";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

import { RootState } from "@/store/store";
import { menuMobile } from "@/constants/menu-mobile";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface IProps {
  isOpenMenu: boolean;
  tabActive: string | null;
  handleToggleMenu: (menuName: string) => void;
};

const MenuMobile = memo(({ isOpenMenu, tabActive, handleToggleMenu }: IProps) => {
  const router = useRouter();

  const [isFocused, setIsFocused] = useState<boolean>(false);

  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const { isBannerVisible } = useSelector((state: RootState) => state.common);

  return (
    <div className={cn(
      "absolute left-0 right-0 w-full p-6 border-t bg-white shadow-sm transition duration-500",
      isBannerVisible ? "h-[calc(100vh-115px)] xl:top-[120px]" : "h-[calc(100vh-65px)] xl:top-[65px]",
      isOpenMenu ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
    )}>
      <div className="h-full flex flex-col justify-between">
        <div className="flex flex-col gap-8">
          <div className="relative w-full">
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
              onBlur={() => setIsFocused(false)}
              onFocus={() => setIsFocused(true)}
              className="pl-12"
            />
          </div>

          <Link href="/booking-doctor" onClick={() => NProgress.start()} className="w-full flex items-center gap-3">
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

        {!isLoggedIn && (
          <div className="w-full flex items-center gap-2">
            <Button
              type="button"
              variant="default"
              onClick={() => {
                NProgress.start();
                router.push("/register");
              }}
              className="flex-1 h-14 text-[#2D87F3] font-medium border border-[#2D87F3] bg-white hover:bg-[#2D87F3]/10 rounded-md transition duration-500"
            >
              Đăng ký
            </Button>

            <Button
              type="button"
              variant="default"
              onClick={() => {
                NProgress.start();
                router.push("/login");
              }}
              className="flex-1 h-14 text-white font-medium bg-[#2D87F3] hover:bg-[#2D87F3]/80 rounded-md transition duration-500"
            >
              Đăng nhập
            </Button>
          </div>
        )}
      </div>
    </div>
  );
});

MenuMobile.displayName = "MenuMobile";

export default MenuMobile; 