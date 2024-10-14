import { IoLocationOutline } from "react-icons/io5";

import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { ClinicData } from "@/types/clinic-types";

const ClinicCard = ({ clinic }: { clinic: ClinicData }) => {
  return (
    <Link
      href={`/clinic-details/${clinic._id}`}
      className="group lg:border rounded-xl shadow-sm hover:shadow-xl transition duration-500 cursor-pointer"
    >
      <div className="py-16 px-8">
        <div className="relative pt-[30%]">
          <Image
            loading="lazy"
            src={clinic.avatar}
            alt="Avatar"
            fill
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      <div className="w-full flex flex-col items-center p-3">
        <div className="w-full h-[140px] flex flex-col items-center gap-4 p-3 rounded-lg group-hover:bg-[#e3f2ff] transition duration-500">
          <h1 className="h-[60px] flex items-center text-[17px] font-semibold text-[#262626] text-center">
            {clinic.name}
          </h1>

          <div className="flex items-center gap-3">
            <IoLocationOutline size="22" className="text-[#595959]" />
            <p className="text-[13px] font-medium text-[#595959] line-clamp-2">
              {clinic.address}
            </p>
          </div>
        </div>
      </div>

      <div className="w-full p-4">
        <Button
          type="button"
          variant="default"
          className="w-full h-12 text-[17px] font-semibold text-black py-3 border border-[#ccc] bg-white group-hover:text-white group-hover:border-transparent group-hover:bg-primary rounded-lg transition duration-500"
        >
          Đặt lịch khám
        </Button>
      </div>
    </Link>
  );
};

export default ClinicCard;