"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import { format } from "date-fns";
import { getAllDoctors } from "@/services/doctor-service";
import { createNewSchedule } from "@/services/schedule-service";
import { DoctorData } from "@/types/doctor-types";
import { generateTimeSlots } from "@/utils/generate-timeslots";
import { cn } from "@/lib/utils";

const CreateNewSchedule = () => {
  const router = useRouter();
  const timeSlots = generateTimeSlots();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [doctors, setDoctors] = useState<DoctorData[]>([]);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);

  const [dateError, setDateError] = useState<string>("");
  const [doctorError, setDoctorError] = useState<string>("");
  const [timesError, setTimesError] = useState<string>("");

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

  const toggleTimeSlot = (timeSlot: string) => {
    setTimesError("");
    setSelectedTimes((prev) =>
      prev.includes(timeSlot)
        ? prev.filter((time) => time !== timeSlot)
        : [...prev, timeSlot]
    );
  };

  const handleCreateNewSchedule = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setDateError("");
    setDoctorError("");
    setTimesError("");

    let hasError = false;

    if (!selectedDate) {
      setDateError("Vui lòng chọn ngày!");
      hasError = true;
    }
    if (!selectedDoctor) {
      setDoctorError("Vui lòng chọn bác sĩ!");
      hasError = true;
    }
    if (selectedTimes.length === 0) {
      setTimesError("Vui lòng chọn thời gian!");
      hasError = true;
    }

    if (hasError) return;

    setIsLoading(true);
    const accessToken = Cookies.get("access_token");
    if (!accessToken) return;

    const { statusCode } = await createNewSchedule({
      accessToken,
      doctor_id: selectedDoctor,
      timeSlots: selectedTimes.map((time) => ({
        type: "default",
        timeline: time,
        isBooked: false,
      })),
      date: selectedDate && format(selectedDate, "dd/MM/yyyy"),
    });

    if (statusCode === 409) {
      toast.error("Lịch trình này đã tồn tại!");
      setSelectedDate(undefined);
      setSelectedDoctor("");
      setSelectedTimes([]);
      setIsLoading(false);
      return;
    }

    toast.success("Thêm lịch trình thành công!");
    setSelectedDate(undefined);
    setSelectedDoctor("");
    setSelectedTimes([]);
    setIsLoading(false);
    router.push("/admin/schedules");
  };

  return (
    <>
      <h1 className="text-xl font-bold mb-4">Thêm lịch trình mới</h1>
      <form onSubmit={handleCreateNewSchedule}>
        <div className="flex flex-col gap-8 pb-6">
          <div className="flex flex-col gap-8 -mx-4 px-4">
            <div className="flex flex-col gap-2">
              <label className="text-[17px] font-semibold">Bác sĩ</label>
              <Select onValueChange={(value) => {
                setSelectedDoctor(value);
                setDoctorError("");
              }}>
                <SelectTrigger className={cn("w-full", doctorError && "border-red-500")}>
                  <SelectValue placeholder="Chọn bác sĩ" />
                </SelectTrigger>
                <SelectContent>
                  {doctors?.map((doctor) => (
                    <SelectItem key={doctor?._id} value={doctor?._id}>
                      {doctor?.fullname}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {doctorError && <p className="text-red-500 text-sm">{doctorError}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[17px] font-semibold">Chọn ngày</label>
              <DatePicker
                dateError={dateError}
                setDateError={setDateError}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                placeholder="Chọn ngày"
                className="h-14"
              />

              {dateError && <p className="text-red-500 text-sm">{dateError}</p>}
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
                      selectedTimes.includes(timeSlot) ? "text-white bg-primary" : "text-black hover:text-white border bg-transparent",
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
              {isLoading ? "Đang tạo..." : "Tạo mới"}
            </Button>
          </div>
        </div>
      </form>
    </>
  );
};

export default CreateNewSchedule;