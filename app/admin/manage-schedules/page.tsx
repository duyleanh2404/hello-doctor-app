"use client";

import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import { FiSearch } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import { LuClipboardEdit } from "react-icons/lu";

import { format } from "date-fns";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

import { ScheduleData } from "@/types/schedule-types";
import { deleteSchedule, getAllSchedules } from "@/services/schedule-service";
import useDebounce from "@/hooks/use-debounce";

import {
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableHeader
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import Hint from "@/components/hint";
import Spinner from "@/components/spinner";
import PaginationSection from "@/components/pagination";
import DeleteConfirmationModal from "@/components/modal/delete-confirmation-modal";

const ManageSchedules = () => {
  const router = useRouter();

  const today = new Date();
  today.setUTCHours(-7, 0, 0, 0);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [inputFocused, setInputFocused] = useState<boolean>(false);
  const [isLoading, setLoading] = useState({ schedules: false, deleting: false });

  const [schedules, setSchedules] = useState<ScheduleData[]>([]);
  const [scheduleToDelete, setScheduleToDelete] = useState<string | null>(null);

  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const fetchSchedules = async (page: number, query?: string, date?: Date) => {
    const accessToken = Cookies.get("access_token");
    if (!accessToken) return;
    setLoading({ ...isLoading, schedules: true });

    try {
      const { schedules, total } = await getAllSchedules(
        accessToken, { page, limit: 10, query, exclude: "timeSlots", date }
      );
      handleSchedulesFetchSuccess(schedules, total);
    } catch (error: any) {
      console.error(error);
      toast.error("Có lỗi xảy ra. Vui lòng thử lại sau ít phút nữa!");
    } finally {
      setLoading({ ...isLoading, schedules: false });
    }
  };

  const handleSchedulesFetchSuccess = (schedules: ScheduleData[], total: number) => {
    const itemsPerPage = 10;
    const totalPages = Math.ceil(total / itemsPerPage);
    setSchedules(schedules);
    setTotalPages(totalPages);
  };

  useEffect(() => {
    fetchSchedules(currentPage, debouncedSearchQuery, selectedDate);
  }, [currentPage, debouncedSearchQuery, selectedDate]);

  const handleDeleteSchedule = async () => {
    const accessToken = Cookies.get("access_token");
    if (!accessToken || !scheduleToDelete) return;
    setLoading({ ...isLoading, deleting: true });

    try {
      await deleteSchedule(accessToken, scheduleToDelete);
      await handlePrefetchingSchedules();
      setModalOpen(false);
      toast.success("Xóa lịch trình thành công!");
    } catch (error: any) {
      console.error(error);
      toast.error("Xóa lịch trình thất bại. Vui lòng thử lại sau ít phút nữa!");
    } finally {
      setModalOpen(false);
      setLoading({ ...isLoading, deleting: false });
    }
  };

  const handlePrefetchingSchedules = async () => {
    if (currentPage > 1 && schedules?.length === 1) {
      setCurrentPage(currentPage - 1);
      await fetchSchedules(currentPage - 1);
    } else {
      await fetchSchedules(currentPage);
    }
  };

  if (isLoading.schedules) {
    return <Spinner center />;
  }

  return (
    <>
      <h1 className="text-xl font-bold mb-4">Danh sách lịch trình của bác sĩ</h1>
      <div className="flex items-center justify-between">
        <DatePicker
          placeholder="Chọn ngày"
          disableDate={today}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          className={cn("h-12", selectedDate ? "w-fit" : "w-[240px]")}
        />

        <div className="relative">
          <FiSearch
            size="22"
            className={cn(
              "absolute left-4 top-1/2 -translate-y-1/2 transition duration-500",
              inputFocused ? "text-primary" : "text-gray-500"
            )}
          />
          <Input
            type="text"
            spellCheck={false}
            value={searchQuery}
            onBlur={() => setInputFocused(false)}
            onFocus={() => setInputFocused(true)}
            placeholder="Tìm kiếm theo tên bác sĩ..."
            onChange={(event) => setSearchQuery(event.target.value)}
            className="w-[420px] h-12 pl-12"
          />
        </div>
      </div>

      <div className={cn(
        "relative rounded-md shadow-md overflow-x-auto", schedules?.length > 0 ? "h-auto" : "h-full"
      )}>
        <Table className="relative h-full text-[17px]">
          <TableHeader className="sticky top-0 left-0 right-0 h-12 bg-gray-100">
            <TableRow>
              <TableHead className="font-semibold text-black w-[50px]">STT</TableHead>
              <TableHead className="font-semibold text-black text-start">Họ và tên bác sĩ</TableHead>
              <TableHead className="font-semibold text-black text-start">Chuyên khoa</TableHead>
              <TableHead className="font-semibold text-black text-start">Bệnh viện</TableHead>
              <TableHead className="font-semibold text-black text-start">Ngày khám</TableHead>
              <TableHead className="font-semibold text-black text-start">Hành động</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {schedules?.length > 0 ? (
              schedules?.map((schedule: ScheduleData, index) => {
                const startIndex = (currentPage - 1) * 10;

                const queryParams = new URLSearchParams({
                  doctorId: btoa(schedule?.doctor_id?._id),
                  scheduleId: btoa(schedule?._id),
                  date: format(schedule?.date, "dd/MM/yyyy")
                }).toString();

                return (
                  <TableRow key={schedule?._id}>
                    <TableCell className="text-center">{startIndex + index + 1}</TableCell>
                    <TableCell>{schedule?.doctor_id?.fullname}</TableCell>
                    <TableCell>{schedule?.doctor_id?.specialty_id?.name}</TableCell>
                    <TableCell>
                      <Hint label={schedule?.doctor_id?.clinic_id?.address}>
                        <p>{schedule?.doctor_id?.clinic_id?.name}</p>
                      </Hint>
                    </TableCell>
                    <TableCell>{schedule?.date && format(schedule?.date, "dd/MM/yyyy")}</TableCell>
                    <TableCell className="py-6 px-4">
                      <div className="flex items-center gap-4">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => router.replace(`/admin/manage-schedules/edit-schedule?${queryParams}`)}
                          className="group"
                        >
                          <LuClipboardEdit size="22" className="group-hover:text-green-500 transition duration-500" />
                        </Button>

                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => {
                            setModalOpen(true);
                            setScheduleToDelete(schedule?._id);
                          }}
                          className="group"
                        >
                          <AiOutlineDelete size="22" className="group-hover:text-red-500 transition duration-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center align-middle">
                  <span className="flex justify-center items-center h-full">
                    Không tìm thấy lịch trình nào!
                  </span>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="ml-auto">
          <PaginationSection
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      <DeleteConfirmationModal
        isOpen={isModalOpen}
        isDeleting={isLoading.deleting}
        onConfirm={handleDeleteSchedule}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
};

export default ManageSchedules;