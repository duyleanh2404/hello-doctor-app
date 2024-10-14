import { useState } from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";

import { ClinicData } from "@/types/clinic-types";

import {
  Carousel,
  CarouselItem,
  CarouselContent
} from "@/components/ui/carousel";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger
} from "@/components/ui/select";
import ClinicCard from "./clinic-card";

const clinics: ClinicData[] = [
  {
    _id: "Clinic id",
    name: "Clinic name",
    address: "Clinic address",
    desc: "Clinic desc",
    avatar: "/clinic-1.jpg",
    banner: "/banner-clinic-1.jpg"
  }
];

const OutstandingClinic = ({ provinces }: { provinces: any[] }) => {
  const [selectedProvince, setSelectedProvince] = useState<string>("");

  return (
    <div className="wrapper flex flex-col gap-12 py-12">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Image
            loading="lazy"
            src="/clinic-icon.svg"
            alt="Clinic icon"
            width={25}
            height={25}
          />
          <h1 className="text-xl font-bold text-center">
            Top Bệnh viện/Phòng khám Nổi Bật
          </h1>
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
              {provinces?.map((province) => (
                <SelectItem key={province?.id} value={province?.name}>
                  {province?.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="hidden lg:grid grid-cols-3 xl:grid-cols-4 gap-6">
        {clinics?.map((clinic) => (
          <ClinicCard key={clinic?._id} clinic={clinic} />
        ))}
      </div>

      <div className="block lg:hidden">
        <Carousel plugins={[Autoplay({ delay: 3000 })]}>
          <CarouselContent>
            {clinics?.map((clinic) => (
              <CarouselItem key={clinic?._id} className="sm:basis-1/2">
                <ClinicCard clinic={clinic} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
};

export default OutstandingClinic;