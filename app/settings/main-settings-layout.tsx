"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Cookies from "js-cookie";
import toast from "react-hot-toast";

import { RootState } from "@/store/store";
import { setIsInfoChanged, setUser } from "@/store/slices/settings-slice";

import { getCurrentUser } from "@/services/user-serivce";

import MobileMenu from "./mobile-menu";
import ProfileMenu from "./profile-menu";
import Spinner from "@/components/spinner";

const MainSettingsLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const dispatch = useDispatch();

  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const { user, isInfoChanged } = useSelector((state: RootState) => state.settings);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!isLoggedIn) return;

      const accessToken = Cookies.get("access_token");
      if (!accessToken) return;

      try {
        const userData = await getCurrentUser(accessToken);
        dispatch(setUser(userData.user));
      } catch (error: any) {
        toast.error("Có lỗi xảy ra. Vui lòng thử lại sau ít phút nữa!");
      } finally {
        dispatch(setIsInfoChanged(false));
      }
    };

    fetchCurrentUser();
  }, [isInfoChanged]);

  if (!user || isInfoChanged) {
    return <Spinner center />;
  }

  return (
    <div className="bg-[#f8f9fc]">
      <div className="relative wrapper flex items-start gap-10 py-3 sm:py-8">
        <ProfileMenu />
        <div className="flex-1 pb-16 sm:pb-0">
          {children}
        </div>
      </div>
      <MobileMenu />
    </div>
  );
};

export default MainSettingsLayout;