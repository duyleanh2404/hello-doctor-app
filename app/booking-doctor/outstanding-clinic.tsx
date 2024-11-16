import { useState, useEffect, memo } from "react";
import Image from "next/image";

import toast from "react-hot-toast";
import Autoplay from "embla-carousel-autoplay";

import { Province } from "@/types/auth-types";
import { ClinicData } from "@/types/clinic-types";
import { getAllClinics } from "@/services/clinic-service";

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
import ClinicCard from "./clinic-card";
import Spinner from "@/components/spinner";
import PaginationSection from "@/components/pagination";
import LazyLoadComponent from "@/components/lazyload-component";

const OutstandingClinic = memo(({ provinces }: { provinces: Province[] }) => {
  const [isLoading, setLoading] = useState<boolean>(false);

  const [clinics, setClinics] = useState<ClinicData[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<string>("");

  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    const fetchClinics = async () => {
      setLoading(true);

      try {
        const provinceFilter = selectedProvince && selectedProvince !== "Tất cả" ? selectedProvince : "all";
        const { clinics, total } = await getAllClinics({
          page: currentPage, limit: 8, exclude: "desc, banner", province: provinceFilter
        });

        const itemsPerPage = 8;
        const totalPages = Math.ceil(total / itemsPerPage);

        setClinics(clinics);
        setTotalPages(totalPages);
      } catch (error: any) {
        console.error(error);
        toast.error("Có lỗi xảy ra. Vui lòng thử lại sau ít phút nữa!");
      } finally {
        setLoading(false);
      }
    };

    fetchClinics();
  }, [currentPage, selectedProvince]);

  if (isLoading) {
    return <Spinner center />;
  }

  return (
    <LazyLoadComponent>
      <div className="wrapper flex flex-col gap-12 pt-12 pb-28">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Image loading="lazy" src="/clinic-icon.svg" alt="Clinic icon" width={25} height={25} />
            <h1 className="text-xl font-bold text-center">Top Bệnh viện/Phòng khám Nổi Bật</h1>
          </div>

          <div className="min-w-[240px]">
            <Select value={selectedProvince} onValueChange={setSelectedProvince}>
              <SelectTrigger className="p-3 bg-white border border-gray-300 hover:border-primary hover:shadow-input-primary rounded-lg transition duration-500 cursor-pointer">
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
            {clinics?.length > 0 ? (
              <div className="grid grid-cols-3 xl:grid-cols-4 gap-6">
                {clinics?.slice(0, 8)?.map((clinic: ClinicData) => <ClinicCard key={clinic?._id} clinic={clinic} />)}
              </div>
            ) : (
              <div className="w-full flex flex-col items-center justify-center gap-12 pt-8">
                <Image loading="lazy" src="/not-found.png" alt="Not found" width="240" height="240" />
                <h1 className="text-xl font-semibold text-[#262626] text-center">
                  Rất tiếc, hiện tại không tìm thấy bệnh viện/ phòng khám nào tại tỉnh thành này!
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

          {clinics?.length > 0 ? (
            <div className="block lg:hidden">
              <Carousel plugins={[Autoplay({ delay: 2000 })]}>
                <CarouselContent>
                  {clinics?.slice(0, 8)?.map((clinic: ClinicData) => (
                    <CarouselItem key={clinic?._id} className="sm:basis-1/2">
                      <ClinicCard clinic={clinic} />
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
                Rất tiếc, hiện tại không tìm thấy bệnh viện/ phòng khám nào tại tỉnh thành này!
              </h1>
            </div>
          )}
        </div>
      </div>
    </LazyLoadComponent>
  );
});

OutstandingClinic.displayName = "OutstandingClinic";

export default OutstandingClinic;