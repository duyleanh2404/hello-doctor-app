import { memo } from "react";
import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";

import NProgress from "nprogress";
import "nprogress/nprogress.css";

import { IoClose } from "react-icons/io5";
import { FaAngleRight } from "react-icons/fa6";

import { RootState } from "@/store/store";
import { SpecialtyData } from "@/types/specialty-types";
import { centralPoints } from "@/constants/central-points";
import useSpecialties from "@/hooks/fetch/use-specialties";

import { Button } from "@/components/ui/button";
import Hint from "@/components/hint";
import Spinner from "@/components/spinner";

type MenuState = {
  tabActive: string | null;
  isOpenMenuMobile: boolean;
};

interface IProps {
  tabActive: string | null;
  setMenuState: React.Dispatch<React.SetStateAction<MenuState>>;
};

const CategoriesMenu = memo(({ tabActive, setMenuState }: IProps) => {
  const { specialties, isLoading } = useSpecialties("desc");
  const { isBannerVisible } = useSelector((state: RootState) => state.common);

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 w-full h-screen xl:h-[calc(100%-65px)] bg-white transition-opacity duration-500",
        tabActive === "categories" ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        isBannerVisible ? "xl:top-[120px]" : "xl:top-[65px]"
      )}
    >
      <div className="wrapper h-full flex flex-col md:flex-row gap-10 md:gap-6 py-6 overflow-y-auto">
        <div className="w-full md:w-[40%] lg:w-[25%] h-full flex flex-col items-center sm:items-start gap-6 md:border-r">
          <div className="w-full flex items-center justify-between">
            <h1 className="text-lg font-semibold">Chuyên mục sức khỏe</h1>
            <Button
              variant="ghost"
              onClick={() => setMenuState((prev) => ({ ...prev, tabActive: null }))}
              className="block md:hidden p-0 hover:bg-transparent hover:opacity-50 transition duration-500"
            >
              <IoClose size={25} className="text-primary" />
            </Button>
          </div>

          <div className="w-full max-h-[55vh] flex flex-col gap-3 pr-3 overflow-y-auto">
            {isLoading ? (
              <div className="py-24"><Spinner table /></div>
            ) : (
              specialties?.length > 0 ? (
                specialties?.map((specialty: SpecialtyData) => (
                  <Link
                    key={specialty?._id}
                    href={`/specialties/${btoa(specialty?._id)}`}
                    onClick={() => NProgress.start()}
                    className="w-full flex items-center p-2 hover:bg-[#e3f2ff] rounded-md cursor-pointer transition duration-500"
                  >
                    <Image loading="lazy" src={specialty?.image} alt="Specialty" width={40} height={40} />
                    <h1 className="w-full h-full flex items-center text-[17px] font-medium pl-4 hover:text-primary transition-colors duration-500">
                      {specialty?.name}
                    </h1>
                  </Link>
                ))
              ) : (
                <p className="text-[15px] font-medium text-[#595959] text-center py-4 px-2 mx-auto">
                  Không tìm thấy chuyên khoa nào!
                </p>
              )
            )}
          </div>

          <Link
            href="/specialties"
            onClick={() => {
              NProgress.start();
              setMenuState((prev) => ({ ...prev, tabActive: null }));
            }}
            className="group w-fit flex items-center gap-4 text-sm xl:text-base font-semibold text-primary py-3 px-4 border border-primary rounded-md"
          >
            Xem tất cả chuyên khoa
            <FaAngleRight
              size={15}
              className="group-hover:translate-x-2 transition-transform duration-500"
            />
          </Link>
        </div>

        <div className="flex-1 h-fit flex flex-col gap-8">
          <div className="w-full flex items-center justify-between">
            <h1 className="text-lg font-semibold">Tâm điểm</h1>
            <Button
              variant="ghost"
              onClick={() => setMenuState((prev) => ({ ...prev, tabActive: null }))}
              className="hidden md:block h-fit p-0 hover:bg-transparent hover:opacity-50 transition duration-500"
            >
              <IoClose size={25} className="text-primary" />
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {centralPoints.map(({ id, image }) => (
              <Link key={id} href="/" className="relative w-full pt-[140%]" >
                <Hint label="Xem chi tiết">
                  <Image
                    loading="lazy"
                    src={image}
                    alt="Central Point"
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

CategoriesMenu.displayName = "CategoriesMenu";

export default CategoriesMenu;