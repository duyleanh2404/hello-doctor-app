import { FaAngleRight } from "react-icons/fa6";

import Link from "next/link";
import Image from "next/image";

const SpecialistArticle = () => {
  return (
    <div className="wrapper w-full xl:w-[55%] flex flex-col gap-14">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Ung thư - Ung bướu</h1>
          <Link
            href="/specialties/specialty-1"
            className="flex items-center gap-2 text-[15px] font-medium text-primary"
          >
            Xem thêm <FaAngleRight size="14" />
          </Link>
        </div>

        <div className="flex flex-col gap-8">
          {[1, 2, 3].map((_, index) => (
            <Link
              key={index}
              href="/posts/post-1"
              className="flex items-center gap-4 sm:gap-6"
            >
              <div className="relative flex-shrink-0 w-[160px] h-[100px] sm:w-[180px] sm:h-[120px] sm:pt-[25%] sm:pl-[40%]">
                <Image
                  loading="lazy"
                  src="/post-1.png"
                  alt="Image"
                  fill
                  className="w-full h-full object-cover rounded-md"
                />
              </div>

              <div className="flex flex-col gap-2 sm:gap-6">
                <div className="flex flex-col gap-1 sm:gap-2">
                  <p className="text-[13px] sm:text-[15px] font-bold text-primary">
                    Specialty name
                  </p>
                  <h1 className="text-sm sm:text-xl font-bold line-clamp-2">
                    Title
                  </h1>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative w-[20px] h-[20px] sm:w-[35px] sm:h-[35px]">
                    <Image
                      loading="lazy"
                      src="/avatar-default.png"
                      alt="Image"
                      fill
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>

                  <p className="text-[12px] sm:text-[15px]">
                    Tham vấn y khoa: {""}
                    <span className="font-semibold">Doctor name</span>
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Tim mạch</h1>
          <Link
            href="/specialties/specialty-1"
            className="flex items-center gap-2 text-[15px] font-medium text-primary"
          >
            Xem thêm <FaAngleRight size="14" />
          </Link>
        </div>

        <div className="flex flex-col gap-8">
          {[1, 2, 3].map((_, index) => (
            <Link
              key={index}
              href="/posts/post-1"
              className="flex items-center gap-4 sm:gap-6"
            >
              <div className="relative flex-shrink-0 w-[160px] h-[100px] sm:w-[180px] sm:h-[120px] sm:pt-[25%] sm:pl-[40%]">
                <Image
                  loading="lazy"
                  src="/post-1.png"
                  alt="Image"
                  fill
                  className="w-full h-full object-cover rounded-md"
                />
              </div>

              <div className="flex flex-col gap-2 sm:gap-6">
                <div className="flex flex-col gap-1 sm:gap-2">
                  <p className="text-[13px] sm:text-[15px] font-bold text-primary">
                    Specialty name
                  </p>
                  <h1 className="text-sm sm:text-xl font-bold line-clamp-2">
                    Title
                  </h1>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative w-[20px] h-[20px] sm:w-[35px] sm:h-[35px]">
                    <Image
                      loading="lazy"
                      src="/avatar-default.png"
                      alt="Image"
                      fill
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>

                  <p className="text-[12px] sm:text-[15px]">
                    Tham vấn y khoa: {""}
                    <span className="font-semibold">Doctor name</span>
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpecialistArticle;