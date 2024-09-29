import Autoplay from "embla-carousel-autoplay";
import { FaAngleRight } from "react-icons/fa6";

import Link from "next/link";
import Image from "next/image";

import {
  Carousel,
  CarouselContent,
  CarouselItem
} from "@/components/ui/carousel";

const PopularSpecialities = () => {
  return (
    <div className="wrapper py-12">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-8 sm:gap-0">
        <h1 className="text-[22px] font-bold text-center sm:text-start">Các chuyên khoa phổ biến</h1>
        <Link
          href="/categories"
          className="group flex items-center gap-2 font-semibold text-primary ml-auto"
        >
          Xem tất cả
          <FaAngleRight
            size="13"
            className="group-hover:translate-x-2 transition duration-500"
          />
        </Link>
      </div>

      <Carousel
        className="w-full mt-10"
        plugins={[
          Autoplay({
            delay: 3000
          })
        ]}
      >
        <CarouselContent>
          {[1, 2, 3, 4, 5, 6].map((_, index) => (
            <CarouselItem key={index} className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/6">
              <Link
                href="specialties/specialty-1"
                className="flex flex-col items-center gap-6 p-4 border shadow-md"
              >
                <Image
                  loading="lazy"
                  src="/specialties/diabetes.png"
                  alt="Specialty"
                  width={110}
                  height={110}
                />
                <p className="h-[55px] flex items-center text-[15px] sm:text-[17px] font-bold text-center">
                  Specialty name
                </p>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default PopularSpecialities;