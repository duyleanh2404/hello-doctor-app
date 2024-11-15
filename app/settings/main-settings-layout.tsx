"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

import MobileMenu from "./mobile-menu";
import ProfileMenu from "./profile-menu";
import Spinner from "@/components/spinner";

const MainSettingsLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);

  if (!isLoggedIn) {
    return <Spinner center />;
  }

  return (
    <div className="bg-[#f8f9fc]">
      <div className="relative wrapper flex items-start gap-10 py-3 sm:py-8">
        <ProfileMenu />
        <div className="flex-1 pb-16 sm:pb-0">{children}</div>
      </div>
      <MobileMenu />
    </div>
  );
};

export default MainSettingsLayout;