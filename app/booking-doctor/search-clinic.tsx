"use client";

import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef, memo } from "react";
import Image from "next/image";

import { FiSearch } from "react-icons/fi";
import NProgress from "nprogress";
import toast from "react-hot-toast";
import "nprogress/nprogress.css";

import { Province } from "@/types/auth-types";
import { ClinicData } from "@/types/clinic-types";
import { getAllClinics } from "@/services/clinic-service";

import useDebounce from "@/hooks/use-debounce";
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

const SearchClinic = memo(({ provinces }: { provinces: Province[] }) => {
  const router = useRouter();

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [clinics, setClinics] = useState<ClinicData[]>([]);

  const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);
  const [isLoading, setLoading] = useState({ clinics: false, routing: false });

  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [selectedClinic, setSelectedClinic] = useState<ClinicData | null>(null);

  const [query, setQuery] = useState<string>("");
  const debouncedQuery = useDebounce(query, 500);

  useClickOutside(dropdownRef, () => setIsDropdownVisible(false));

  useEffect(() => {
    if (selectedProvince) setIsDropdownVisible(true);

    const fetchClinics = async () => {
      setLoading({ ...isLoading, clinics: true });

      try {
        const { clinics } = await getAllClinics({
          query: debouncedQuery,
          exclude: "address, desc, banner",
          province: selectedProvince
        });
        setClinics(clinics);
      } catch (error: any) {
        console.error(error);
        toast.error("Có lỗi xảy ra. Vui lòng thử lại sau ít phút nữa!");
      } finally {
        setLoading({ ...isLoading, clinics: false });
      }
    };

    fetchClinics();
  }, [debouncedQuery, selectedProvince]);

  const handleRoute = () => {
    NProgress.start();
    setLoading({ ...isLoading, routing: true });
    if (selectedClinic?._id) router.push(`/clinic-details/${btoa(selectedClinic._id)}`);
  };

  return (
    <div className="wrapper p-6 sm:p-8 bg-white shadow-md rounded-b-2xl">
      <div className="flex flex-col lg:flex-row items-center gap-4">
        <div className="w-full lg:w-[20%]">
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

        <div ref={dropdownRef} className="relative w-full lg:w-auto flex-1">
          <FiSearch size="22" className="absolute top-1/2 left-5 -translate-y-1/2 text-[#595959]" />
          <Input
            value={selectedClinic ? selectedClinic?.name : query}
            type="text"
            spellCheck={false}
            placeholder="Tìm kiếm theo tên bệnh viện/ phòng khám"
            onFocus={() => setIsDropdownVisible(true)}
            onChange={(event) => {
              setQuery(event.target.value);
              if (selectedClinic) setSelectedClinic(null);
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
            {isLoading.clinics ? (
              <Spinner table className="py-12" />
            ) : (
              clinics?.length > 0 ? (
                clinics?.map((clinic: ClinicData) => (
                  <Button
                    type="button"
                    variant="ghost"
                    key={clinic?._id}
                    onClick={() => {
                      setSelectedClinic(clinic);
                      setIsDropdownVisible(false);
                    }}
                    className="w-full h-14 flex items-center justify-start gap-4 hover:text-primary transition duration-500"
                  >
                    <Image
                      loading="lazy"
                      src={clinic?.avatar}
                      alt={clinic?.name}
                      width="30"
                      height="30"
                      className="object-cover rounded-full"
                    />
                    <p className="w-fit font-medium text-ellipsis overflow-hidden">{clinic?.name}</p>
                  </Button>
                ))
              ) : (
                <p className="text-[15px] font-medium text-[#595959] text-center p-12 mx-auto">
                  Không tìm thấy bệnh viện nào!
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

SearchClinic.displayName = "SearchClinic";

export default SearchClinic;