import { useState, useRef } from "react";
import { FiSearch } from "react-icons/fi";

import { cn } from "@/lib/utils";
import useClickOutside from "@/hooks/use-click-outside";

import { Input } from "@/components/ui/input";

const SelectDoctor = () => {
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);

  useClickOutside(dropdownRef, () => setIsDropdownVisible(false));

  return (
    <div ref={dropdownRef} className="flex flex-col gap-1 transition duration-500">
      <label className="text-sm font-semibold text-[#595959]">Bác sĩ</label>
      <div className="relative select-none">
        <FiSearch
          size="22"
          className="absolute top-1/2 left-4 -translate-y-1/2 text-[#595959]"
        />

        <Input
          type="text"
          placeholder="Chọn bác sĩ"
          spellCheck={false}
          onBlur={() => setIsDropdownVisible(false)}
          onFocus={() => setIsDropdownVisible(true)}
          className="w-full h-12 py-[10px] pl-12 pr-[10px] border border-[#ccc] rounded-md transition duration-500"
        />

        <div
          onClick={(e) => e.stopPropagation()}
          className={cn(
            "absolute top-[calc(100%+10px)] left-0 w-full max-h-[400px] py-2 bg-white border rounded-lg shadow-md z-10 transition duration-500 overflow-y-auto select-none",
            isDropdownVisible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          )}
        >
          <p className="text-[15px] font-medium text-[#595959] text-center py-4 px-2 mx-auto">
            Không có bác sĩ nào!
          </p>
        </div>
      </div>
    </div>
  );
};

export default SelectDoctor;