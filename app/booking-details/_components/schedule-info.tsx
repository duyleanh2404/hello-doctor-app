import { memo } from "react";
import Image from "next/image";

import { format } from "date-fns";

import { GrLocation } from "react-icons/gr";
import { FaRegCalendarAlt } from "react-icons/fa";
import { RiMoneyDollarCircleLine } from "react-icons/ri";

import { ScheduleInfoProps } from "@/types/booking-types";
import { formatVietnameseCurrency } from "@/utils/format-vietnamese-currency";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import InfoItem from "./info-item";
import Spinner from "@/components/spinner";

const ScheduleInfo = memo(({
  time, schedule, isBooking, isLoading, paymentMethod, setPaymentMethod
}: ScheduleInfoProps) => {
  return (
    <div className="flex-1 flex flex-col gap-12 p-6 border shadow-md rounded-2xl">
      <section className="flex flex-col gap-6">
        <h1 className="relative text-lg font-bold text-[#284a75] pl-3 before:absolute before:top-1/2 before:left-0 before:-translate-y-1/2 before:w-[3px] before:h-[18px] before:bg-primary">
          Lịch hẹn của bạn
        </h1>

        {isLoading ? (
          <Spinner table className="py-12" />
        ) : (
          <>
            <div className="flex items-center gap-4">
              <Image
                loading="lazy"
                src={schedule?.doctor_id?.image || "/avatar-default.png"}
                alt="Avatar"
                width={60}
                height={60}
                className="object-cover rounded-full"
              />
              <div className="flex flex-col gap-1">
                <h1 className="text-[17px] font-semibold">{schedule?.doctor_id?.fullname}</h1>
                <p>{schedule?.doctor_id?.specialty_id?.name}</p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-[17px] font-semibold text-[#595959]">Thông tin lịch hẹn</p>
              <div className="flex flex-col gap-6 p-4 bg-[#f8f9fc] rounded-md">
                <InfoItem
                  icon={<FaRegCalendarAlt size="18" />}
                  title={`Thời gian: ${time}`}
                  subtitle={schedule?.date && format(schedule?.date, "dd/MM/yyyy")}
                />
                <InfoItem
                  icon={<GrLocation size="22" />}
                  title={`Địa chỉ: ${schedule?.doctor_id?.clinic_id?.name}`}
                  subtitle={schedule?.doctor_id?.clinic_id?.address}
                />
                <InfoItem
                  icon={<RiMoneyDollarCircleLine size="22" />}
                  title={formatVietnameseCurrency(schedule?.doctor_id?.medicalFee ?? 0)}
                  customStyle="text-xl text-[#d84023]"
                />
              </div>
            </div>
          </>
        )}
      </section>

      <section className="flex flex-col gap-6">
        <h1 className="relative text-lg font-bold text-[#284a75] pl-3 before:absolute before:top-1/2 before:left-0 before:-translate-y-1/2 before:w-[3px] before:h-[18px] before:bg-primary">
          Phương thức thanh toán
        </h1>

        <div className="flex flex-col">
          <label className="flex items-center justify-between py-4 cursor-pointer">
            <div className="flex items-center gap-3">
              <Image loading="lazy" src="/payment.svg" alt="Payment Icon" width={40} height={40} />
              <p className="text-[15px] sm:text-[17px] font-semibold">Thanh toán bằng tiền mặt (COD)</p>
            </div>

            <Input
              type="radio"
              value="COD"
              checked={paymentMethod === "COD"}
              onChange={(event) => setPaymentMethod(event.target.value)}
              className="w-[25px] h-[25px] mr-2"
            />
          </label>

          <label className="flex items-center justify-between py-4 cursor-pointer">
            <div className="flex items-center gap-3">
              <Image loading="lazy" src="/atm-card.svg" alt="ATM Card Icon" width={40} height={40} className="p-1" />
              <p className="text-[15px] sm:text-[17px] font-semibold">Thanh toán bằng thẻ ngân hàng (ATM)</p>
            </div>

            <Input
              type="radio"
              value="ATM"
              checked={paymentMethod === "ATM"}
              onChange={(event) => setPaymentMethod(event.target.value)}
              className="w-[25px] h-[25px] mr-2"
            />
          </label>
        </div>

        <Button
          type="submit"
          variant="default"
          disabled={isBooking}
          className="relative w-[200px] h-14 text-[17px] font-medium text-white py-3 px-6 ml-auto bg-primary hover:bg-[#2c74df] rounded-lg select-none"
        >
          {isBooking ? "Đang đặt lịch..." : "Tiến hành xác nhận"}
        </Button>
      </section>
    </div>
  );
});

ScheduleInfo.displayName = "ScheduleInfo";

export default ScheduleInfo;