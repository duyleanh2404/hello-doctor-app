import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Image from "next/image";

import { GrLocation } from "react-icons/gr";
import { FaRegCalendarAlt } from "react-icons/fa";
import { RiMoneyDollarCircleLine } from "react-icons/ri";

interface InfoItemProps {
  title: string;
  subtitle?: string;
  customStyle?: string;
  icon: React.ReactNode;
};

const InfoItem = ({ icon, title, subtitle, customStyle }: InfoItemProps) => (
  <div className="flex items-center gap-4">
    <div className={cn("w-[10%] sm:w-[3%] text-[#595959]", customStyle)}>
      {icon}
    </div>
    <div className="flex flex-col gap-1 w-full">
      <p className={cn("text-[17px] font-semibold", customStyle)}>{title}</p>
      {subtitle && <p className="text-[15px] font-medium text-[#595959]">{subtitle}</p>}
    </div>
  </div>
);

const ScheduleInfo = () => {
  return (
    <div className="flex-1 flex flex-col gap-12 p-6 border shadow-md rounded-2xl">
      {/* Appointment Information Section */}
      <section className="flex flex-col gap-6">
        <h1 className="relative text-lg font-bold text-[#284a75] pl-3 before:absolute before:top-1/2 before:left-0 before:-translate-y-1/2 before:w-[3px] before:h-[18px] before:bg-primary">
          Lịch hẹn của bạn
        </h1>

        {/* Doctor details */}
        <div className="flex items-center gap-4">
          <Image
            loading="lazy"
            src="/avatar-default.png"
            alt="Avatar"
            width={60}
            height={60}
            className="object-cover rounded-full"
          />
          <div className="flex flex-col gap-1">
            <h1 className="text-[17px] font-semibold">Doctor fullname</h1>
            <p>Specialty name</p>
          </div>
        </div>

        {/* Schedule details */}
        <div className="flex flex-col gap-2">
          <p className="text-[17px] font-semibold text-[#595959]">Thông tin lịch hẹn</p>
          <div className="flex flex-col gap-6 p-4 bg-[#f8f9fc] rounded-md">
            {/* Info Items for Scheduling Details */}
            <InfoItem
              icon={<FaRegCalendarAlt size="18" />}
              title="Lịch hẹn: Schedule time"
              subtitle="Schedule date"
            />
            <InfoItem
              icon={<GrLocation size="22" />}
              title="Clinic name"
              subtitle="Clinic address"
            />
            <InfoItem
              icon={<RiMoneyDollarCircleLine size="22" />}
              title="Medical fee"
              customStyle="text-xl text-[#d84023]"
            />
          </div>
        </div>
      </section>

      {/* Payment Method Section */}
      <section className="flex flex-col gap-6">
        <h1 className="relative text-lg font-bold text-[#284a75] pl-3 before:absolute before:top-1/2 before:left-0 before:-translate-y-1/2 before:w-[3px] before:h-[18px] before:bg-primary">
          Phương thức thanh toán
        </h1>
        <div className="relative flex items-center gap-3">
          <div className="w-[70%] sm:w-full flex items-center gap-3">
            <Image
              loading="lazy"
              src="/payment.svg"
              alt="Payment Icon"
              width={40}
              height={40}
            />
            <p className="text-[15px] sm:text-[17px] font-semibold">
              Thanh toán bằng tiền mặt (COD)
            </p>
          </div>
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[25px] h-[25px] border border-primary rounded-full">
            <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-[12px] h-[12px] bg-primary rounded-full" />
          </div>
        </div>

        {/* Button for Confirmation */}
        <Button
          type="submit"
          variant="default"
          className="relative w-fit h-14 text-[17px] font-medium text-white py-3 px-6 ml-auto bg-primary hover:bg-[#2c74df] rounded-lg select-none"
        >
          Tiến hành xác nhận
        </Button>
      </section>
    </div>
  );
};

export default ScheduleInfo;