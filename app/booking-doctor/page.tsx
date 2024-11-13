"use client";

import { cn } from "@/lib/utils";
import { useState, useEffect, useMemo, lazy } from "react";
import Image from "next/image";

import NProgress from "nprogress";
import Autoplay from "embla-carousel-autoplay";
import "nprogress/nprogress.css";

import { bookingDoctorBanners } from "@/constants/booking-doctor-banners";
import { bookingDoctorOptions } from "@/constants/booking-doctor-options";

import useProvinces from "@/hooks/fetch/use-provinces";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import HealthGuide from "./health-guide";
import Chatbot from "@/components/chatbot";
import SearchClinic from "./search-clinic";
import SearchDoctor from "./search-doctor";
import MedicalExperts from "./medical-experts";
import SearchSpecialty from "./search-specialty";
import Billboard from "@/components/advertises/billboard";
import LazyLoadComponent from "@/components/lazyload-component";

const OutstandingDoctor = lazy(() => import("./outstanding-doctor"));
const OutstandingClinic = lazy(() => import("./outstanding-clinic"));

type Tab = "clinic" | "doctor" | "specialty";

const BookingDoctorPage = () => {
  const provinces = useProvinces();

  const [tabActive, setTabActive] = useState<Tab>("clinic");
  const [showBillboard, setShowBillboard] = useState<boolean>(false);

  useEffect(() => {
    NProgress.done();
  }, []);

  useEffect(() => {
    const shouldShowBillboard = Math.random() > 0.5;
    setShowBillboard(shouldShowBillboard);
  }, []);

  const tabComponents = useMemo(
    () => ({
      specialty: <SearchSpecialty />,
      clinic: <SearchClinic provinces={provinces} />,
      doctor: <SearchDoctor provinces={provinces} />,
    }),
    [provinces]
  );

  return (
    <div className="bg-[#f8f9fc]">
      <div className="relative">
        <Carousel plugins={[Autoplay({ delay: 3000 })]}>
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
            {bookingDoctorOptions.map(({ id, type, title }) => (
              <Button
                key={id}
                type="button"
                variant="ghost"
                onClick={() => setTabActive(type as Tab)}
                className={cn(
                  "relative min-w-fit py-3 xl:py-4 px-10 xl:px-12 rounded-none",
                  tabActive === type
                    ? "bg-white border-t-[3px] border-primary"
                    : "",
                  type !== "clinic" &&
                  "before:absolute before:top-1/2 before:left-0 before:-translate-y-1/2 before:w-[1px] before:h-[25px] before:bg-[#ccc]"
                )}
              >
                <p className="lg:text-lg font-medium">{title}</p>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {tabComponents[tabActive]}

      <LazyLoadComponent>
        <OutstandingDoctor provinces={provinces} />
      </LazyLoadComponent>

      <LazyLoadComponent>
        <OutstandingClinic provinces={provinces} />
      </LazyLoadComponent>

      <LazyLoadComponent>
        <MedicalExperts />
      </LazyLoadComponent>

      <LazyLoadComponent>
        <HealthGuide />
      </LazyLoadComponent>

      {showBillboard && <Billboard />}

      <Chatbot />
    </div>
  );
};

export default BookingDoctorPage;