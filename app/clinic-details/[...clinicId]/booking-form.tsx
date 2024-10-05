import { cn } from "@/lib/utils";
import { useState, useCallback, useMemo } from "react";

import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";

import Image from "next/image";
import SelectDoctor from "./select-doctor";
import SelectSpecialty from "./select-specialty";

const BookingForm = () => {
  const [activeTime, setActiveTime] = useState("morning");

  // Handle time changes
  const handleTimeChange = useCallback((time: string) => {
    setActiveTime(time); // Update the active time state
  }, []);

  // Time buttons based on the selected time slot
  const timeButtons = useMemo(() => {
    return ["morning", "afternoon", "evening"].map((time) => (
      <Button
        key={time}
        type="button"
        variant="ghost"
        onClick={() => handleTimeChange(time)}
        className={cn(
          "flex-1 text-base sm:text-[17px] font-semibold pb-2 rounded-none",
          // Conditional styles based on active time
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
        {/* Header for booking */}
        <h1 className="text-lg font-bold">Đặt lịch hẹn</h1>
        {/* Description */}
        <p className="text-[15px] font-medium text-[#595959]">
          Lựa chọn bác sĩ phù hợp, dịch vụ y tế cần khám và tiến hành đặt lịch ngay.
        </p>
      </div>

      <div className="flex flex-col gap-6 pt-6 pb-10 px-6 sm:pt-6 sm:pb-10 sm:px-6 bg-white rounded-2xl shadow-md">
        <div className="flex flex-col gap-6">
          {/* Header for direct consultation */}
          <h1 className="text-lg font-bold">Tư vấn trực tiếp</h1>

          <div className="flex flex-col gap-1">
            {/* Label for hospital */}
            <label className="text-sm font-semibold text-[#595959]">Bệnh viện</label>
            <div className="h-12 flex items-center gap-3 p-[10px] border border-[#ccc] rounded-md cursor-default">
              {/* Hopsital's logo */}
              <Image
                loading="lazy"
                src="/logo.jpg"
                alt="Logo"
                width={40}
                height={40}
                className="object-cover"
              />
              {/* Placeholder for the clinic name */}
              <p className="font-medium text-ellipsis whitespace-nowrap overflow-hidden">
                Clinic name
              </p>
            </div>
          </div>

          <SelectSpecialty /> {/* Component for selecting specialty */}
          <SelectDoctor /> {/* Component for selecting doctor */}

          <div className="flex flex-col gap-1 transition duration-500">
            {/* Label for date selection */}
            <label className="text-sm font-semibold text-[#595959]">Ngày khám</label>
            {/* DatePicker component */}
            <DatePicker />
          </div>
        </div>

        <div className="flex">{timeButtons}</div> {/* Rendered time selection buttons */}

        {/* Message for no appointments */}
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

        {/* Price range */}
        <p className="text-base sm:text-[17px] font-medium select-none">
          Giá từ: <span className="text-[17px] sm:text-lg font-semibold text-[#009e5c]">500.000₫ - 2.500.500₫</span>
        </p>

        {/* Confirm button label */}
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