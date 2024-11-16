import { useState, useEffect, memo } from "react";
import Image from "next/image";

import toast from "react-hot-toast";
import Autoplay from "embla-carousel-autoplay";

import { Province } from "@/types/auth-types";
import { DoctorData } from "@/types/doctor-types";
import { getAllDoctors } from "@/services/doctor-service";

import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger
} from "@/components/ui/select";
import {
  Carousel,
  CarouselItem,
  CarouselContent
} from "@/components/ui/carousel";
import DoctorCard from "./doctor-card";
import Spinner from "@/components/spinner";
import PaginationSection from "@/components/pagination";
import LazyLoadComponent from "@/components/lazyload-component";

interface IProps {
  provinces: Province[],
  specialty_id?: string;
};

const OutstandingDoctor = memo(({ provinces, specialty_id }: IProps) => {
  const [isLoading, setLoading] = useState<boolean>(false);

  const [doctors, setDoctors] = useState<DoctorData[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<string>("");

  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);

      try {
        const provinceFilter = selectedProvince && selectedProvince !== "Tất cả" ? selectedProvince : "all";
        const { doctors, total } = await getAllDoctors({
          page: currentPage,
          limit: 8,
          exclude: "desc",
          province: provinceFilter,
          ...(specialty_id && { specialty_id: atob(specialty_id) })
        });

        const itemsPerPage = 8;
        const totalPages = Math.ceil(total / itemsPerPage);

        setDoctors(doctors);
        setTotalPages(totalPages);
      } catch (error: any) {
        console.error(error);
        toast.error("Có lỗi xảy ra. Vui lòng thử lại sau ít phút nữa!");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [currentPage, selectedProvince, specialty_id]);

  if (isLoading) {
    return <Spinner center />;
  }

  return (
    <LazyLoadComponent>
      <div className="wrapper flex flex-col gap-12 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Image loading="lazy" src="/clinic-icon.svg" alt="Clinic icon" width={25} height={25} />
            <h1 className="text-xl font-bold text-center">Top Bác sĩ nổi bật</h1>
          </div>

          <div className="min-w-[240px]">
            <Select value={selectedProvince} onValueChange={setSelectedProvince}>
              <SelectTrigger className="p-3 bg-white border border-[#ccc] hover:border-primary hover:shadow-input-primary rounded-lg transition duration-500 cursor-pointer">
                <span>{selectedProvince || "Tất cả vị trí"}</span>
              </SelectTrigger>
              <SelectContent>
                {provinces?.length > 0 ? (
                  <>
                    <SelectItem value="Tất cả">Tất cả</SelectItem>
                    {provinces?.map((province: any) => (
                      <SelectItem key={province?.id} value={province?.name}>{province?.name}</SelectItem>
                    ))}
                  </>
                ) : (
                  <p className="text-sm font-medium text-[#595959] text-center py-4 px-2 mx-auto">
                    Không tìm thấy tỉnh thành nào!
                  </p>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-col gap-6 sm:gap-12">
          <div className="hidden lg:flex flex-col gap-6">
            {doctors?.length > 0 ? (
              <div className="grid grid-cols-3 xl:grid-cols-4 gap-6">
                {doctors?.slice(0, 8)?.map((doctor: DoctorData) => <DoctorCard key={doctor?._id} doctor={doctor} />)}
              </div>
            ) : (
              <div className="w-full flex flex-col items-center justify-center gap-12 pt-8">
                <Image loading="lazy" src="/not-found.png" alt="Not found" width="240" height="240" />
                <h1 className="text-xl font-semibold text-[#262626] text-center">
                  Rất tiếc, hiện tại không tìm thấy bác sĩ nào tại tỉnh thành này!
                </h1>
              </div>
            )}

            {totalPages > 1 && (
              <div className="sm:ml-auto">
                <PaginationSection
                  totalPages={totalPages}
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>

          {doctors?.length > 0 ? (
            <div className="block lg:hidden">
              <Carousel plugins={[Autoplay({ delay: 2000 })]}>
                <CarouselContent>
                  {doctors?.slice(0, 8)?.map((doctor: DoctorData) => (
                    <CarouselItem key={doctor?._id} className="sm:basis-1/2">
                      <DoctorCard doctor={doctor} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>

              {totalPages > 1 && (
                <div className="pt-10">
                  <PaginationSection
                    totalPages={totalPages}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="w-full flex lg:hidden flex-col items-center justify-center gap-12 pt-8">
              <Image loading="lazy" src="/not-found.png" alt="Not found" width="240" height="240" />
              <h1 className="text-xl font-semibold text-[#262626] text-center">
                Rất tiếc, hiện tại không tìm thấy bác sĩ nào tại tỉnh thành này!
              </h1>
            </div>
          )}
        </div>
      </div>
    </LazyLoadComponent>
  );
});

OutstandingDoctor.displayName = "OutstandingDoctor";

export default OutstandingDoctor;