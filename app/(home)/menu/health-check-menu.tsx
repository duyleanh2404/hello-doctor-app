import { memo } from "react";
import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";

import { IoClose } from "react-icons/io5";
import { FaAngleRight } from "react-icons/fa6";

import { RootState } from "@/store/store";
import { toolsCheck } from "@/constants/tools-check";

import { Button } from "@/components/ui/button";

interface MenuState {
  tabActive: string | null;
  isOpenMenuMobile: boolean;
};

interface HealthCheckMenuProps {
  tabActive: string | null;
  setMenuState: React.Dispatch<React.SetStateAction<MenuState>>;
};

const HealthCheckMenu = memo(({ tabActive, setMenuState }: HealthCheckMenuProps) => {
  const { isBannerVisible } = useSelector((state: RootState) => state.common);

  return (
    <div className={cn(
      "fixed top-0 left-0 right-0 w-full h-screen xl:h-[calc(100%-65px)] bg-white transition duration-500",
      tabActive === "health-check" ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
      isBannerVisible ? "xl:top-[120px]" : "xl:top-[65px]"
    )}>
      <div className="wrapper h-full flex flex-col md:flex-row gap-10 md:gap-6 py-6 overflow-y-auto">
        <div className="w-full md:w-[40%] lg:w-[30%] h-full flex flex-col items-center sm:items-start gap-8 md:border-r">
          <div className="w-full flex items-center justify-between">
            <h1 className="text-lg font-semibold">Công cụ sức khỏe</h1>
            <Button
              variant="ghost"
              onClick={() => setMenuState((prev) => ({ ...prev, tabActive: null }))}
              className="block md:hidden p-0 hover:bg-transparent hover:opacity-50 transition duration-500"
            >
              <IoClose size={25} className="text-primary" />
            </Button>
          </div>

          <div className="max-h-[50vh] flex flex-col gap-3 -pr-3 mr-3 overflow-y-auto">
            <div className="flex flex-col gap-3 cursor-pointer select-none">
              {toolsCheck.slice(0, 5).map(({ id, image, title }) => (
                <Link
                  key={id}
                  href="/"
                  className="w-full flex items-center p-2 hover:text-primary hover:bg-[#e3f2ff] rounded-md cursor-pointer transition duration-500"
                >
                  <Image
                    loading="lazy"
                    src={image}
                    alt="Tools Check"
                    width={50}
                    height={50}
                    className="object-cover"
                  />

                  <p className="w-full h-full flex items-center text-[15px] font-medium px-4 text-start">
                    {title}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          <Link
            href="/"
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
              onClick={() => setMenuState((prev) => ({ ...prev, tabActive: null }))}
              className="hidden md:block h-fit p-0 hover:bg-transparent hover:opacity-50 transition duration-500"
            >
              <IoClose size={25} className="text-primary" />
            </Button>
          </div>

          <div className="h-full xl:h-auto grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 pb-6 md:pb-0 pr-4 xl:pr-0 overflow-y-auto xl:overflow-y-visible">
            {toolsCheck.slice(5).map(({ id, image, title, desc }) => (
              <div
                key={id}
                className="flex flex-col justify-between gap-8 py-6 px-4 border shadow-md hover:shadow-lg rounded-xl transition-all duration-500"
              >
                <div className="flex flex-col gap-8">
                  <Image
                    loading="lazy"
                    src={image}
                    alt="Tools Check"
                    width={70}
                    height={70}
                    className="ml-auto"
                  />
                  <div className="flex flex-col gap-3 text-start">
                    <h1 className="text-[17px] font-semibold">{title}</h1>
                    <p className="text-sm font-medium line-clamp-2">{desc}</p>
                  </div>
                </div>

                <Link
                  href="/"
                  className="group flex items-center gap-3 font-semibold text-primary mr-auto"
                >
                  Xem thêm
                  <FaAngleRight size={15} className="group-hover:translate-x-2 transition-transform duration-500" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

export default HealthCheckMenu;