"use client";

import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

import { FiSearch } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import { FaRegCalendarCheck } from "react-icons/fa6";

import { format } from "date-fns";
import { jwtDecode, JwtPayload } from "jwt-decode";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

import {
  deleteAppointment,
  getAllAppointments
} from "@/services/appointment-service";
import { AppointmentData } from "@/types/appointment-types";
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
import Spinner from "@/components/spinner";
import PaginationSection from "@/components/pagination";
import DeleteConfirmationModal from "@/components/delete-confirmation-modal";
import VerifyConfirmationModal from "./_components/verify-confirmation-modal";

const ManagePatientsPage = () => {
  const [inputFocused, setInputFocused] = useState<boolean>(false);
  const [isModalOpen, setModalOpen] = useState({ delete: false, verify: false });
  const [isLoading, setLoading] = useState({ appointments: false, deleting: false, changed: false });

  const [appointments, setAppointments] = useState<AppointmentData[]>([]);
  const [appointmentToDelete, setAppointmentToDelete] = useState<string | null>(null);
  const [appointmentToVerify, setAppointmentToVerify] = useState<AppointmentData | null>(null);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const fetchAppointments = async (page: number, query?: string, date?: Date) => {
    const accessToken = Cookies.get("access_token");
    if (!accessToken) return;

    const decodedToken: any = jwtDecode<JwtPayload>(accessToken);
    if (!decodedToken) return;

    setLoading({ ...isLoading, appointments: true });

    try {
      const { appointments, total } = await getAllAppointments(
        accessToken,
        {
          page,
          limit: 10,
          query,
          doctor_id: decodedToken.doctor_id,
          date
        }
      );

      const itemsPerPage = 10;
      const totalPages = Math.ceil(total / itemsPerPage);

      setTotalPages(totalPages);
      setAppointments(appointments);
    } catch (error: any) {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại sau ít phút nữa!");
    } finally {
      setLoading({ ...isLoading, appointments: false });
    }
  };

  useEffect(() => {
    fetchAppointments(currentPage, debouncedSearchQuery, selectedDate);
  }, [currentPage, debouncedSearchQuery, selectedDate]);

  useEffect(() => {
    if (!isLoading.changed) return;
    fetchAppointments(currentPage);
  }, [currentPage, isLoading.changed]);

  const handleCancelAppointment = async () => {
    if (!appointmentToDelete) return;

    const accessToken = Cookies.get("access_token");
    if (!accessToken) return;

    setLoading({ ...isLoading, deleting: true });

    try {
      await deleteAppointment(accessToken, appointmentToDelete);

      if (currentPage > 1 && appointments?.length === 1) {
        setCurrentPage(currentPage - 1);
        await fetchAppointments(currentPage - 1);
      } else {
        await fetchAppointments(currentPage);
      }

      setModalOpen({ ...isModalOpen, delete: false });
      toast.success("Hủy đơn đặt lịch khám thành công!");
    } catch (error: any) {
      toast.error("Hủy đơn thất bại. Vui lòng thử lại sau ít phút nữa!");
    } finally {
      setLoading({ ...isLoading, deleting: false });
    }
  };

  if (isLoading.appointments) {
    return <Spinner center />;
  }

  return (
    <>
      <h1 className="text-xl font-bold mb-4">Danh sách đơn đặt lịch khám</h1>

      <div className="flex items-center justify-between">
        <DatePicker
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          placeholder="Chọn ngày"
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
            placeholder="Tìm kiếm theo tên bệnh nhân..."
            onChange={(event) => setSearchQuery(event.target.value)}
            className="w-[420px] h-12 pl-12"
          />
        </div>
      </div>

      <div className={cn(
        "relative rounded-md shadow-md overflow-x-auto",
        appointments?.filter((appointment) => !appointment.isFinished)?.length > 0 ? "h-auto" : "h-full"
      )}>
        <Table className="relative h-full text-[17px]">
          <TableHeader className="sticky top-0 left-0 right-0 h-12 bg-gray-100">
            <TableRow>
              <TableHead className="font-semibold text-black w-[50px]">STT</TableHead>
              <TableHead className="font-semibold text-black text-start">Tên bệnh nhân</TableHead>
              <TableHead className="font-semibold text-black text-start">Ngày</TableHead>
              <TableHead className="font-semibold text-black text-start">Giờ</TableHead>
              <TableHead className="font-semibold text-black text-start">Lý do khám</TableHead>
              <TableHead className="font-semibold text-black text-start">Hành động</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {appointments?.filter((appointment) => !appointment.isFinished)?.length > 0 ? (
              appointments
                ?.filter((appointment) => !appointment.isFinished)
                ?.map((appointment, index) => {
                  const startIndex = (currentPage - 1) * 10;

                  return (
                    <TableRow key={appointment?._id}>
                      <TableCell className="text-center">{startIndex + index + 1}</TableCell>
                      <TableCell>{appointment?.user_id?.fullname}</TableCell>
                      <TableCell>{format(appointment?.date, "dd/MM/yyyy")}</TableCell>
                      <TableCell>{appointment?.time}</TableCell>
                      <TableCell>{appointment?.reasons}</TableCell>
                      <TableCell className="py-6 px-4">
                        <div className="flex items-center gap-4">
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => {
                              setAppointmentToVerify(appointment);
                              setModalOpen({ ...isModalOpen, verify: true });
                            }}
                            className="group"
                          >
                            <FaRegCalendarCheck
                              size="22"
                              className="group-hover:text-green-500 transition duration-500"
                            />
                          </Button>

                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => {
                              setModalOpen({ ...isModalOpen, delete: true });
                              setAppointmentToDelete(appointment?._id);
                            }}
                            className="group"
                          >
                            <AiOutlineDelete
                              size="24"
                              className="group-hover:text-red-500 transition duration-500"
                            />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center align-middle">
                  <span className="flex justify-center items-center h-full">
                    Không tìm thấy đơn đặt lịch khám nào!
                  </span>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {totalPages > 1 && (
          <div className="ml-auto">
            <PaginationSection
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div >

      <DeleteConfirmationModal
        isOpen={isModalOpen.delete}
        isDeleting={isLoading.deleting}
        onConfirm={handleCancelAppointment}
        onClose={() => setModalOpen({ ...isModalOpen, delete: false })}
      />

      <VerifyConfirmationModal
        isOpen={isModalOpen.verify}
        appointmentToVerify={appointmentToVerify!}
        onClose={() => setModalOpen({ ...isModalOpen, verify: false })}
        onChanged={() => setLoading({ ...isLoading, changed: true })}
      />
    </>
  );
};

export default ManagePatientsPage;