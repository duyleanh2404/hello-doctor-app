import Autoplay from "embla-carousel-autoplay";
import { PiTrendUpDuotone } from "react-icons/pi";

import Link from "next/link";
import Image from "next/image";

import {
  Carousel,
  CarouselContent,
  CarouselItem
} from "@/components/ui/carousel";

const NewPosts = () => {
  return (
    <div id="featured-articles" className="wrapper flex flex-col gap-12 py-12">
      <div className="w-fit flex items-center gap-3 py-4 px-6 bg-[#E3F2FF] rounded-full cursor-default">
        <PiTrendUpDuotone size="22" className="text-primary" />
        <p className="text-[17px] font-semibold text-primary">Bài viết mới nhất</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 pb-10 border-b-2 border-dashed border-[#ccc]">
        <Link
          href="/posts/post-1"
          className="w-full lg:w-1/2 flex flex-col gap-6"
        >
          <div className="relative w-full pt-[65%]">
            <Image
              loading="lazy"
              src="/post-1.png"
              alt="Post"
              fill
              className="w-full h-full object-cover rounded-md"
            />
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-sm sm:text-[15px] font-bold text-primary">
              Specialty name
            </p>
            <h1 className="text-lg sm:text-xl font-bold line-clamp-2">
              Title
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Image
              loading="lazy"
              src="/avatar-default.png"
              alt="Avatar"
              width="35"
              height="35"
              className="rounded-full"
            />
            <p className="text-sm sm:text-[15px]">
              Tham vấn y khoa: {""}
              <span className="font-semibold">
                Doctor name
              </span>
            </p>
          </div>
        </Link>

        <div className="w-full lg:flex-1 hidden lg:flex flex-row lg:flex-col justify-between gap-6 lg:gap-0">
          {[1, 2, 3].map((_, index) => (
            <Link
              key={index}
              href="/posts/post-1"
              className="w-1/2 lg:w-auto flex flex-col lg:flex-row-reverse gap-6"
            >
              <div className="relative flex-1 pt-[55%] lg:pt-[28%]">
                <Image
                  loading="lazy"
                  src="/post-1.png"
                  alt="Post"
                  fill
                  className="w-full h-full object-cover rounded-md"
                />
              </div>

              <div className="flex-1 flex flex-col gap-4">
                <div className="flex flex-col gap-3">
                  <p className="text-sm font-bold text-primary">
                    Specialty name
                  </p>
                  <h1 className="text-lg font-bold line-clamp-2">
                    Title
                  </h1>
                </div>

                <div className="flex items-center gap-3">
                  <Image
                    loading="lazy"
                    src="/avatar-default.png"
                    alt="Avatar"
                    width="35"
                    height="35"
                    className="rounded-full"
                  />
                  <p className="text-sm">
                    Tham vấn y khoa: {""}
                    <span className="font-semibold">
                      Doctor name
                    </span>
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="flex md:hidden flex-col gap-8">
        {[1, 2, 3].map((_, index) => (
          <Link
            key={index}
            href="/posts/post-1"
            className="flex items-center gap-6 pb-6"
          >
            <div className="relative w-[40%] pt-[30%]">
              <Image
                loading="lazy"
                src="/post-1.png"
                alt="Post"
                fill
                className="w-full h-full object-cover rounded-md"
              />
            </div>

            <div className="flex-1 flex flex-col gap-2">
              <p className="text-sm font-bold text-primary">
                Specialty name
              </p>
              <h1 className="font-bold line-clamp-2">
                Title
              </h1>

              <div className="flex items-center gap-3">
                <Image
                  loading="lazy"
                  src="/avatar-default.png"
                  alt="Avatar"
                  width="35"
                  height="35"
                  className="rounded-full"
                />
                <p className="text-sm line-clamp-2">
                  Tham vấn y khoa: {""}
                  <span className="font-semibold">
                    Doctor name
                  </span>
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="hidden md:block">
        <Carousel
          className="w-full"
          plugins={[
            Autoplay({
              delay: 3000
            })
          ]}
        >
          <CarouselContent>
            {[1, 2, 3, 4, 5].map((_, index) => (
              <CarouselItem key={index} className="basis-1/3 xl:basis-1/4">
                <Link href="/posts/post-1" className="flex flex-col gap-6">
                  <div className="relative w-full pt-[60%]">
                    <Image
                      loading="lazy"
                      src="/post-1.png"
                      alt="Post"
                      fill
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>

                  <div className="flex flex-col gap-3">
                    <p className="text-[15px] font-bold text-primary">
                      Specialty name
                    </p>
                    <h1 className="text-lg font-bold line-clamp-2">
                      Title
                    </h1>
                  </div>

                  <div className="flex items-center gap-3">
                    <Image
                      loading="lazy"
                      src="/avatar-default.png"
                      alt="Avatar"
                      width="35"
                      height="35"
                      className="rounded-full"
                    />
                    <p className="text-sm">
                      Tham vấn y khoa: {""}
                      <span className="font-semibold">
                        Doctor data
                      </span>
                    </p>
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
};

export default NewPosts;