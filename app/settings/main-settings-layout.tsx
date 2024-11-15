"use client";

import MobileMenu from "./mobile-menu";
import ProfileMenu from "./profile-menu";

const MainSettingsLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
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