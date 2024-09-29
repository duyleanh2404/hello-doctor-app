import { useState } from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";

import { DoctorData } from "@/types/doctor-types";
import {
  Carousel,
  CarouselContent,
  CarouselItem
} from "@/components/ui/carousel";
import DoctorCard from "./doctor-card";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";

const doctors: DoctorData[] = [
  {
    _id: "Doctor id",
    fullname: "Doctor fullname",
    province: "Doctor province",
    desc: "Doctor desc",
    image: "/doctor-1.jpg",
    medical_fee: 150000,
    clinic_data: {
      _id: "Clinic id",
      name: "Clinic name",
      address: "Clinic address",
      desc: "Clinic desc",
      avatar: "/avatar",
      banner: "/banner"
    },
    specialty_data: {
      _id: "Specialty id",
      name: "Specialty name",
      desc: "Specialty desc",
      image: "/image"
    }
  }
];

interface Province {
  id: string;
  name: string;
};

const OutstandingDoctor = ({ provinces }: { provinces: Province[] }) => {
  const [selectedProvince, setSelectedProvince] = useState("");

  return (
    <div className="wrapper flex flex-col gap-12 py-12">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <Image
            loading="lazy"
            src="/clinic-icon.svg"
            alt="Clinic icon"
            width={25}
            height={25}
          />
          <h1 className="text-xl font-bold text-center">Top Bác sĩ nổi bật</h1>
        </div>

        <div className="min-w-[240px]">
          <Select
            value={selectedProvince}
            onValueChange={setSelectedProvince}
          >
            <SelectTrigger className="p-3 border border-[#ccc] hover:border-primary hover:shadow-input-primary rounded-lg transition duration-500 cursor-pointer">
              <span>{selectedProvince || "Tất cả vị trí"}</span>
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
      </div>

      <div className="hidden lg:grid grid-cols-3 xl:grid-cols-4 gap-6">
        {doctors.map((doctor) => (
          <DoctorCard key={doctor?._id} doctor={doctor} />
        ))}
      </div>

      <div className="block lg:hidden">
        <Carousel plugins={[Autoplay({ delay: 3000 })]}>
          <CarouselContent>
            {doctors.map((doctor) => (
              <CarouselItem key={doctor?._id} className="sm:basis-1/2">
                <DoctorCard doctor={doctor} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
};

export default OutstandingDoctor;