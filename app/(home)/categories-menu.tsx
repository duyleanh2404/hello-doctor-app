import { cn } from "@/lib/utils";
import { useCallback, memo } from "react";

import { RootState } from "@/store/store";
import { useSelector } from "react-redux";

import { IoClose } from "react-icons/io5";
import { FaAngleRight } from "react-icons/fa6";

import { Button } from "@/components/ui/button";
import { MenuState } from "@/types/header-types";

import Link from "next/link";
import Image from "next/image";
import Hint from "@/components/hint";
import centralPoints from "@/constants/central-points";

interface CategoriesMenuProps {
  tabActive: string | null;
  setMenuState: React.Dispatch<React.SetStateAction<MenuState>>;
};

const CategoriesMenu = memo(({ tabActive, setMenuState }: CategoriesMenuProps) => {
  const { isBannerVisible } = useSelector((state: RootState) => state.common);

  // Function to close the categories menu
  const handleCloseMenu = useCallback(() => {
    setMenuState((prev) => ({ ...prev, tabActive: null })); // Update state to close the menu
  }, [setMenuState]);

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 w-full h-screen xl:h-[calc(100%-65px)] bg-white transition-opacity duration-500",
        // Adjust opacity and pointer events based on active tab state
        tabActive === "categories" ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        // Adjust top position based on banner visibility
        isBannerVisible ? "xl:top-[120px]" : "xl:top-[65px]"
      )}
    >
      {/* Main wrapper for the menu */}
      <div className="wrapper h-full flex flex-col md:flex-row gap-10 md:gap-6 py-6 overflow-y-auto">
        {/* Left side: Health categories */}
        <div className="w-full md:w-[40%] lg:w-[25%] h-full flex flex-col gap-6 md:border-r">
          <div className="w-full flex items-center justify-between">
            {/* Section title */}
            <h1 className="text-lg font-semibold">Chuyên mục sức khỏe</h1>

            {/* Button to close the menu on smaller screens */}
            <Button
              variant="ghost"
              onClick={handleCloseMenu}
              aria-label="Close categories menu"
              className="block md:hidden p-0 hover:bg-transparent hover:opacity-50 transition duration-500"
            >
              <IoClose size={25} className="text-primary" />
            </Button>
          </div>

          {/* List of specialties */}
          <div className="max-h-[400px] flex flex-col gap-3 -pr-3 mr-3 overflow-y-auto">
            {/* Fetch and display specialties here */}
          </div>

          {/* Link to view all categories */}
          <Link
            href="/categories"
            className="group w-fit flex items-center gap-4 text-sm xl:text-base font-semibold text-primary py-3 px-4 border border-primary rounded-md"
          >
            Xem tất cả chuyên khoa
            <FaAngleRight
              size={15}
              className="group-hover:translate-x-2 transition-transform duration-500"
            />
          </Link>
        </div>

        {/* Right side: Central points */}
        <div className="flex-1 h-fit flex flex-col gap-8">
          <div className="w-full flex items-center justify-between">
            {/* Section title */}
            <h1 className="text-lg font-semibold">Tâm điểm</h1>

            {/* Button to close the menu on larger screens */}
            <Button
              variant="ghost"
              onClick={handleCloseMenu}
              aria-label="Close central points menu"
              className="hidden md:block h-fit p-0 hover:bg-transparent hover:opacity-50 transition duration-500"
            >
              <IoClose size={25} className="text-primary" />
            </Button>
          </div>

          {/* List of central points */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {centralPoints.map(({ id, href, image }) => ( // Map through central points data
              <Link
                key={id}
                href={`/central-point/${href}`}
                className="relative w-full pt-[140%]"
              >
                <Hint label="Xem chi tiết">
                  <Image
                    loading="lazy"
                    src={image}
                    alt="Central point image"
                    fill
                    className="w-full h-full object-cover rounded-xl shadow-xl hover:shadow-2xl transition-all duration-500"
                  />
                </Hint>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

export default CategoriesMenu;