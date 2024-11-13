import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

import { FiSearch } from "react-icons/fi";
import NProgress from "nprogress";
import toast from "react-hot-toast";
import "nprogress/nprogress.css";

import { SpecialtyData } from "@/types/specialty-types";
import { getAllSpecialties } from "@/services/specialty-service";

import useDebounce from "@/hooks/use-debounce";
import useClickOutside from "@/hooks/use-click-outside";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/spinner";

const SearchSpecialty = () => {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);
  const [isLoading, setLoading] = useState({ specialties: false, routing: false });

  const [specialties, setSpecialties] = useState<SpecialtyData[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState<SpecialtyData | null>(null);

  const [query, setQuery] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");
  const debouncedQuery = useDebounce(query, 500);

  useClickOutside(dropdownRef, () => setIsDropdownVisible(false));

  const fetchSpecialties = async (query?: string) => {
    setLoading({ ...isLoading, specialties: true });

    try {
      const { specialties } = await getAllSpecialties({
        query, exclude: "desc"
      });
      setSpecialties(specialties);
    } catch (error: any) {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại sau ít phút nữa!");
    } finally {
      setLoading({ ...isLoading, specialties: false });
    }
  };

  useEffect(() => {
    fetchSpecialties(debouncedQuery);
  }, [debouncedQuery]);

  useEffect(() => {
    if (selectedSpecialty) setInputValue(selectedSpecialty?.name);
  }, [selectedSpecialty]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);
    setInputValue(value);
    setIsDropdownVisible(true);
  };

  const handleRoute = () => {
    NProgress.start();
    setLoading({ ...isLoading, routing: true });
    router.replace(`/specialties/${btoa(selectedSpecialty?._id!)}`);
  };

  return (
    <div className="wrapper p-6 sm:p-8 bg-white shadow-md rounded-b-2xl">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div ref={dropdownRef} className="relative w-full sm:w-auto flex-1">
          <FiSearch
            size="22"
            className="absolute top-1/2 left-5 -translate-y-1/2 text-[#595959]"
          />
          <Input
            type="text"
            value={inputValue}
            spellCheck={false}
            onChange={handleInputChange}
            placeholder="Tìm kiếm theo tên chuyên khoa"
            onFocus={() => setIsDropdownVisible(true)}
            className="pl-14"
          />

          <div
            onClick={(event) => event.stopPropagation()}
            className={cn(
              "absolute top-[calc(100%+10px)] left-0 w-full max-h-[400px] py-2 bg-white border rounded-lg shadow-md z-10 transition duration-500 overflow-y-auto select-none",
              isDropdownVisible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            )}
          >
            {isLoading.specialties ? (
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
                      setInputValue(specialty?.name);
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
                    <p className="w-fit font-medium text-ellipsis overflow-hidden">
                      {specialty?.name}
                    </p>
                  </Button>
                ))
              ) : (
                <p className="text-[15px] font-medium text-[#595959] text-center p-12 mx-auto">
                  Không tìm thấy chuyên khoa nào!
                </p>
              )
            )}
          </div>
        </div>

        <Button
          type="button"
          size="lg"
          variant="search"
          disabled={isLoading.routing}
          onClick={handleRoute}
        >
          {isLoading.routing ? "Đang tìm kiếm..." : "Tìm kiếm"}
        </Button>
      </div>
    </div>
  );
};

export default SearchSpecialty;