import { cn } from "@/lib/utils";
import { FiSearch } from "react-icons/fi";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef } from "react";

const SelectDoctor = () => {
  const dropdownRef = useRef<HTMLDivElement | null>(null); // Reference to the dropdown container
  const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);

  // Effect to handle clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if the click target is outside the dropdown
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownVisible(false); // Hide dropdown if clicked outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={dropdownRef} // Attach ref to the dropdown container
      className="flex flex-col gap-1 transition duration-500"
    >
      {/* Label for the input */}
      <label className="text-sm font-semibold text-[#595959]">Bác sĩ</label>

      {/* Container for the input and dropdown */}
      <div className="relative select-none">
        {/* Search Icon */}
        <FiSearch
          size="22"
          className="absolute top-1/2 left-4 -translate-y-1/2 text-[#595959]"
        />

        {/* Input for selecting a doctor */}
        <Input
          type="text"
          placeholder="Chọn bác sĩ"
          spellCheck={false}
          onBlur={() => setIsDropdownVisible(false)}
          onFocus={() => setIsDropdownVisible(true)}
          className="w-full h-12 py-[10px] pl-12 pr-[10px] border border-[#ccc] rounded-md transition duration-500"
        />

        {/* Dropdown list for doctor selection */}
        <div
          onClick={(e) => e.stopPropagation()} // Prevent click event from bubbling up
          className={cn(
            "absolute top-[calc(100%+10px)] left-0 w-full max-h-[400px] py-2 bg-white border rounded-lg shadow-md z-10 transition duration-500 overflow-y-auto select-none",
            // Toggle visibility and interactivity based on state
            isDropdownVisible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          )}
        >
          {/* Message displayed when no doctors are available */}
          <p className="text-[15px] font-medium text-[#595959] text-center py-4 px-2 mx-auto">
            Không có bác sĩ nào!
          </p>
        </div>
      </div>
    </div>
  );
};

export default SelectDoctor;