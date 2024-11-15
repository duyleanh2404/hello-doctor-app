import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef, memo } from "react";
import Image from "next/image";

import { FiSearch } from "react-icons/fi";
import NProgress from "nprogress";
import toast from "react-hot-toast";
import "nprogress/nprogress.css";

import { Province } from "@/types/auth-types";
import { DoctorData } from "@/types/doctor-types";
import { SpecialtyData } from "@/types/specialty-types";
import { getAllDoctors } from "@/services/doctor-service";

import useDebounce from "@/hooks/use-debounce";
import useSpecialties from "@/hooks/fetch/use-specialties";
import useClickOutside from "@/hooks/use-click-outside";

import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/spinner";

const SearchDoctor = memo(({ provinces }: { provinces: Province[] }) => {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);
  const [isLoading, setLoading] = useState({ doctors: false, routing: false });

  const [doctors, setDoctors] = useState<DoctorData[]>([]);
  const { specialties, isLoading: isLoadingSpecialties } = useSpecialties("desc");

  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("");
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorData | null>(null);

  const [query, setQuery] = useState<string>("");
  const debouncedQuery = useDebounce(query, 500);

  useClickOutside(dropdownRef, () => setIsDropdownVisible(false));

  useEffect(() => {
    if (selectedProvince || selectedSpecialty) setIsDropdownVisible(true);

    const fetchDoctors = async () => {
      setLoading({ ...isLoading, doctors: true });

      try {
        const { doctors } = await getAllDoctors({
          query: debouncedQuery,
          specialty_id: selectedSpecialty,
          exclude: "specialty_id, clinic_id, desc",
          province: selectedProvince
        });
        setDoctors(doctors);
      } catch (error: any) {
        console.error(error);
        toast.error("Có lỗi xảy ra. Vui lòng thử lại sau ít phút nữa!");
      } finally {
        setLoading({ ...isLoading, doctors: false });
      }
    };
    fetchDoctors();
  }, [debouncedQuery, selectedProvince, selectedSpecialty]);

  const handleRoute = () => {
    NProgress.start();
    setLoading({ ...isLoading, routing: true });
    if (selectedDoctor?._id) router.push(`/doctor-details/${btoa(selectedDoctor._id)}`);
  };

  return (
    <div className="wrapper p-6 sm:p-8 bg-white shadow-md rounded-b-2xl">
      <div className="flex flex-col lg:flex-row items-center gap-4">
        <div className="w-full lg:w-[18%]">
          <Select value={selectedProvince} onValueChange={(value) => setSelectedProvince(value)}>
            <SelectTrigger
              className={cn(
                "w-full py-[14px] px-4 text-[17px] placeholder:text-[17px] placeholder:text-[#595959] placeholder:font-medium border border-gray-300 focus:border-primary focus:shadow-input-primary rounded-lg transition duration-500",
                selectedProvince ? "text-black" : "text-[#A9A9A9]"
              )}
            >
              <SelectValue placeholder="Chọn tỉnh thành" />
            </SelectTrigger>
            <SelectContent>
              {provinces?.length > 0 ? (
                <>
                  <SelectItem value="all">Tất cả</SelectItem>
                  {provinces?.map((province: any) => (
                    <SelectItem key={province?.id} value={province?.name}>{province?.name}</SelectItem>
                  ))}
                </>
              ) : (
                <p className="text-[15px] font-medium text-[#595959] text-center py-4 px-2 mx-auto">
                  Không tìm thấy tỉnh thành nào!
                </p>
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full lg:w-[18%]">
          <Select value={selectedSpecialty} onValueChange={(value) => setSelectedSpecialty(value)}>
            <SelectTrigger
              className={cn(
                "w-full py-[14px] px-4 text-[17px] placeholder:text-[17px] placeholder:text-[#595959] placeholder:font-medium border border-gray-300 focus:border-primary focus:shadow-input-primary rounded-lg transition duration-500",
                selectedSpecialty ? "text-black" : "text-[#A9A9A9]"
              )}
            >
              <SelectValue placeholder="Chọn chuyên khoa" />
            </SelectTrigger>
            <SelectContent>
              {isLoadingSpecialties ? (
                <div className="py-6"><Spinner table /></div>
              ) : (
                specialties?.length > 0 ? (
                  <>
                    <SelectItem value="all">Tất cả</SelectItem>
                    {specialties?.map((specialty: SpecialtyData) => (
                      <SelectItem key={specialty?._id} value={specialty?._id}>
                        <div className="w-full flex items-center justify-start gap-3 hover:text-primary transition duration-500 cursor-pointer">
                          <Image
                            loading="lazy"
                            src={specialty?.image}
                            alt={specialty?.name}
                            width="30"
                            height="30"
                            className="object-cover rounded-full"
                          />
                          <p className="w-fit font-medium text-ellipsis overflow-hidden">{specialty?.name}</p>
                        </div>
                      </SelectItem>
                    ))}
                  </>
                ) : (
                  <p className="text-[15px] font-medium text-[#595959] text-center py-4 px-2 mx-auto">
                    Không tìm thấy chuyên khoa nào!
                  </p>
                )
              )}
            </SelectContent>
          </Select>
        </div>

        <div ref={dropdownRef} className="relative w-full lg:w-auto flex-1">
          <FiSearch
            size="22"
            className="absolute top-1/2 left-5 -translate-y-1/2 text-[#595959]"
          />
          <Input
            value={selectedDoctor ? selectedDoctor?.fullname : query}
            type="text"
            spellCheck={false}
            placeholder="Tìm kiếm theo tên bác sĩ"
            onFocus={() => setIsDropdownVisible(true)}
            onChange={(event) => {
              setQuery(event.target.value);
              if (selectedDoctor) setSelectedDoctor(null);
            }}
            className="pl-14"
          />

          <div
            onClick={(event) => event.stopPropagation()}
            className={cn(
              "absolute top-[calc(100%+10px)] left-0 w-full max-h-[400px] py-2 bg-white border rounded-lg shadow-md z-10 transition duration-500 overflow-y-auto select-none",
              isDropdownVisible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            )}
          >
            {isLoading.doctors ? (
              <Spinner table className="py-12" />
            ) : (
              doctors?.length > 0 ? (
                doctors?.map((doctor: DoctorData) => (
                  <Button
                    type="button"
                    variant="ghost"
                    key={doctor?._id}
                    onClick={() => {
                      setSelectedDoctor(doctor);
                      setIsDropdownVisible(false);
                    }}
                    className="w-full h-14 flex items-center justify-start gap-4 hover:text-primary transition duration-500"
                  >
                    <Image
                      loading="lazy"
                      src={doctor?.image}
                      alt={doctor?.fullname}
                      width="30"
                      height="30"
                      className="object-cover rounded-full"
                    />
                    <p className="w-fit font-medium text-ellipsis overflow-hidden">{doctor?.fullname}</p>
                  </Button>
                ))
              ) : (
                <p className="text-[15px] font-medium text-[#595959] text-center p-12 mx-auto">
                  Không tìm thấy bác sĩ nào!
                </p>
              )
            )}
          </div>
        </div>

        <Button type="button" size="lg" variant="search" disabled={isLoading.routing} onClick={handleRoute}>
          {isLoading.routing ? "Đang tìm kiếm..." : "Tìm kiếm"}
        </Button>
      </div>
    </div>
  );
});

SearchDoctor.displayName = "SearchDoctor";

export default SearchDoctor;