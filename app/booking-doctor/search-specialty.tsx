import { useState } from "react";
import { FiSearch } from "react-icons/fi";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const SearchSpecialty = () => {
  const [inputValue, setInputValue] = useState<string>("");

  return (
    <div className="wrapper p-6 sm:p-8 shadow-md rounded-2xl">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative w-full sm:w-auto flex-1">
          <FiSearch
            size="22"
            className="absolute top-1/2 left-5 -translate-y-1/2 text-[#595959]"
          />
          <Input
            type="text"
            spellCheck={false}
            value={inputValue}
            placeholder="Tìm kiếm theo tên chuyên khoa"
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full py-3 pl-14 pr-4 text-[17px] placeholder:text-[17px] placeholder:text-[#595959] placeholder:font-medium border border-[#ccc] focus:border-primary focus:shadow-input-primary rounded-lg transition duration-500"
          />
        </div>

        <Button
          type="button"
          variant="default"
          className="relative w-[125px] lg:w-[13%] h-14 p-3 ml-auto lg:ml-0 text-[17px] font-semibold text-white bg-primary rounded-lg"
        >
          Tìm kiếm
        </Button>
      </div>
    </div>
  );
};

export default SearchSpecialty;