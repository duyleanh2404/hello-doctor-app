"use client";

import { cn } from "@/lib/utils";
import { Suspense, lazy } from "react";
import { useState, useCallback, useMemo } from "react";

import { IoLocationOutline } from "react-icons/io5";

import Image from "next/image";

import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";

import Breadcrumbs from "@/components/breadcrumbs";

const Advertise = lazy(() => import("@/components/advertise"));

const DoctorDetailsPage = () => {
  const [activeTime, setActiveTime] = useState("morning");

  const handleTimeChange = useCallback((time: string) => {
    setActiveTime(time);
  }, []);

  const timeButtons = useMemo(() => {
    return ["morning", "afternoon", "evening"].map((time) => (
      <Button
        key={time}
        type="button"
        variant="ghost"
        onClick={() => handleTimeChange(time)}
        className={cn(
          "flex-1 text-base sm:text-[17px] font-semibold pb-2 rounded-none",
          activeTime === time ? "text-primary border-b-[3px] border-primary" : "hover:text-primary"
        )}
      >
        {time === "morning" ? "Sáng" : time === "afternoon" ? "Chiều" : "Tối"}
      </Button>
    ));
  }, [activeTime, handleTimeChange]);

  return (
    <div className="flex flex-col gap-6 sm:gap-12 space-header-has-bottom">
      <div className="flex flex-col">
        <Breadcrumbs label="Doctor name" />

        <div className="wrapper w-full flex items-center gap-6 py-8 border-b">
          <div className="relative w-[100px] sm:w-[120px] h-[100px] sm:h-[120px]">
            <Image
              loading="lazy"
              src="/avatar-default.png"
              alt="Avatar"
              fill
              sizes="(max-width: 768px) 100px, 120px"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div className="flex flex-col gap-4">
            <h1 className="text-base sm:text-lg font-bold">Doctor fullname</h1>
            <p className="text-[15px] font-medium text-[#595959]">Specialty name</p>
          </div>
        </div>
      </div>

      <div className="sm:wrapper w-full flex flex-col lg:flex-row gap-12 lg:gap-8 sm:pb-16">
        <div className="wrapper w-full lg:w-[65%]">Doctor description</div>

        <div className="relative w-full lg:w-auto flex-1 flex flex-col gap-8">
          <div className="h-fit flex flex-col gap-8 pt-6 pb-10 px-6 sm:pt-6 sm:pb-10 sm:px-6 bg-[#F8F9FC] shadow-xl sm:shadow-lg rounded-t-3xl sm:rounded-2xl">
            <h1 className="text-lg font-bold">Đặt lịch hẹn</h1>

            <div className="flex items-center gap-3">
              <IoLocationOutline className="text-2xl sm:text-[28px]" />
              <p className="text-[15px] font-medium">Clinic address</p>
            </div>

            <div className="flex flex-col gap-6 pt-6 pb-10 px-6 sm:pt-6 sm:pb-10 sm:px-6 bg-white rounded-2xl shadow-md">
              <h1 className="text-lg font-bold">Tư vấn trực tiếp</h1>
              <label className="text-sm font-semibold text-[#595959]">Ngày khám</label>
              <DatePicker />

              <div className="flex">{timeButtons}</div>

              <div className="flex flex-col items-center gap-6 py-12">
                <Image
                  loading="lazy"
                  src="/calendar.svg"
                  alt="Calendar"
                  width="100"
                  height="100"
                />
                <p className="font-medium text-[#595959]">
                  Chưa có lịch nào vào thời gian này!
                </p>
              </div>

              <Button
                type="button"
                variant="default"
                className="h-14 relative text-[17px] font-semibold text-white py-[14px] bg-primary hover:bg-[#2c74df] rounded-lg transition duration-500 select-none"
                aria-label="Continue booking"
              >
                Tiếp tục đặt lịch
              </Button>
            </div>
          </div>

          <Suspense fallback={<div>Loading...</div>}>
            <Advertise />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetailsPage;