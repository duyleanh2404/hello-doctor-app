import { useCallback, memo } from "react";
import { cn } from "@/lib/utils";

import { IoClose } from "react-icons/io5";
import { FaAngleRight } from "react-icons/fa6";

import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { MenuState } from "@/types/header-types";
import toolsCheck from "@/constants/tools-check";


interface HealthCheckMenuProps {
  tabActive: string | null;
  setMenuState: React.Dispatch<React.SetStateAction<MenuState>>;
}

const HealthCheckMenu = memo(({ tabActive, setMenuState }: HealthCheckMenuProps) => {
  const handleCloseMenu = useCallback(() => {
    setMenuState((prev) => ({ ...prev, tabActive: null }));
  }, [setMenuState]);

  return (
    <div
      className={cn(
        "fixed top-0 xl:top-[65px] left-0 right-0 w-full h-screen xl:h-[calc(100%-65px)] bg-white transition duration-500",
        tabActive === "health-check" ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}
    >
      <div className="wrapper h-full flex flex-col md:flex-row gap-10 md:gap-6 py-6 overflow-y-auto">
        <div className="w-full md:w-[40%] lg:w-[30%] h-full flex flex-col gap-8 md:border-r">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold">Công cụ sức khỏe</h1>
            <Button
              variant="ghost"
              onClick={handleCloseMenu}
              aria-label="Close health tools menu"
              className="block md:hidden p-0 hover:bg-transparent hover:opacity-50 transition duration-500"
            >
              <IoClose size={25} className="text-primary" />
            </Button>
          </div>

          <div className="max-h-[500px] flex flex-col gap-3 -pr-3 mr-3 overflow-y-auto">
            <div className="flex flex-col gap-6 cursor-pointer select-none">
              {toolsCheck.slice(0, 5).map(({ id, href, image, title }) => (
                <Link
                  key={id}
                  href={href}
                  className="group flex items-center gap-3"
                >
                  <Image
                    loading="lazy"
                    src={image}
                    alt={title}
                    width={50}
                    height={50}
                    className="object-cover"
                  />
                  <p className="w-full h-full flex items-center text-[15px] font-medium px-4 text-start group-hover:text-primary transition-colors duration-500">
                    {title}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          <Link
            href="/health-tools"
            className="group w-fit flex items-center gap-4 text-sm xl:text-base font-semibold text-primary py-3 px-4 border border-primary rounded-md"
          >
            Xem tất cả công cụ
            <FaAngleRight size={15} className="group-hover:translate-x-2 transition-transform duration-500" />
          </Link>
        </div>

        <div className="flex-1 h-full flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold">Công cụ nổi bật</h1>
            <Button
              variant="ghost"
              onClick={handleCloseMenu}
              aria-label="Close featured tools menu"
              className="hidden md:block h-fit p-0 hover:bg-transparent hover:opacity-50 transition duration-500"
            >
              <IoClose size={25} className="text-primary" />
            </Button>
          </div>

          <div className="h-full xl:h-auto grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 pb-6 md:pb-0 pr-4 xl:pr-0 overflow-y-auto xl:overflow-y-visible">
            {toolsCheck.slice(5).map(({ id, href, image, title, desc }) => (
              <Link
                key={id}
                href={href}
                className="flex flex-col justify-between gap-8 py-6 px-4 border shadow-md hover:shadow-lg rounded-xl transition-all duration-500"
              >
                <div className="flex flex-col gap-8">
                  <Image
                    loading="lazy"
                    src={image}
                    alt={title}
                    width={70}
                    height={70}
                    className="ml-auto"
                  />

                  <div className="flex flex-col gap-3 text-start">
                    <h1 className="text-[17px] font-semibold">{title}</h1>
                    <p className="text-sm font-medium text-[#172B4C] line-clamp-2">{desc}</p>
                  </div>
                </div>

                <div className="group flex items-center gap-3 mr-auto font-semibold text-primary">
                  Xem thêm
                  <FaAngleRight size={15} className="group-hover:translate-x-2 transition-transform duration-500" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

HealthCheckMenu.displayName = "HealthCheckMenu";

export default HealthCheckMenu;