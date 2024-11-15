import Link from "next/link";
import Image from "next/image";

import NProgress from "nprogress";
import "nprogress/nprogress.css";

import { BiClinic } from "react-icons/bi";
import { IoLocationOutline } from "react-icons/io5";

import { DoctorData } from "@/types/doctor-types";

import { Button } from "@/components/ui/button";
import Hint from "@/components/hint";

const DoctorCard = ({ doctor }: { doctor: DoctorData }) => {
  return (
    <Link
      href={`/doctor-details/${btoa(doctor?._id)}`}
      onClick={() => NProgress.start()}
      className="group flex flex-col items-center gap-6 lg:border py-6 px-4 bg-white rounded-xl shadow-sm hover:shadow-xl transition duration-500 cursor-pointer"
    >
      <div className="w-full flex flex-col items-center gap-6">
        <div className="relative w-[120px] h-[120px]">
          <Image loading="lazy" src={doctor?.image} alt="Avatar" fill className="w-full h-full object-cover rounded-full" />
        </div>

        <div className="h-[125px] flex flex-col items-center gap-3">
          <h1 className="text-[17px] font-semibold text-center">{doctor?.fullname}</h1>
          <p className="font-semibold text-primary">{doctor?.specialty_id?.name} </p>
          <div className="flex items-center gap-2 py-2 px-3 bg-[#e3f2ff] rounded-lg">
            <Image loading="lazy" src="/doctor-icon.svg" alt="Doctor" width={20} height={20} />
            <p className="text-sm font-medium">Tư vấn trực tiếp</p>
          </div>
        </div>

        <div className="w-full h-[115px] flex flex-col justify-center gap-4 p-3 rounded-lg group-hover:bg-[#e3f2ff] transition duration-500">
          <div className="flex items-center gap-3">
            <BiClinic
              size="22" className="flex-shrink-0 text-[#595959] group-hover:text-primary transition duration-500"
            />
            <p className="text-sm font-medium text-[#595959] line-clamp-2">{doctor?.clinic_id?.name}</p>
          </div>

          <div className="flex items-center gap-3">
            <IoLocationOutline
              size="22" className="flex-shrink-0 text-[#595959] group-hover:text-primary transition duration-500"
            />
            <Hint label={doctor?.clinic_id?.address}>
              <p className="text-sm font-medium text-[#595959] line-clamp-2">{doctor?.clinic_id?.address}</p>
            </Hint>
          </div>
        </div>

        <Button
          type="button"
          variant="default"
          className="w-full h-14 text-[17px] font-semibold text-black py-3 border border-gray-300 bg-white group-hover:text-white group-hover:border-transparent group-hover:bg-primary rounded-lg transition duration-500"
        >
          Đặt lịch khám
        </Button>
      </div>
    </Link>
  );
};

export default DoctorCard; 