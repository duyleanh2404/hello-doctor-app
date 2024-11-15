"use client";

import { cn } from "@/lib/utils";
import { useState, useEffect, Suspense, lazy } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { format } from "date-fns";
import Swal from "sweetalert2";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

import { BiClinic } from "react-icons/bi";
import { IoLocationOutline } from "react-icons/io5";

import { RootState } from "@/store/store";
import { useSelector } from "react-redux";

import { getSchedule } from "@/services/schedule-service";
import { ScheduleData, TimeSlot } from "@/types/schedule-types";
import { ActiveTime, timeRanges } from "@/constants/time-ranges";
import useDoctor from "@/hooks/fetch/user-doctor";

import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import Hint from "@/components/hint";
import Spinner from "@/components/spinner";
import Breadcrumb from "@/components/breadcrumb";
import Billboard from "@/components/advertises/billboard";
import TimeButtons from "../../../components/time-buttons";

const Advertise = lazy(() => import("@/components/advertises/advertise"));

const DoctorDetailsPage = () => {
  const router = useRouter();
  const { isLoggedIn, userData } = useSelector((state: RootState) => state.auth);

  const { doctorId } = useParams<{ doctorId: string }>();
  const doctor = useDoctor(atob(doctorId));

  const [showBillboard, setShowBillboard] = useState<boolean>(false);
  const [isLoading, setLoading] = useState({ schedule: false, booking: false });

  const [schedule, setSchedule] = useState<ScheduleData | null>(null);
  const [activeTime, setActiveTime] = useState<ActiveTime>("morning");
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [filteredTimeSlots, setFilteredTimeSlots] = useState<TimeSlot[]>([]);

  const today = new Date();
  today.setUTCHours(-7, 0, 0, 0);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(today);

  useEffect(() => {
    NProgress.done();
    const shouldShowBillboard = Math.random() > 0.5;
    setShowBillboard(shouldShowBillboard);
  }, []);

  useEffect(() => {
    if (!selectedDate) setFilteredTimeSlots([]);
  }, [selectedDate]);

  useEffect(() => {
    const fetchSchedule = async () => {
      if (!selectedDate) return;
      resetState();
      setLoading({ ...isLoading, schedule: true });

      try {
        const { schedule } = await getSchedule({
          doctor_id: atob(doctorId), date: selectedDate
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
  }, [selectedDate]);

  useEffect(() => {
    if (!schedule?.timeSlots) return;

    const filteredTimeSlots = schedule.timeSlots.filter((slot: TimeSlot) => {
      const { start, end } = timeRanges[activeTime];
      return slot.timeline >= start && slot.timeline < end;
    });

    setFilteredTimeSlots(filteredTimeSlots);
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

    NProgress.start();
    setLoading({ ...isLoading, booking: true });
    const formattedDate = format(selectedDate!, "dd/MM/yyyy");
    const encodedDate = btoa(formattedDate);
    const encodedTime = btoa(selectedSlot!);
    router.replace(`/booking-details?time=${encodedTime}&date=${encodedDate}&doctorId=${doctorId}`);
  };

  if (!doctor) {
    return <Spinner center />;
  }

  return (
    <div className="flex flex-col gap-6 sm:gap-12">
      <div className="flex flex-col">
        <Breadcrumb
          labels={[
            { label: "Đặt lịch khám bệnh", href: "/booking-doctor" },
            { label: doctor?.fullname || "Đang tải..." }
          ]}
        />

        <div className="wrapper w-full flex flex-col sm:flex-row items-center gap-6 py-8 border-b">
          <div className="relative w-[120px] h-[120px]">
            <Image
              fill
              alt="Avatar"
              loading="lazy"
              sizes="(max-width: 768px) 100px, 120px"
              src={doctor?.image}
              className="w-full h-full object-cover rounded-full"
            />
          </div>

          <div className="flex flex-col items-center sm:items-start gap-4">
            <h1 className="text-xl sm:text-2xl font-bold">{doctor?.fullname}</h1>
            <div className="flex items-center gap-2">
              <Image src={doctor?.specialty_id?.image} alt="Specialty" width={28} height={28} />
              <p className="text-base font-semibold text-primary">{doctor?.specialty_id?.name}</p>
            </div>
            <div className="flex items-center gap-4 mt-4 sm:mt-0">
              <div className="w-fit py-2 px-4 text-primary border border-[#2d87f3] bg-[#e3f2ff] rounded-full">
                Đặt lịch khám
              </div>
              <p className="w-fit py-2 px-4 bg-[#f8f9fc] rounded-full">Dành cho người lớn</p>
            </div>
          </div>
        </div>
      </div>

      <div className="sm:wrapper w-full flex flex-col lg:flex-row gap-12 lg:gap-8 sm:pb-16">
        <div className="wrapper w-full lg:w-[65%]" dangerouslySetInnerHTML={{ __html: doctor?.desc }} />

        <div className="relative w-full lg:w-auto flex-1 flex flex-col gap-8">
          <div className="h-fit flex flex-col gap-8 pt-6 pb-10 px-6 sm:pt-6 sm:pb-10 sm:px-6 bg-[#F8F9FC] shadow-xl sm:shadow-lg rounded-t-3xl sm:rounded-2xl">
            <h1 className="text-lg font-bold border-l-4 border-primary pl-4">Đặt lịch hẹn</h1>
            <div className="flex flex-col text-[#404040]">
              <Hint label="Xem chi tiết bệnh viện">
                <Link
                  href={`/clinic-details/${btoa(doctor?.clinic_id?._id)}`}
                  className="group flex items-center gap-3 p-3 hover:bg-[#e3f2ff] rounded-md transition duration-500"
                >
                  <BiClinic className="flex-shrink-0 size-5 group-hover:text-primary transition duration-500" />
                  <p className="text-sm font-medium">{doctor?.clinic_id?.name}</p>
                </Link>
              </Hint>

              <div className="flex items-center gap-3 p-3">
                <IoLocationOutline className="flex-shrink-0 size-5" />
                <p className="text-sm font-medium">{doctor?.clinic_id?.address}</p>
              </div>
            </div>

            <div className="flex flex-col gap-8 pt-6 pb-10 px-6 sm:pt-6 sm:pb-10 sm:px-6 bg-white rounded-2xl shadow-md">
              <h1 className="text-lg font-bold">Tư vấn trực tiếp</h1>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-[#595959]">Ngày khám</label>
                <DatePicker placeholder="Chọn ngày khám" selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
              </div>

              <TimeButtons activeTime={activeTime} setActiveTime={setActiveTime} />

              {isLoading.schedule ? (
                <Spinner table className="py-16" />
              ) : (
                filteredTimeSlots?.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4">
                    {filteredTimeSlots?.map((slot: TimeSlot) => (
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
                  <div className="flex flex-col items-center gap-12 py-16">
                    <Image loading="lazy" src="/calendar.svg" alt="Calendar Icon" width={110} height={110} />
                    <p className="font-medium text-[#595959] text-center">Không tìm thấy lịch nào vào thời gian này!</p>
                  </div>
                )
              )}

              <p className="text-base sm:text-[17px] font-medium select-none">
                Giá từ: {""}
                <span className="text-[17px] sm:text-lg font-semibold text-[#009e5c]">200.000₫ - 1.000.000₫</span>
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

          <Suspense fallback={<Spinner table />}><Advertise /></Suspense>
        </div>
      </div>

      {showBillboard && <Billboard />}
    </div>
  );
};

export default DoctorDetailsPage;