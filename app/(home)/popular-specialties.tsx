import { useState, useEffect } from "react";
import { FaAngleRight } from "react-icons/fa6";

import {
  Carousel,
  CarouselContent,
  CarouselItem
} from "@/components/ui/carousel";

import Link from "next/link";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";

const PopularSpecialities = () => {
  const [specialties, setSpecialties] = useState<any[]>([]);

  // Fetch specialties data (replace with your real data fetching logic)
  useEffect(() => {
    // Mock data fetching
    const fetchedSpecialties = [
      { id: 1, name: "Diabetes", image: "/specialties/diabetes.png", link: "/specialties/diabetes" },
      // Add more specialties...
    ];
    setSpecialties(fetchedSpecialties);
  }, []);

  return (
    <div className="wrapper py-12">
      {/* Header Section */}
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

      {/* Carousel Section */}
      <Carousel
        className="w-full mt-10"
        plugins={[
          Autoplay({
            delay: 3000 // 3-second autoplay delay
          })
        ]}
      >
        <CarouselContent>
          {specialties.map((specialty) => (
            <CarouselItem
              key={specialty.id}
              className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/6"
            >
              {/* Each specialty links to its own page */}
              <Link
                href={specialty.link}
                className="flex flex-col items-center gap-6 p-4 border shadow-md"
              >
                <Image
                  loading="lazy"
                  src={specialty.image}
                  alt={specialty.name}
                  width={110}
                  height={110}
                />
                <p className="h-[55px] flex items-center text-[15px] sm:text-[17px] font-bold text-center">
                  {specialty.name}
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