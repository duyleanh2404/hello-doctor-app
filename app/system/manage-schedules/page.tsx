"use client";

import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

import { jwtDecode, JwtPayload } from "jwt-decode";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

import { generateTimeSlots } from "@/utils/generate-timeslots";
import { ScheduleData, TimeSlot } from "@/types/schedule-types";
import { getSchedule, editSchedule, createSchedule } from "@/services/schedule-service";

import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import Spinner from "@/components/spinner";

const ManageSchedules = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isAddingOrEditing, setIsAddingOrEditing] = useState<boolean>(false);

  const timeSlots = generateTimeSlots();
  const [timesError, setTimesError] = useState<string>("");

  const [schedule, setSchedule] = useState<ScheduleData | null>(null);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);

  const today = new Date();
  today.setUTCHours(-7, 0, 0, 0);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(today);

  useEffect(() => {
    if (selectedTimes.length > 0) {
      setSchedule(null);
      setSelectedTimes([]);
    }
  }, [selectedDate]);

  useEffect(() => {
    const fetchScheduleData = async () => {
      const accessToken = Cookies.get("access_token");
      if (!accessToken || !selectedDate) return;

      const decodedToken: any = jwtDecode<JwtPayload>(accessToken);
      if (!decodedToken) return;
      setLoading(true);

      try {
        const { schedule } = await getSchedule({
          date: selectedDate, doctor_id: decodedToken.doctor_id
        });
        setSchedule(schedule);

        const activeSlots = schedule.timeSlots?.map((slot: TimeSlot) => slot.timeline);
        setSelectedTimes(activeSlots);
      } catch (error: any) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchScheduleData();
  }, [selectedDate]);

  const toggleTimeSlot = (timeSlot: string) => {
    setTimesError("");
    setSelectedTimes((prev) =>
      prev.includes(timeSlot) ? prev.filter((time) => time !== timeSlot) : [...prev, timeSlot]
    );
  };

  const resetForm = () => {
    setSelectedTimes([]);
    setSelectedDate(undefined);
  };

  const isValidTimes = () => {
    if (selectedTimes.length === 0) {
      setTimesError("Vui lòng chọn ít nhất 1 giờ!");
      return false;
    }
    return true;
  };

  const handleAddOrEditSchedule = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTimesError("");

    if (!isValidTimes()) return;

    const accessToken = Cookies.get("access_token");
    if (!accessToken) return;

    const decodedToken: any = jwtDecode<JwtPayload>(accessToken);
    if (!decodedToken || !decodedToken.doctor_id) return;
    setIsAddingOrEditing(true);

    const timeSlots = selectedTimes.map((time: string) => ({ timeline: time, isBooked: false }));

    try {
      if (schedule) {
        await editSchedule(
          accessToken,
          { id: schedule._id, doctor_id: decodedToken.doctor_id, date: selectedDate, timeSlots }
        );
        toast.success("Cập nhật lịch trình thành công!");
      } else {
        await createSchedule(
          accessToken,
          { doctor_id: decodedToken.doctor_id, date: selectedDate!, timeSlots }
        );
        toast.success("Thêm lịch trình thành công!");
      }
    } catch (status: any) {
      handleError(status);
    } finally {
      setIsAddingOrEditing(false);
    }
  };

  const handleError = (status: number) => {
    if (status === 409) {
      toast.error("Lịch trình này đã tồn tại!");
      resetForm();
    } else {
      toast.error("Thêm lịch trình thất bại!");
    }
  };

  if (isLoading) {
    return <Spinner center />;
  }

  return (
    <>
      <h1 className="text-xl font-bold mb-4">Thêm hoặc chỉnh sửa lịch trình</h1>
      <form onSubmit={handleAddOrEditSchedule}>
        <div className="flex flex-col gap-8 pb-6">
          <div className="flex flex-col gap-8 -mx-4 px-4">
            <div className="flex flex-col gap-2">
              <label className="text-[17px] font-semibold">Chọn ngày</label>
              <DatePicker
                placeholder="Chọn ngày"
                disableDate={today}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[17px] font-semibold">Chọn thời gian</label>
              <div className="grid grid-cols-5 gap-4">
                {timeSlots?.map((timeSlot) => {
                  const isBooked = schedule?.timeSlots?.find((slot: any) => slot.timeline === timeSlot && slot.isBooked);

                  return (
                    <Button
                      type="button"
                      key={timeSlot}
                      disabled={!!isBooked}
                      onClick={() => toggleTimeSlot(timeSlot)}
                      className={cn(
                        "w-full h-14 text-base shadow-none transition duration-500",
                        selectedTimes.includes(timeSlot)
                          ? "text-white bg-primary" : "text-black hover:text-white border bg-transparent",
                        timesError && "border-red-500 hover:border-transparent"
                      )}
                    >
                      {timeSlot}
                    </Button>
                  );
                })}
              </div>
              {timesError && <p className="text-red-500 text-sm">{timesError}</p>}
            </div>
          </div>

          {selectedDate && (
            <Button
              type="submit"
              variant="default"
              disabled={isAddingOrEditing}
              className={cn(
                "min-w-[130px] h-[3.2rem] ml-auto shadow-md transition duration-500",
                isAddingOrEditing && "opacity-50 cursor-not-allowed"
              )}
            >
              {!schedule ? (
                isAddingOrEditing ? "Đang tạo..." : "Tạo mới"
              ) : (
                isAddingOrEditing ? "Đang cập nhật..." : "Cập nhật"
              )}
            </Button>
          )}
        </div>
      </form>
    </>
  );
};

export default ManageSchedules;