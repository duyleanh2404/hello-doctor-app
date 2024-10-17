"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

import { FiSearch } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import { LuClipboardEdit } from "react-icons/lu";
import { FaClinicMedical } from "react-icons/fa";
import { BsClipboard2PlusFill } from "react-icons/bs";

import {
  Select,
  SelectValue,
  SelectContent,
  SelectTrigger,
  SelectItem
} from "@/components/ui/select";

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
import PaginationSection from "@/components/pagination";
import { ScheduleData } from "@/types/schedule-types";
import useDebounce from "@/hooks/use-debounce";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Spinner from "@/components/spinner";
import DeleteConfirmationModal from "@/components/delete-confirmation-modal";
import { deleteSchedule, getAllSchedules } from "@/services/schedule-service";
import { format } from "date-fns";

const ManageSchedules = () => {
  const router = useRouter();

  const [inputFocused, setInputFocused] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  const [schedules, setSchedules] = useState<ScheduleData[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [scheduleToDelete, setScheduleToDelete] = useState<string | null>(null);

  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const fetchSchedules = async (page: number, query: string) => {
    try {
      setIsLoading(true);
      const accessToken = Cookies.get("access_token");
      if (!accessToken) return;

      const { schedules, total } = await getAllSchedules({
        accessToken,
        page,
        limit: 10,
        query,
        date: selectedDate && format(selectedDate, "dd/MM/yyyy")
      });

      setSchedules(schedules);

      const itemsPerPage = 10;
      const totalPages = Math.ceil(total / itemsPerPage);

      setTotalPages(totalPages);
    } catch (err: any) {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại sau ít phút nữa!");
      // router.push("/");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules(currentPage, debouncedSearchQuery);
  }, [currentPage, debouncedSearchQuery, selectedDate]);

  const handleDeleteSchedule = async () => {
    try {
      setIsDeleting(true);
      if (!scheduleToDelete) return;

      const accessToken = Cookies.get("access_token");
      if (!accessToken) return;

      await deleteSchedule({ accessToken, id: scheduleToDelete });
      await fetchSchedules(currentPage, debouncedSearchQuery);

      if (currentPage > 1 && schedules?.length === 1) {
        setCurrentPage(1);
      }

      setModalOpen(false);
      toast.success("Xóa lịch trình thành công!");
    } catch (err: any) {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại sau ít phút nữa!");
      router.push("/");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <h1 className="text-xl font-bold mb-4">Danh sách lịch trình của bác sĩ</h1>
      <div className="flex items-center justify-between">
        <DatePicker
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          placeholder="Chọn ngày"
          className="w-fit h-14 border-t-transparent border-x-transparent hover:bg-transparent shadow-none rounded-none"
        />

        <div className="relative">
          <FiSearch
            size="22"
            className={cn(
              "absolute left-2 top-1/2 -translate-y-1/2 transition duration-500",
              inputFocused ? "text-primary" : "text-gray-500"
            )}
          />
          <Input
            type="text"
            spellCheck={false}
            placeholder="Tìm kiếm theo tên bác sĩ..."
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-[420px] text-[17px] border-b border-[#ccc] focus:border-primary pl-12 rounded-none shadow-none transition duration-500"
          />
        </div>
      </div>

      {isLoading ? (
        <Spinner table />
      ) : (
        <>
          <div className={cn(
            "relative rounded-md shadow-md overflow-x-auto",
            schedules && schedules?.length > 0 ? "h-auto" : "h-full"
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
                {schedules?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center align-middle">
                      <span className="flex justify-center items-center h-full">
                        Chưa có lịch trình nào!
                      </span>
                    </TableCell>
                  </TableRow>
                ) : (
                  schedules?.map((schedule, index) => {
                    const startIndex = (currentPage - 1) * 10;

                    return (
                      <TableRow>
                        <TableCell className="text-center">{startIndex + index + 1}</TableCell>
                        <TableCell>{schedule?.doctor_id?.fullname}</TableCell>
                        <TableCell>{schedule?.doctor_id?.clinic_id?.name}</TableCell>
                        <TableCell>{schedule?.doctor_id?.specialty_id?.name}</TableCell>
                        <TableCell>{schedule?.date}</TableCell>
                        <TableCell className="py-6 px-4">
                          <div className="flex items-center gap-4">
                            <Button
                              type="button"
                              variant="ghost"
                              onClick={() => router.push(`/admin/schedules/edit-schedule/${schedule?._id}`)}
                            >
                              <LuClipboardEdit size="22" />
                            </Button>

                            <Button
                              type="button"
                              variant="ghost"
                              onClick={() => {
                                setScheduleToDelete(schedule?._id);
                                setModalOpen(true);
                              }}
                            >
                              <AiOutlineDelete size="22" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div >

          {totalPages > 1 && (
            <div className="ml-auto">
              <PaginationSection
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </>
      )}

      <DeleteConfirmationModal
        isOpen={isModalOpen}
        isDeleting={isDeleting}
        onConfirm={handleDeleteSchedule}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
};

export default ManageSchedules;