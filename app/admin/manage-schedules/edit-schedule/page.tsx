"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { parse } from "date-fns";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

import { TimeSlot } from "@/types/schedule-types";
import { generateTimeSlots } from "@/utils/generate-timeslots";
import { editSchedule, getSchedule } from "@/services/schedule-service";

import { Button } from "@/components/ui/button";

const EditSchedule = () => {
  const router = useRouter();

  const [timesError, setTimesError] = useState<string>("");
  const [isLoading, setLoading] = useState<boolean>(false);

  const timeSlots = generateTimeSlots();
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);

  const searchParams = useSearchParams();
  const doctorId = searchParams.get("doctorId");
  const scheduleId = searchParams.get("scheduleId");
  const date = searchParams.get("date");

  useEffect(() => {
    const fetchScheduleData = async () => {
      try {
        const { schedule } = await getSchedule({ schedule_id: atob(scheduleId!) });
        const activeSlots = schedule.timeSlots?.map((slot: TimeSlot) => slot.timeline);
        setSelectedTimes(activeSlots);
      } catch (error: any) {
        console.error(error);
      }
    };

    fetchScheduleData();
  }, []);

  const handleSelectTimeSlot = (timeSlot: string) => {
    setTimesError("");
    setSelectedTimes((prev) =>
      prev.includes(timeSlot) ? prev.filter((time) => time !== timeSlot) : [...prev, timeSlot]
    );
  };

  const validateForm = (): boolean => {
    if (selectedTimes?.length === 0) {
      setTimesError("Vui lòng chọn ít nhất 1 giờ!");
      return true;
    }

    return false;
  };

  const handleEditSchedule = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const accessToken = Cookies.get("access_token");
    if (!accessToken) return;

    const validationError = validateForm();
    if (validationError) return;
    setLoading(true);

    try {
      const updatedTimeSlots = [
        ...selectedTimes?.map(time => ({ timeline: time, isBooked: false }))
      ];

      const formattedDate = parse(atob(date!), "dd/MM/yyyy", new Date());
      await editSchedule(
        accessToken,
        {
          id: atob(scheduleId!),
          doctor_id: atob(doctorId!),
          date: formattedDate,
          timeSlots: updatedTimeSlots
        }
      );

      toast.success("Cập nhật lịch trình thành công!");
    } catch (error: any) {
      console.error(error);
      toast.error("Cập nhật lịch trình thất bại. Vui lòng thử lại sau ít phút nữa!");
    } finally {
      router.replace("/admin/manage-schedules");
    }
  };

  return (
    <>
      <h1 className="text-xl font-bold mb-4">Chỉnh sửa lịch trình</h1>
      <form onSubmit={handleEditSchedule}>
        <div className="flex flex-col gap-8 pb-6">
          <div className="flex flex-col gap-8 -mx-4 px-4">
            <div className="flex flex-col gap-2">
              <label className="text-[17px] font-semibold">Chọn thời gian</label>
              <div className="grid grid-cols-5 gap-4">
                {timeSlots?.map((timeSlot) => (
                  <Button
                    type="button"
                    key={timeSlot}
                    onClick={() => handleSelectTimeSlot(timeSlot)}
                    className={cn(
                      "w-full h-14 text-base shadow-none transition duration-500",
                      selectedTimes?.includes(timeSlot)
                        ? "text-white bg-primary" : "text-black hover:text-white border bg-transparent",
                      timesError && "border-red-500 hover:border-transparent"
                    )}
                  >
                    {timeSlot}
                  </Button>
                ))}
              </div>
              {timesError && <p className="text-red-500 text-sm">{timesError}</p>}
            </div>
          </div>

          <div className="flex items-center justify-end gap-4">
            <Button type="button" size="lg" variant="cancel" onClick={() => router.replace("/admin/manage-schedules")}>
              Hủy
            </Button>
            <Button type="submit" size="lg" variant="submit" disabled={isLoading}>
              {isLoading ? "Đang cập nhật..." : "Cập nhật"}
            </Button>
          </div>
        </div>
      </form>
    </>
  );
};

export default EditSchedule;