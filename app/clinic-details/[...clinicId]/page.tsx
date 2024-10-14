"use client";

import { FaLocationDot } from "react-icons/fa6";
import Image from "next/image";

import BookingForm from "./booking-form";
import Advertise from "@/components/advertise";
import Breadcrumb from "@/components/breadcrumb";

const ClinicDetailsPage = () => {
  return (
    <div className="flex flex-col gap-6 sm:gap-8 space-header-has-bottom">
      <div className="flex flex-col">
        <Breadcrumb label="Clinic name" />

        <div className="relative w-full pt-[30%]">
          <Image
            loading="lazy"
            src="/banner.jpg"
            alt="Banner"
            fill
            className="w-full h-full object-contain"
          />
        </div>

        <div className="wrapper w-full flex flex-col sm:flex-row sm:items-center sm:gap-4 border-b">
          <div className="relative w-[120px] sm:w-[180px] h-[120px] sm:h-[180px] bg-white border border-[#ccc] rounded-full shadow-md -translate-y-12">
            <Image
              loading="lazy"
              src="/logo.jpg"
              alt="Logo"
              fill
              className="w-full h-full p-4 object-contain"
            />
          </div>

          <div className="flex flex-col gap-3 -translate-y-6 sm:-translate-y-0">
            <h1 className="text-xl font-bold">Clinic name</h1>

            <div className="flex items-center gap-3">
              <FaLocationDot size="18" className="text-[#595959]" />
              <p className="font-medium text-[#595959]">Clinic address</p>
            </div>
          </div>
        </div>
      </div>

      <div className="sm:wrapper w-full flex flex-col lg:flex-row gap-12 lg:gap-8 sm:pb-16">
        <div className="wrapper w-full lg:w-[55%] xl:w-[65%]">
          Clinic description
        </div>

        <div className="relative w-full lg:w-auto flex-1 flex flex-col gap-8">
          <BookingForm />

          <div className="sticky hidden lg:block top-32">
            <Advertise />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicDetailsPage;