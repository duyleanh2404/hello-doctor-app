"use client";

import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

import Cookies from "js-cookie";
import toast from "react-hot-toast";

import { DoctorData } from "@/types/doctor-types";
import { generateTimeSlots } from "@/utils/generate-timeslots";

import { getAllDoctors } from "@/services/doctor-service";
import { getSchedule, editSchedule } from "@/services/schedule-service";

import useDebounce from "@/hooks/use-debounce";
import useClickOutside from "@/hooks/use-click-outside";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import Spinner from "@/components/spinner";

const EditSchedule = () => {
  const router = useRouter();

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const { scheduleId } = useParams<{ scheduleId: string }>();

  const timeSlots = generateTimeSlots();
  const [errorMessage, setErrorMessage] = useState({ doctors: "", times: "", date: "" });

  const [isLoading, setLoading] = useState<boolean>(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);

  const [doctors, setDoctors] = useState<DoctorData[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorData | null>(null);

  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  const [query, setQuery] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");
  const debouncedQuery = useDebounce(query, 500);

  useClickOutside(dropdownRef, () => setIsDropdownVisible(false));

  useEffect(() => {
    const fetchScheduleData = async () => {
      try {
        const { schedule } = await getSchedule({ schedule_id: atob(scheduleId[0]) });
        setSelectedDate(schedule?.date);
        setSelectedDoctor(schedule?.doctor_id);

        const activeSlots = schedule?.timeSlots?.map((slot: any) => slot.timeline);
        setSelectedTimes(activeSlots);
      } catch (error: any) {
        toast.error("Có lỗi xảy ra. Vui lòng thử lại sau ít phút nữa!");
      }
    };

    fetchScheduleData();
  }, []);

  const fetchDoctors = async (
    query?: string, province?: string, specialty_id?: string
  ) => {
    try {
      const { doctors } = await getAllDoctors({
        query,
        province,
        specialty_id,
        exclude: "specialty_id, clinic_id, desc, medicalFee"
      });
      setDoctors(doctors);
    } catch (error: any) {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại sau ít phút nữa!");
    }
  };

  useEffect(() => {
    fetchDoctors(debouncedQuery);
  }, [debouncedQuery]);

  useEffect(() => {
    if (selectedDoctor) setInputValue(selectedDoctor?.fullname);
  }, [selectedDoctor]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);
    setInputValue(value);
    setIsDropdownVisible(true);
  };

  const handleSelectTimeSlot = (timeSlot: string) => {
    setErrorMessage({ ...errorMessage, times: "" });
    setSelectedTimes((prev) =>
      prev.includes(timeSlot) ? prev.filter((time) => time !== timeSlot) : [...prev, timeSlot]
    );
  };

  const handleEditSchedule = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsDropdownVisible(false);

    if (inputValue !== selectedDoctor?.fullname || !selectedDoctor) {
      setErrorMessage({ ...errorMessage, doctors: "Vui lòng chọn bác sĩ" });
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    } else {
      setErrorMessage({ ...errorMessage, doctors: "" });
    }

    if (!selectedDate) {
      setErrorMessage({ ...errorMessage, date: "Vui lòng chọn ngày!" });
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (selectedTimes?.length === 0) {
      setErrorMessage({ ...errorMessage, times: "Vui lòng chọn ít nhất 1 giờ!" });
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const accessToken = Cookies.get("access_token");
    if (!accessToken || !selectedDoctor) return;

    setLoading(true);

    try {
      const updatedTimeSlots = [
        ...selectedTimes?.map(time => ({
          timeline: time,
          isBooked: false
        }))
      ];

      await editSchedule(
        accessToken,
        {
          id: atob(scheduleId[0]),
          doctor_id: selectedDoctor?._id,
          date: selectedDate,
          timeSlots: updatedTimeSlots
        }
      );

      toast.success("Cập nhật lịch trình thành công!");
    } catch (error: any) {
      toast.error("Cập nhật lịch trình thất bại. Vui lòng thử lại sau ít phút nữa!");
    } finally {
      router.replace("/admin/manage-schedules");
    }
  };

  if (!selectedDoctor || !selectedDate || selectedTimes.length === 0) {
    return <Spinner center />;
  }

  return (
    <>
      <h1 className="text-xl font-bold mb-4">Chỉnh sửa lịch trình</h1>

      <form onSubmit={handleEditSchedule}>
        <div className="flex flex-col gap-8 pb-6">
          <div className="flex flex-col gap-8 -mx-4 px-4">
            <div className="flex flex-col gap-2">
              <label className="text-[17px] font-semibold">Bác sĩ</label>
              <div ref={dropdownRef} className="relative w-full lg:w-auto flex-1">
                <Input
                  value={inputValue}
                  spellCheck={false}
                  onChange={handleInputChange}
                  placeholder="Tìm kiếm theo tên bác sĩ"
                  onFocus={() => setIsDropdownVisible(true)}
                  className={cn(errorMessage.doctors ? "border-red-500" : "border-gray-300")}
                />

                <div
                  onClick={(event) => event.stopPropagation()}
                  className={cn(
                    "absolute top-[calc(100%+10px)] left-0 w-full max-h-[400px] py-2 bg-white border rounded-lg shadow-md z-10 transition duration-500 overflow-y-auto select-none",
                    isDropdownVisible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                  )}
                >
                  {doctors?.length > 0 ? (
                    doctors?.map((doctor: DoctorData) => (
                      <Button
                        type="button"
                        variant="ghost"
                        key={doctor?._id}
                        onClick={() => {
                          setSelectedDoctor(doctor);
                          setIsDropdownVisible(false);
                          setInputValue(doctor?.fullname);
                        }}
                        className="w-full h-14 flex items-center justify-start gap-4 hover:text-primary transition duration-500"
                      >
                        <Image
                          loading="lazy"
                          src={doctor?.image}
                          alt={doctor?.fullname}
                          width="40"
                          height="40"
                          className="object-cover rounded-full"
                        />
                        <p className="w-fit font-medium text-ellipsis overflow-hidden">
                          {doctor?.fullname}
                        </p>
                      </Button>
                    ))
                  ) : (
                    <p className="text-sm font-medium text-[#595959] text-center p-12 mx-auto">
                      Không tìm thấy bác sĩ nào!
                    </p>
                  )}
                </div>
              </div>
              {errorMessage.doctors && (
                <p className="text-red-500 text-sm">{errorMessage.doctors}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[17px] font-semibold">Chọn ngày</label>
              <DatePicker
                className="h-14"
                placeholder="Chọn ngày"
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
              />
              {errorMessage.date && (
                <p className="text-red-500 text-sm">{errorMessage.date}</p>
              )}
            </div>

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
                        ? "text-white bg-primary"
                        : "text-black hover:text-white border bg-transparent",
                      errorMessage.times && "border-red-500 hover:border-transparent"
                    )}
                  >
                    {timeSlot}
                  </Button>
                ))}
              </div>
              {errorMessage.times && (
                <p className="text-red-500 text-sm">{errorMessage.times}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-4">
            <Button
              type="button"
              size="lg"
              variant="cancel"
              onClick={() => router.replace("/admin/manage-schedules")}
            >
              Hủy
            </Button>

            <Button
              type="submit"
              size="lg"
              variant="submit"
              disabled={isLoading}
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