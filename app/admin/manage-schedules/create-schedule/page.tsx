"use client";

import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

import Cookies from "js-cookie";
import toast from "react-hot-toast";

import { DoctorData } from "@/types/doctor-types";
import { generateTimeSlots } from "@/utils/generate-timeslots";

import { getAllDoctors } from "@/services/doctor-service";
import { createSchedule } from "@/services/schedule-service";

import useDebounce from "@/hooks/use-debounce";
import useClickOutside from "@/hooks/use-click-outside";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import Spinner from "@/components/spinner";

const CreateSchedule = () => {
  const router = useRouter();

  const [errors, setErrors] = useState({
    dateError: "", timesError: "", doctorError: ""
  });

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [doctors, setDoctors] = useState<DoctorData[]>([]);

  const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);
  const [isLoading, setLoading] = useState({ doctors: false, creating: false });

  const timeSlots = generateTimeSlots();
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorData | null>(null);

  const [query, setQuery] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");
  const debouncedQuery = useDebounce(query, 500);

  useClickOutside(dropdownRef, () => setIsDropdownVisible(false));

  const fetchDoctors = async (query?: string) => {
    setLoading({ ...isLoading, doctors: true });

    try {
      const { doctors } = await getAllDoctors({
        query, exclude: "specialty_id, clinic_id, desc, medicalFee"
      });
      setDoctors(doctors);
    } catch (error: any) {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại sau ít phút nữa!");
    } finally {
      setLoading({ ...isLoading, doctors: false });
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
    setErrors((prev) => ({ ...prev, timesError: "" }));
    setSelectedTimes((prev) =>
      prev.includes(timeSlot) ? prev.filter((time) => time !== timeSlot) : [...prev, timeSlot]
    );
  };

  const isFormValid = () => {
    let hasError = false;
    const newErrors = { dateError: "", timesError: "", doctorError: "" };

    if (!selectedDate) {
      newErrors.dateError = "Vui lòng chọn ngày!";
      hasError = true;
    }

    if (!selectedDoctor) {
      newErrors.doctorError = "Vui lòng chọn bác sĩ!";
      hasError = true;
    }

    if (selectedTimes.length === 0) {
      newErrors.timesError = "Vui lòng chọn thời gian!";
      hasError = true;
    }

    setErrors(newErrors);
    return !hasError;
  };

  const resetForm = () => {
    setSelectedTimes([]);
    setSelectedDoctor(null);
    setSelectedDate(undefined);
  };

  const handleCreateSchedule = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isFormValid()) return;

    const accessToken = Cookies.get("access_token");
    if (!accessToken || !selectedDoctor || !selectedDate) return;

    setLoading({ ...isLoading, creating: true });

    try {
      await createSchedule(
        accessToken,
        {
          doctor_id: selectedDoctor?._id,
          date: selectedDate,
          timeSlots: selectedTimes.map((time) => ({
            timeline: time,
            isBooked: false
          }))
        }
      );

      toast.success("Thêm lịch trình thành công!");
      router.replace("/admin/manage-schedules");
    } catch (error: any) {
      setLoading({ ...isLoading, creating: false });

      switch (error) {
        case 409:
          toast.error("Lịch trình này đã tồn tại!");
          resetForm();
          break;

        default:
          toast.error("Thêm lịch trình thất bại. Vui lòng thử lại sau ít phút nữa!");
          router.replace("/admin/manage-schedules");
          break;
      }
    }
  };

  if (isLoading.doctors) {
    return <Spinner center />;
  }

  return (
    <>
      <h1 className="text-xl font-bold mb-4">Thêm lịch trình mới</h1>

      <form onSubmit={handleCreateSchedule}>
        <div className="flex flex-col gap-8 pb-6">
          <div className="flex flex-col gap-2">
            <label className="text-[17px] font-semibold">Bác sĩ</label>
            <div ref={dropdownRef} className="relative w-full lg:w-auto flex-1">
              <Input
                value={inputValue}
                spellCheck={false}
                onChange={handleInputChange}
                placeholder="Tìm kiếm theo tên bác sĩ"
                onFocus={() => setIsDropdownVisible(true)}
                className={cn(errors.doctorError ? "border-red-500" : "border-gray-300")}
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
            {errors.doctorError && (
              <p className="text-red-500 text-sm">{errors.doctorError}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[17px] font-semibold">Chọn ngày</label>
            <DatePicker
              className="h-14"
              placeholder="Chọn ngày"
              selectedDate={selectedDate}
              dateError={errors.dateError}
              setSelectedDate={setSelectedDate}
              setDateError={(err) => setErrors((prev) => ({ ...prev, dateError: err }))}
            />
            {errors.dateError && (
              <p className="text-red-500 text-sm">{errors.dateError}</p>
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
                    selectedTimes.includes(timeSlot)
                      ? "text-white bg-primary"
                      : "text-black hover:text-white border bg-transparent",
                    errors.timesError && "border-red-500 hover:border-transparent"
                  )}
                >
                  {timeSlot}
                </Button>
              ))}
            </div>
            {errors.timesError && (
              <p className="text-red-500 text-sm">{errors.timesError}</p>
            )}
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
              disabled={isLoading.creating}
            >
              {isLoading.creating ? "Đang tạo..." : "Tạo mới"}
            </Button>
          </div>
        </div>
      </form>
    </>
  );
};

export default CreateSchedule;