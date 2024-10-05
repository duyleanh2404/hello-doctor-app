"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useProvinces } from "@/api/use-provinces";
import { useState, useEffect, useMemo } from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";

import bookingDoctorBanners from "@/constants/booking-doctor-banners";
import bookingDoctorOptions from "@/constants/booking-doctor-options";

import HealthGuide from "./health-guide";
import SearchClinic from "./search-clinic";
import SearchDoctor from "./search-doctor";
import MedicalExperts from "./medical-experts";
import SearchSpecialty from "./search-specialty";
import OutstandingDoctor from "./outstanding-doctor";
import OutstandingClinic from "./outstanding-clinic";

type Tab = "clinic" | "doctor" | "specialty";

const BookingDoctorPage = () => {
  const [provinces, setProvinces] = useState<any[]>([]);
  const [tabActive, setTabActive] = useState<Tab>("clinic");

  // Effect to fetch provinces on component mount
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const { success, provinces } = await useProvinces();
        if (!success || !provinces) {
          return;
        }

        setProvinces(provinces);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    };

    fetchProvinces();
  }, []);

  const tabComponents = useMemo(() => ({
    clinic: <SearchClinic provinces={provinces} />,
    doctor: <SearchDoctor provinces={provinces} />,
    specialty: <SearchSpecialty />
  }), [provinces]);

  return (
    <>
      <div className="relative">
        <Carousel plugins={[Autoplay({ delay: 3000 })]}> {/* Carousel for banners */}
          <CarouselContent>
            {bookingDoctorBanners.map(({ id, image }) => (
              <CarouselItem key={id}>
                <div className="relative w-full pt-[32%] sm:pt-[22%]">
                  <Image
                    loading="lazy"
                    src={image}
                    alt="Banner"
                    fill
                    className="w-full h-full object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <div className="absolute bottom-0 left-0 w-full bg-[#ffffffa3] shadow-sm overflow-y-auto z-10">
          <div className="wrapper flex items-center">
            {/* Render buttons for each tab */}
            {bookingDoctorOptions.map(({ id, type, title }) => (
              <Button
                key={id}
                type="button"
                variant="ghost"
                onClick={() => setTabActive(type as Tab)} // Update active tab on click
                className={cn(
                  "relative min-w-fit py-3 xl:py-4 px-10 xl:px-12 rounded-none",
                  tabActive === type ? "bg-white border-t-[3px] border-primary" : "", // Active tab styles
                  type !== "clinic" && "before:absolute before:top-1/2 before:left-0 before:-translate-y-1/2 before:w-[1px] before:h-[25px] before:bg-[#ccc]" // Separator styles for tabs
                )}
              >
                <p className="lg:text-lg font-medium">{title}</p>
              </Button>
            ))}
          </div>
        </div>
      </div >

      {/* Render the active tab component */}
      {tabComponents[tabActive]}

      {/* Additional components below the tabbed interface */}
      <OutstandingDoctor provinces={provinces} />
      <OutstandingClinic provinces={provinces} />
      <MedicalExperts />
      <HealthGuide />
    </>
  );
};

export default BookingDoctorPage;