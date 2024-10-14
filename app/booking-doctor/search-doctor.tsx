import { useState } from "react";
import { FiSearch } from "react-icons/fi";

import { cn } from "@/lib/utils";

import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const SearchDoctor = ({ provinces }: { provinces: any[] }) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [selectedProvince, setSelectedProvince] = useState<string>("");

  return (
    <div className="wrapper p-6 sm:p-8 shadow-md rounded-2xl">
      <div className="flex flex-col lg:flex-row items-center gap-4">
        <div className="w-full lg:w-[27%]">
          <Select
            value={selectedProvince}
            onValueChange={(value) => setSelectedProvince(value)}
          >
            <SelectTrigger
              className={cn(
                "w-full py-[14px] px-4 text-[17px] placeholder:text-[17px] placeholder:text-[#595959] placeholder:font-medium border border-[#ccc] focus:border-primary focus:shadow-input-primary rounded-lg transition duration-500",
                selectedProvince ? "text-black" : "text-[#A9A9A9]"
              )}
            >
              <SelectValue placeholder="Chọn tỉnh thành của bạn" />
            </SelectTrigger>
            <SelectContent>
              {provinces.map((province) => (
                <SelectItem key={province?.id} value={province?.name}>
                  {province?.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="relative w-full lg:w-auto flex-1">
          <FiSearch
            size="22"
            className="absolute top-1/2 left-5 -translate-y-1/2 text-[#595959]"
          />
          <Input
            type="text"
            value={inputValue}
            spellCheck={false}
            placeholder="Tìm kiếm theo tên bác sĩ"
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

export default SearchDoctor;