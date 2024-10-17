"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { format, parse } from "date-fns";
import { getAllDoctors } from "@/services/doctor-service";
import { getScheduleById, updateSchedule } from "@/services/schedule-service"; // Updated to use updateSchedule
import { DoctorData } from "@/types/doctor-types";
import { generateTimeSlots } from "@/utils/generate-timeslots";
import { cn } from "@/lib/utils";

const EditSchedule = () => {
  const router = useRouter();
  const timeSlots = generateTimeSlots();
  const { scheduleId } = useParams<{ scheduleId: string }>();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [doctors, setDoctors] = useState<DoctorData[]>([]);
  const [doctorName, setDoctorName] = useState<string>("");
  const [timesError, setTimesError] = useState<string>("");

  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");

  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [initialTimes, setInitialTimes] = useState<string[]>([]); // Store initial time slots

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const accessToken = Cookies.get("access_token");
        if (!accessToken) return;

        const { doctors } = await getAllDoctors({ accessToken });
        setDoctors(doctors);
      } catch (err: any) {
        router.push("/");
        toast.error("Có lỗi xảy ra. Vui lòng thử lại sau ít phút nữa!");
      }
    };
    fetchDoctors();
  }, [router]);

  useEffect(() => {
    const fetchScheduleData = async () => {
      try {
        setIsLoading(true);
        const accessToken = Cookies.get("access_token");
        if (!accessToken) return;

        const { schedule } = await getScheduleById({ accessToken, id: scheduleId });

        if (schedule) {
          setDoctorName(schedule.doctor_id.fullname);
          setSelectedDoctor(schedule.doctor_id._id);
          setSelectedDate(parse(schedule.date, "dd/MM/yyyy", new Date()));

          // Map active time slots and track booked ones
          const activeSlots = schedule.timeSlots
            .map((slot: any) => slot.timeline);

          setSelectedTimes(activeSlots); // Activate available time slots
          setInitialTimes(activeSlots); // Store the initial active slots
        }
      } catch (err: any) {
        toast.error("Có lỗi xảy ra. Vui lòng thử lại sau ít phút nữa!");
        router.push("/");
      } finally {
        setIsLoading(false);
      }
    };

    fetchScheduleData();
  }, [scheduleId, router]);

  const toggleTimeSlot = (timeSlot: string) => {
    setTimesError("");
    setSelectedTimes((prev) =>
      prev.includes(timeSlot)
        ? prev.filter((time) => time !== timeSlot)
        : [...prev, timeSlot]
    );
  };

  const handleEditSchedule = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (selectedTimes.length === 0) {
      setTimesError("Vui lòng chọn ít nhất 1 giờ!");
      return;
    }

    try {
      setIsLoading(true);
      const accessToken = Cookies.get("access_token");
      if (!accessToken) return;

      // Nếu không có sự thay đổi, vẫn giữ nguyên timeSlots ban đầu
      let updatedTimeSlots = [...initialTimes.map(time => ({ type: "default", timeline: time, isBooked: false }))];

      // Kiểm tra những giờ đã thêm vào
      const addedTimes = selectedTimes.filter((time) => !initialTimes.includes(time));
      // Kiểm tra những giờ đã bị xóa
      const removedTimes = initialTimes.filter((time) => !selectedTimes.includes(time));

      // Cập nhật các time slot đã thêm hoặc xóa
      if (addedTimes.length > 0 || removedTimes.length > 0) {
        updatedTimeSlots = [
          ...addedTimes.map(time => ({ type: "default", timeline: time, isBooked: false }))
        ];
      }

      await updateSchedule({
        id: scheduleId[0],
        accessToken,
        doctor_id: selectedDoctor,
        date: selectedDate && format(selectedDate, "dd/MM/yyyy"),
        timeSlots: updatedTimeSlots,
      });

      setIsLoading(false);
      toast.success("Cập nhật lịch trình thành công!");
      router.push("/admin/schedules"); // Quay lại trang danh sách lịch trình sau khi cập nhật
    } catch (err: any) {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại sau ít phút nữa!");
      setIsLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-xl font-bold mb-4">Chỉnh sửa lịch trình</h1>
      <form onSubmit={handleEditSchedule}>
        <div className="flex flex-col gap-8 pb-6">
          <div className="flex flex-col gap-8 -mx-4 px-4">
            <div className="flex flex-col gap-2">
              <label className="text-[17px] font-semibold">Bác sĩ</label>
              <Select onValueChange={(value) => setSelectedDoctor(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={`${doctorName}` || "Chọn bác sĩ"} />
                </SelectTrigger>
                <SelectContent>
                  {doctors?.map((doctor) => (
                    <SelectItem key={doctor?._id} value={doctor?._id}>
                      {doctor?.fullname}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[17px] font-semibold">Chọn ngày</label>
              <DatePicker
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                placeholder="Chọn ngày"
                className="h-14"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[17px] font-semibold">Chọn thời gian</label>
              <div className="grid grid-cols-5 gap-4">
                {timeSlots.map((timeSlot) => (
                  <Button
                    type="button"
                    key={timeSlot}
                    className={cn(
                      "w-full h-14 text-base shadow-none transition duration-500",
                      selectedTimes.includes(timeSlot)
                        ? "text-white bg-primary"
                        : "text-black hover:text-white border bg-transparent",
                      timesError && "border-red-500 hover:border-transparent"
                    )}
                    onClick={() => toggleTimeSlot(timeSlot)}
                  >
                    {timeSlot}
                  </Button>
                ))}
              </div>

              {timesError && <p className="text-red-500 text-sm">{timesError}</p>}
            </div>
          </div>

          <div className="flex items-center justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/schedules")}
              className="min-w-[130px] h-[3.2rem] shadow-md transition duration-500"
            >
              Hủy
            </Button>

            <Button
              type="submit"
              variant="default"
              disabled={isLoading}
              className="min-w-[130px] h-[3.2rem] shadow-md transition duration-500"
            >
              {isLoading ? "Đang cập nhật..." : "Cập nhật"}
            </Button>
          </div>
        </div>
      </form>
    </>
  );
};

export default EditSchedule;