import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

import { FiSearch } from "react-icons/fi";
import toast from "react-hot-toast";

import { getAllDoctors } from "@/services/doctor-service";

import { DoctorData } from "@/types/doctor-types";
import { SpecialtyData } from "@/types/specialty-types";

import useDebounce from "@/hooks/use-debounce";
import useClickOutside from "@/hooks/use-click-outside";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/spinner";

interface SelectDoctorProps {
  selectedDoctor: DoctorData | null;
  selectedSpecialty: SpecialtyData | null;
  setSelectedDoctor: (doctor: DoctorData | null) => void;
};

const SelectDoctor = ({
  selectedSpecialty, selectedDoctor, setSelectedDoctor
}: SelectDoctorProps) => {
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [doctors, setDoctors] = useState<DoctorData[]>([]);

  const [isLoading, setLoading] = useState<boolean>(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);

  const [query, setQuery] = useState<string>("");
  const debouncedQuery = useDebounce(query, 500);

  useClickOutside(dropdownRef, () => setIsDropdownVisible(false));

  const fetchDoctors = async (query?: string, specialty_id?: string) => {
    setLoading(true);

    try {
      const { doctors } = await getAllDoctors({
        query,
        specialty_id,
        exclude: "desc, medicalFee"
      });
      setDoctors(doctors);
    } catch (error: any) {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại sau ít phút nữa!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors(debouncedQuery, selectedSpecialty?._id);
  }, [debouncedQuery, selectedSpecialty?._id]);

  return (
    <div ref={dropdownRef} className="flex flex-col gap-1 transition duration-500">
      <label className="text-sm font-semibold text-[#595959]">Bác sĩ</label>
      <div className="relative select-none">
        <FiSearch
          size="22"
          className={cn(
            "absolute top-1/2 left-4 -translate-y-1/2 text-[#595959]",
            !selectedSpecialty && "opacity-50"
          )}
        />

        <Input
          type="text"
          spellCheck={false}
          placeholder="Chọn bác sĩ"
          disabled={!selectedSpecialty}
          onFocus={() => setIsDropdownVisible(true)}
          onChange={(event) => {
            setQuery(event.target.value);
            if (selectedDoctor) setSelectedDoctor(null);
          }}
          value={selectedDoctor ? selectedDoctor?.fullname : query}
          className="pl-12"
        />

        <div
          onClick={(event) => event.stopPropagation()}
          className={cn(
            "absolute top-[calc(100%+10px)] left-0 w-full max-h-[400px] py-2 bg-white border rounded-lg shadow-md z-10 transition duration-500 overflow-y-auto select-none",
            isDropdownVisible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          )}
        >
          {isLoading ? (
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
                  <p className="font-medium">{doctor?.fullname}</p>
                </Button>
              ))
            ) : (
              <p className="text-[15px] font-medium text-[#595959] text-center py-4 px-2 mx-auto">
                Không tìm thấy bác sĩ nào!
              </p>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectDoctor;