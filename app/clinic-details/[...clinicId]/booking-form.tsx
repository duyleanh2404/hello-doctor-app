import { cn } from "@/lib/utils";
import { useState, useCallback, useMemo } from "react";

import Image from "next/image";

import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";

import SelectDoctor from "./select-doctor";
import SelectSpecialty from "./select-specialty";

const BookingForm = () => {
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
    <div className="h-fit flex flex-col gap-8 pt-6 pb-10 px-6 sm:pt-6 sm:pb-10 sm:px-6 bg-[#F8F9FC] shadow-lg sm:shadow-md rounded-t-3xl sm:rounded-2xl">
      <div className="flex flex-col gap-4">
        <h1 className="text-lg font-bold">Đặt lịch hẹn</h1>
        <p className="text-[15px] font-medium text-[#595959]">
          Lựa chọn bác sĩ phù hợp, dịch vụ y tế cần khám và tiến hành đặt lịch ngay.
        </p>
      </div>

      <div className="flex flex-col gap-6 pt-6 pb-10 px-6 sm:pt-6 sm:pb-10 sm:px-6 bg-white rounded-2xl shadow-md">
        <div className="flex flex-col gap-6">
          <h1 className="text-lg font-bold">Tư vấn trực tiếp</h1>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-[#595959]">Bệnh viện</label>
            <div className="h-12 flex items-center gap-3 p-[10px] border border-[#ccc] rounded-md cursor-default">
              <Image
                loading="lazy"
                src="/logo.jpg"
                alt="Logo"
                width="40"
                height="40"
                className="object-cover"
              />
              <p className="font-medium text-ellipsis whitespace-nowrap overflow-hidden">
                Clinic name
              </p>
            </div>
          </div>

          <SelectSpecialty />

          <SelectDoctor />

          <div className="flex flex-col gap-1 transition duration-500">
            <label className="text-sm font-semibold text-[#595959]">Ngày khám</label>
            <DatePicker />
          </div>
        </div>

        <div className="flex">{timeButtons}</div>

        <div className="flex flex-col items-center gap-6 py-12">
          <Image
            loading="lazy"
            src="/calendar.svg"
            alt="Calendar"
            width="100"
            height="100"
          />
          <p className="font-medium text-[#595959]">Chưa có lịch nào vào thời gian này!</p>
        </div>

        <p className="text-base sm:text-[17px] font-medium select-none">
          Giá từ: <span className="text-[17px] sm:text-lg font-semibold text-[#009e5c]">500.000₫ - 2.500.500₫</span>
        </p>

        <Button
          type="submit"
          variant="default"
          className="relative text-[17px] font-semibold text-white py-[14px] bg-primary hover:bg-[#2c74df] rounded-lg transition duration-500 select-none"
        >
          Xác nhận
        </Button>
      </div>
    </div>
  );
};

export default BookingForm;