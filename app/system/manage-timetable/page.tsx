"use client";

import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import Image from "next/image";

import { jwtDecode, JwtPayload } from "jwt-decode";
import { FaAngleRight, FaChevronLeft } from "react-icons/fa6";
import Cookies from "js-cookie";

import { daysOfWeek } from "@/constants/days-of-week";
import { ScheduleData, TimeSlot } from "@/types/schedule-types";
import { getSchedulesByRange } from "@/services/schedule-service";

import {
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableHeader
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import Spinner from "@/components/spinner";

const ManageTimetable = () => {
  const timePeriods: Array<"Sáng" | "Trưa" | "Chiều"> = ["Sáng", "Trưa", "Chiều"];
  const periodRanges = { Sáng: ["06:00", "12:00"], Trưa: ["12:00", "18:00"], Chiều: ["18:00", "00:00"] };

  const [isLoading, setLoading] = useState<boolean>(false);
  const [schedules, setSchedules] = useState<ScheduleData[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    const fetchSchedules = async () => {
      const accessToken = Cookies.get("access_token");
      if (!accessToken || !selectedDate) return;

      const decodedToken: any = jwtDecode<JwtPayload>(accessToken);
      if (!decodedToken) return;
      setLoading(true);

      const startDate = new Date(selectedDate);
      const dayOfWeek = startDate.getDay();

      const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      startDate.setDate(startDate.getDate() + mondayOffset);

      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);

      try {
        const { schedules } = await getSchedulesByRange({
          doctor_id: decodedToken.doctor_id, startDate, endDate
        });
        setSchedules(schedules);
      } catch (error: any) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, [selectedDate]);

  const goToNextWeek = () => {
    if (selectedDate) {
      const nextWeek = new Date(selectedDate);
      nextWeek.setDate(selectedDate.getDate() + 7);
      setSelectedDate(nextWeek);
    }
  };

  const goToPreviousWeek = () => {
    if (selectedDate) {
      const previousWeek = new Date(selectedDate);
      previousWeek.setDate(selectedDate.getDate() - 7);
      setSelectedDate(previousWeek);
    }
  };

  const getWeekDates = (startDate: Date | undefined) => {
    if (!startDate) return [];
    const dates = [];
    const currentMonday = new Date(startDate);
    const day = currentMonday.getDay();
    currentMonday.setDate(currentMonday.getDate() - (day === 0 ? 6 : day - 1));

    for (let i = 0; i < 7; i++) {
      const date = new Date(currentMonday);
      date.setDate(currentMonday.getDate() + i);
      dates.push(date);
    }

    return dates;
  };

  const weekDates = getWeekDates(selectedDate);

  const getTimeSlotsForPeriod = (timeSlots: TimeSlot[], period: "Sáng" | "Trưa" | "Chiều") => {
    const [start, end] = periodRanges[period];
    return timeSlots.filter((slot: TimeSlot) => slot.timeline >= start && slot.timeline < end);
  };

  const getScheduleForDate = (date: Date): ScheduleData | undefined => {
    const dateString = date.toISOString().split("T")[0];

    return schedules?.find((schedule) => {
      const scheduleDate = schedule.date && new Date(schedule.date);
      return scheduleDate?.toISOString().split("T")[0] === dateString;
    });
  };

  if (isLoading) {
    return <Spinner center />;
  }

  return (
    <div className="h-full flex flex-col gap-6">
      <h1 className="text-xl font-bold mb-4">Thời khóa biểu của tôi</h1>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 mr-2 rounded-sm" />
            <span>Đã đặt</span>
          </div>

          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 mr-2 rounded-sm" />
            <span>Chưa đặt</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-6">
          <DatePicker
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            placeholder="Chọn ngày"
            className={cn("h-12", selectedDate ? "w-fit" : "w-[240px]")}
          />

          <div className="flex items-center gap-3">
            <Button
              onClick={goToPreviousWeek}
              className="h-12 flex items-center gap-2 bg-blue-500 text-white px-6 rounded-md transition duration-500"
            >
              <FaChevronLeft size={12} /> <p>Trước</p>
            </Button>

            <Button
              onClick={goToNextWeek}
              className="h-12 flex items-center gap-2 bg-blue-500 text-white px-6 rounded-md transition duration-500"
            >
              <p>Tiếp</p> <FaAngleRight size={12} />
            </Button>
          </div>
        </div>
      </div>

      {selectedDate ? (
        <Table className="min-w-full border-collapse border-x border-t border-b-[3px] border-gray-300 rounded-lg overflow-hidden">
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="text-base text-black font-semibold border-x border-t border-b-[3px] border-gray-300 p-2 rounded-tl-lg rounded-tr-lg">
                Thời gian
              </TableHead>
              {daysOfWeek.map((day, index) => (
                <TableHead key={index} className="text-base font-semibold text-primary border-x border-t border-b-[3px] border-gray-300 p-2">
                  {day}
                </TableHead>
              ))}
            </TableRow>
            <TableRow className="bg-gray-200">
              <TableHead className="text-base text-black font-semibold border-x border-t border-b-[3px] border-gray-300 p-2">
                Ngày
              </TableHead>
              {weekDates.map((date, index) => (
                <TableHead
                  key={index}
                  className="text-[15px] text-black border-x border-t border-b-[3px] border-gray-300 p-2"
                >
                  {date.getDate()}/{date.getMonth() + 1}/{date.getFullYear()}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {timePeriods.map((period, periodIndex) => (
              <TableRow key={periodIndex} className="h-[200px]">
                <TableCell className="text-base font-semibold border-x border-t border-b-[3px] border-gray-300 p-2 text-center">
                  {period}
                </TableCell>
                {weekDates.map((date, dayIndex) => {
                  const schedule = getScheduleForDate(date);
                  const timeSlots = schedule ? getTimeSlotsForPeriod(schedule.timeSlots, period) : [];

                  return (
                    <TableCell key={dayIndex} className={cn("relative border-x border-t border-b-[3px] border-gray-300")}>
                      <div className="flex flex-col gap-2 p-2 bg-transparent relative z-10">
                        {timeSlots.length > 0 ? (
                          timeSlots.map((slot, slotIndex) => (
                            <p
                              key={slotIndex}
                              className={cn(
                                "font-semibold text-white p-3 rounded-md text-center",
                                slot.isBooked ? "bg-red-500" : "bg-green-500"
                              )}
                            >
                              {slot.timeline}
                            </p>
                          ))
                        ) : null}
                      </div>

                      <div className="absolute inset-0 grid grid-cols-6 z-0">
                        {Array.from({ length: 48 }).map((_, index) => (
                          <div
                            key={index}
                            className={cn(
                              "flex-1 h-full border",
                              {
                                "border-t-0": index < 6,
                                "border-b-0": index >= 30,
                                "border-l-0": index % 6 === 0,
                                "border-r-0": (index + 1) % 6 === 0
                              }
                            )}
                          />
                        ))}
                      </div>
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="w-full flex flex-col items-center justify-center gap-12 pt-8">
          <Image loading="lazy" src="/not-found.png" alt="Not found" width="240" height="240" />
          <h1 className="text-xl font-semibold text-[#262626] text-center">
            Rất tiếc, hiện tại không tìm thấy lịch trình nào. Vui lòng chọn ngày!
          </h1>
        </div>
      )}
    </div>
  );
};

export default ManageTimetable;