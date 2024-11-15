import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";

import { format } from "date-fns";
import Swal from "sweetalert2";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

import { RootState } from "@/store/store";
import { useSelector } from "react-redux";

import { getSchedule } from "@/services/schedule-service";
import { ActiveTime, timeRanges } from "@/constants/time-ranges";

import { ClinicData } from "@/types/clinic-types";
import { DoctorData } from "@/types/doctor-types";
import { SpecialtyData } from "@/types/specialty-types";
import { ScheduleData, TimeSlot } from "@/types/schedule-types";

import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import Spinner from "@/components/spinner";
import SelectDoctor from "./select-doctor";
import SelectSpecialty from "./select-specialty";
import TimeButtons from "@/components/time-buttons";

const BookingForm = ({ clinic }: { clinic: ClinicData }) => {
  const router = useRouter();

  const { isLoggedIn, userData } = useSelector((state: RootState) => state.auth);
  const [isLoading, setLoading] = useState({ schedule: false, booking: false });

  const [schedule, setSchedule] = useState<ScheduleData | null>(null);
  const [activeTime, setActiveTime] = useState<ActiveTime>("morning");
  const [filteredTimeSlots, setFilteredTimeSlots] = useState<TimeSlot[]>([]);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const [selectedDoctor, setSelectedDoctor] = useState<DoctorData | null>(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState<SpecialtyData | null>(null);

  useEffect(() => {
    const fetchSchedule = async () => {
      if (!selectedDate || !selectedDoctor) return;
      resetState();
      setLoading({ ...isLoading, schedule: true });

      try {
        const { schedule } = await getSchedule({
          doctor_id: selectedDoctor._id, date: selectedDate
        });
        setSchedule(schedule);
      } catch (error: any) {
        console.error(error);
        resetState();
      } finally {
        setLoading({ ...isLoading, schedule: false });
      }
    };

    fetchSchedule();
  }, [selectedDate, selectedDoctor]);

  useEffect(() => {
    if (!schedule?.timeSlots) return;

    const filteredSlots = schedule.timeSlots.filter((slot) => {
      const { start, end } = timeRanges[activeTime];
      return slot.timeline >= start && slot.timeline < end;
    });

    setFilteredTimeSlots(filteredSlots);
  }, [activeTime, schedule]);

  const resetState = () => {
    setSchedule(null);
    setSelectedSlot(null);
    setActiveTime("morning");
    setFilteredTimeSlots([]);
  };

  const handleBookingAppointment = async () => {
    if (!isLoggedIn) {
      router.replace("/login");
      return;
    }

    if (!userData?.phoneNumber || !userData?.dateOfBirth) {
      Swal.fire({
        icon: "error",
        title: "Bạn chưa cập nhật đầy đủ thông tin!",
        confirmButtonText: "Đến trang hồ sơ",
        text: "Vui lòng cập nhật đầy đủ thông tin của bạn để có thể đặt lịch khám!"
      })
        .then((result) => {
          if (result.isConfirmed) {
            NProgress.start();
            router.replace("/settings/my-profile");
          }
        });
      return;
    }

    setLoading({ ...isLoading, booking: true });
    NProgress.start();

    if (selectedDate && selectedSlot && selectedDoctor) {
      const formattedDate = format(selectedDate, "dd/MM/yyyy");
      const encodedDate = btoa(formattedDate);
      const encodedTime = btoa(selectedSlot);
      const encodedDoctorId = btoa(selectedDoctor._id);
      router.replace(`/booking-details?time=${encodedTime}&date=${encodedDate}&doctorId=${encodedDoctorId}`);
    }
  };

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
            <div className="h-14 flex items-center gap-3 p-[10px] border border-gray-300 rounded-md cursor-default">
              <Image loading="lazy" src={clinic?.avatar} alt="Logo" width={40} height={40} className="object-cover" />
              <p className="font-medium text-ellipsis whitespace-nowrap overflow-hidden">{clinic?.name}</p>
            </div>
          </div>

          <SelectSpecialty
            selectedSpecialty={selectedSpecialty}
            setSelectedSpecialty={setSelectedSpecialty}
          />

          <SelectDoctor
            selectedDoctor={selectedDoctor}
            setSelectedDoctor={setSelectedDoctor}
            selectedSpecialty={selectedSpecialty}
          />

          <div className="flex flex-col gap-1 transition duration-500">
            <label className="text-sm font-semibold text-[#595959]">Ngày khám</label>
            <DatePicker selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
          </div>
        </div>

        <TimeButtons activeTime={activeTime} setActiveTime={setActiveTime} />

        {isLoading.schedule ? (
          <Spinner table className="py-16" />
        ) : (
          filteredTimeSlots?.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {filteredTimeSlots?.map((slot) => (
                <Button
                  type="button"
                  variant="default"
                  key={slot?.timeline}
                  disabled={slot?.isBooked}
                  onClick={() => setSelectedSlot(slot?.timeline)}
                  className={cn(
                    "h-14 p-3 font-medium text-black hover:text-white border border-transparent rounded-md shadow-md hover:shadow-lg text-center transition duration-500",
                    selectedSlot === slot?.timeline
                      ? "text-white" : "bg-[#f8f9fc] hover:bg-[#8f9fc] hover:text-black hover:border-primary"
                  )}
                >
                  {slot?.timeline}
                </Button>
              ))}
            </div>
          ) : (
            !selectedSpecialty || !selectedDoctor || !selectedDate ? (
              <div className="flex flex-col items-center gap-12 py-16 text-center">
                <Image loading="lazy" src="/calendar.svg" alt="Calendar Icon" width={110} height={110} />
                <p className="font-medium text-[#595959]">Vui lòng chọn chuyên khoa, bác sĩ và ngày khám!</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-12 py-16">
                <Image loading="lazy" src="/calendar.svg" alt="Calendar Icon" width={110} height={110} />
                <p className="font-medium text-[#595959]">Không tìm thấy lịch nào vào thời gian này!</p>
              </div>
            )
          )
        )}

        <p className="text-base sm:text-[17px] font-medium select-none">
          Giá từ: {""}
          <span className="text-[17px] sm:text-lg font-semibold text-[#009e5c]">100.000₫ - 1.000.000₫</span>
        </p>

        <Button
          type="button"
          size="xl"
          variant="submit"
          onClick={handleBookingAppointment}
          disabled={isLoading.booking || !selectedDate || !selectedSlot || userData?.role !== "user"}
        >
          {isLoading.booking ? "Đang xử lý..." : "Tiếp tục đặt lịch"}
        </Button>
      </div>
    </div>
  );
};

export default BookingForm;