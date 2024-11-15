import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

import { FiSearch } from "react-icons/fi";
import toast from "react-hot-toast";

import { SpecialtyData } from "@/types/specialty-types";
import { getAllSpecialties } from "@/services/specialty-service";

import useDebounce from "@/hooks/use-debounce";
import useClickOutside from "@/hooks/use-click-outside";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/spinner";

interface IProps {
  selectedSpecialty: SpecialtyData | null;
  setSelectedSpecialty: (selectedSpecialty: SpecialtyData | null) => void;
};

const SelectSpecialty = ({ selectedSpecialty, setSelectedSpecialty }: IProps) => {
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [specialties, setSpecialties] = useState<SpecialtyData[]>([]);

  const [isLoading, setLoading] = useState<boolean>(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);

  const [query, setQuery] = useState<string>("");
  const debouncedQuery = useDebounce(query, 500);

  useClickOutside(dropdownRef, () => setIsDropdownVisible(false));

  useEffect(() => {
    const fetchSpecialties = async () => {
      setLoading(true);

      try {
        const { specialties } = await getAllSpecialties({ query: debouncedQuery });
        setSpecialties(specialties);
      } catch (error: any) {
        console.error(error);
        toast.error("Có lỗi xảy ra. Vui lòng thử lại sau ít phút nữa!");
      } finally {
        setLoading(false);
      }
    };

    fetchSpecialties();
  }, [debouncedQuery]);

  return (
    <div ref={dropdownRef} className="flex flex-col gap-1">
      <label className="text-sm font-semibold text-[#595959]">Chuyên khoa</label>
      <div className="relative select-none">
        <FiSearch
          size="22"
          className="absolute top-1/2 left-4 -translate-y-1/2 text-[#595959]"
        />

        <Input
          type="text"
          spellCheck={false}
          placeholder="Chọn chuyên khoa"
          onFocus={() => setIsDropdownVisible(true)}
          onChange={(event) => {
            setQuery(event.target.value);
            if (selectedSpecialty) setSelectedSpecialty(null);
          }}
          value={selectedSpecialty ? selectedSpecialty?.name : query}
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
            specialties?.length > 0 ? (
              specialties?.map((specialty: SpecialtyData) => (
                <Button
                  type="button"
                  variant="ghost"
                  key={specialty?._id}
                  onClick={() => {
                    setIsDropdownVisible(false);
                    setSelectedSpecialty(specialty);
                  }}
                  className="w-full h-14 flex items-center justify-start gap-4 hover:text-primary transition duration-500"
                >
                  <Image
                    loading="lazy"
                    src={specialty?.image}
                    alt={specialty?.name}
                    width="30"
                    height="30"
                    className="object-cover rounded-full"
                  />
                  <p className="font-medium">{specialty?.name}</p>
                </Button>
              ))
            ) : (
              <p className="text-[15px] font-medium text-[#595959] text-center py-4 px-2 mx-auto">
                Không tìm thấy chuyên khoa nào!
              </p>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectSpecialty; 