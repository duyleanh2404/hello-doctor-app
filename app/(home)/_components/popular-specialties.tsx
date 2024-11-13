import Link from "next/link";
import Image from "next/image";

import { FaAngleRight } from "react-icons/fa6";
import NProgress from "nprogress";
import Autoplay from "embla-carousel-autoplay";
import "nprogress/nprogress.css";

import { SpecialtyData } from "@/types/specialty-types";
import useSpecialties from "@/hooks/fetch/use-specialties";

import {
  Carousel,
  CarouselContent,
  CarouselItem
} from "@/components/ui/carousel";
import Spinner from "@/components/spinner";
import LazyLoadComponent from "@/components/lazyload-component";

const PopularSpecialities = () => {
  const { specialties, isLoading } = useSpecialties("desc");

  if (isLoading) {
    return <Spinner center />;
  }

  return (
    <LazyLoadComponent>
      <div className="wrapper py-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-8 sm:gap-0">
          <h1 className="text-[22px] font-bold text-center sm:text-start">
            Các chuyên khoa phổ biến
          </h1>
          <Link
            href="/specialties"
            className="group flex items-center gap-2 font-semibold text-primary ml-auto"
          >
            Xem tất cả
            <FaAngleRight
              size="13"
              className="group-hover:translate-x-2 transition duration-500"
            />
          </Link>
        </div>

        {specialties?.length > 0 ? (
          <Carousel
            className="w-full mt-10"
            plugins={[Autoplay({ delay: 3000 })]}
          >
            <CarouselContent>
              {specialties?.map((specialty: SpecialtyData) => (
                <CarouselItem
                  key={specialty?._id}
                  onClick={() => NProgress.start()}
                  className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/6"
                >
                  <Link
                    href={`/specialties/${btoa(specialty?._id)}`}
                    className="flex flex-col items-center gap-6 p-4 border shadow-md rounded-xl"
                  >
                    <Image
                      loading="lazy"
                      src={specialty?.image}
                      alt="Specialty"
                      width={110}
                      height={110}
                    />
                    <p className="h-[55px] flex items-center text-[15px] sm:text-[17px] font-bold text-center">
                      {specialty?.name}
                    </p>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        ) : (
          <div className="w-full flex flex-col items-center justify-center gap-12 pt-8">
            <Image
              loading="lazy"
              src="/not-found.png"
              alt="Not found"
              width="240"
              height="240"
            />
            <h1 className="text-xl font-semibold text-[#262626] text-center">
              Rất tiếc, hiện tại không tìm thấy chuyên khoa nào!
            </h1>
          </div>
        )}
      </div>
    </LazyLoadComponent>
  );
};

export default PopularSpecialities;