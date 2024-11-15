"use client";

import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";

import { format } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import NProgress from "nprogress";
import toast from "react-hot-toast";
import "nprogress/nprogress.css";

import {
  IoTime,
  IoCard,
  IoClose,
  IoShieldCheckmarkOutline
} from "react-icons/io5";
import { FaRegTrashAlt } from "react-icons/fa";
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import { FaLocationDot, FaCheck, FaBars } from "react-icons/fa6";

import { RootState } from "@/store/store";
import { setOpenMenuMobile } from "@/store/slices/settings-slice";

import { AppointmentData } from "@/types/appointment-types";
import { formatVietnameseCurrency } from "@/utils/format-vietnamese-currency";
import { deleteAppointment, getAllAppointments } from "@/services/appointment-service";

import { Button } from "@/components/ui/button";
import Spinner from "@/components/spinner";
import PaginationSection from "@/components/pagination";
import DeleteConfirmationModal from "@/components/modal/delete-confirmation-modal";

const HistoryBooking = () => {
  const router = useRouter();

  const dispatch = useDispatch();
  const { user, openMenuMobile } = useSelector((state: RootState) => state.settings);

  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [isLoading, setLoading] = useState({ appointments: false, deleting: false, verifying: false });

  const [appointments, setAppointments] = useState<AppointmentData[]>([]);
  const [appointmentToDelete, setAppointmentToDelete] = useState<string | null>(null);

  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    NProgress.done();
  }, []);

  const fetchAppointments = async (page: number) => {
    const accessToken = Cookies.get("access_token");
    if (!accessToken) return;
    setLoading({ ...isLoading, appointments: true });

    try {
      const { appointments, total } = await getAllAppointments(
        accessToken, { page, user_id: user?._id }
      );
      handleAppointmentsFetchSuccess(appointments, total);
    } catch (error: any) {
      console.error(error);
      toast.error("Có lỗi xảy ra. Vui lòng thử lại sau ít phút nữa!");
    } finally {
      setLoading({ ...isLoading, appointments: false });
    }
  };

  const handleAppointmentsFetchSuccess = (appointments: AppointmentData[], total: number) => {
    const itemsPerPage = 10;
    const totalPages = Math.ceil(total / itemsPerPage);
    setTotalPages(totalPages);
    setAppointments(appointments);
  };

  useEffect(() => {
    fetchAppointments(currentPage);
  }, [currentPage]);

  const handleDeleteAppointment = async () => {
    const accessToken = Cookies.get("access_token");
    if (!accessToken || !appointmentToDelete) return;
    setLoading({ ...isLoading, deleting: true });

    try {
      await deleteAppointment(accessToken, appointmentToDelete);
      await handlePrefetchingAppointments();
      setModalOpen(false);
      toast.success("Hủy đơn đặt lịch khám thành công!");
    } catch (error: any) {
      console.error(error);
      toast.success("Hủy đơn thất bại. Vui lòng thử lại sau ít phút nữa!");
    } finally {
      setModalOpen(false);
      setLoading({ ...isLoading, deleting: false });
    }
  };

  const handlePrefetchingAppointments = async () => {
    if (currentPage > 1 && appointments?.length === 1) {
      setCurrentPage(currentPage - 1);
      await fetchAppointments(currentPage - 1);
    } else {
      await fetchAppointments(currentPage);
    }
  };

  return (
    isLoading.verifying ? (
      <div className="fixed inset-0 bg-black/60 z-50">
        <Spinner center className="text-white" />
      </div>
    ) : (
      <div className="flex flex-col gap-12">
        <div className="w-full flex items-center justify-between">
          <h1 className="text-2xl font-bold">Lịch sử đặt chỗ</h1>
          <Button
            type="button"
            variant="ghost"
            onClick={() => dispatch(setOpenMenuMobile(!openMenuMobile))}
            className="block lg:hidden p-0"
          >
            <FaBars size="22" />
          </Button>
        </div>

        <div className={cn(
          "flex flex-col gap-12", appointments?.length > 0 ? "w-[700px]" : "w-full"
        )}>
          {isLoading.appointments ? (
            <Spinner center />
          ) : (
            appointments?.length > 0 ? (
              appointments?.map((appointment: AppointmentData) => (
                <div key={appointment?._id} className="w-full bg-white shadow-md rounded-lg">
                  <div className="flex flex-col p-6">
                    <div className="flex items-start justify-between pb-6 border-b border-dashed">
                      <div className="flex items-center gap-6">
                        <Image
                          src={appointment?.doctor_id?.image}
                          alt="Clinic Avatar"
                          width={60}
                          height={60}
                          className="object-cover rounded-full"
                        />
                        <div className="flex flex-col gap-2">
                          <h1 className="text-[17px] font-semibold">{appointment?.doctor_id?.fullname}</h1>
                          <p className="text-sm text-[#595959]">{appointment?.doctor_id?.specialty_id?.name}</p>
                        </div>
                      </div>

                      {appointment?.isVerified ? (
                        <div className="flex items-center gap-3 text-[15px] font-semibold text-green-500">
                          <FaCheck /> <p>Đã xác nhận</p>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 text-[15px] font-semibold text-red-500">
                          <IoClose className="size-5" /> <p>Chưa xác nhận</p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-6 pt-6 text-[15px] font-semibold text-[#595959]">
                      <div className="flex items-center gap-3">
                        <IoTime size="18" className="w-[30px] text-[#595959]" />
                        <p>
                          Thời gian: {""}
                          <span className="text-primary">
                            {format(appointment?.date, "dd/MM/yyyy")} - {appointment?.time}
                          </span>
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <RiMoneyDollarCircleFill size="18" className="w-[30px] text-[#595959]" />
                        <p>
                          Giá khám: {""}
                          <span className="text-green-500">
                            {formatVietnameseCurrency(appointment?.doctor_id?.medicalFee)}
                          </span>
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <IoCard size="18" className="w-[30px] text-[#595959]" />
                        <p>Phương thức thanh toán: {""}
                          <span className="font-medium">
                            {appointment?.payment === "ATM" ? "ATM (Thẻ ngân hàng)" : "COD (Tiền mặt)"}
                          </span>
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <FaLocationDot size="18" className="w-[30px] text-[#595959] translate-y-1" />
                        <div className="flex flex-col gap-1">
                          <p>{appointment?.doctor_id?.clinic_id?.name}</p>
                          <p className="font-medium">{appointment?.doctor_id?.clinic_id?.address}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {!appointment?.isVerified && (
                    <div className="flex items-center">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => {
                          setModalOpen(true);
                          setAppointmentToDelete(appointment?._id);
                        }}
                        className="flex-1 h-14 flex items-center justify-center gap-3 text-[17px] text-[#595959] hover:text-red-500 bg-[#f8f9fc] hover:bg-[#f8f9fc] transition duration-500"
                      >
                        <FaRegTrashAlt />
                        <p className="font-semibold">Hủy</p>
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        disabled={isLoading.verifying}
                        onClick={() => {
                          setLoading({ ...isLoading, verifying: true });
                          router.replace(`/verify-booking/${appointment?.token}`);
                        }}
                        className="flex-1 h-14 flex items-center justify-center gap-3 text-[17px] text-[#595959] hover:text-primary bg-[#f8f9fc] hover:bg-[#f8f9fc] transition duration-500"
                      >
                        <IoShieldCheckmarkOutline className="size-5" />
                        <p className="font-semibold">Xác nhận</p>
                      </Button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center gap-10 py-24">
                <Image loading="lazy" src="/calendar.svg" alt="Calendar Icon" width={140} height={140} />
                <p className="text-[17px] font-medium text-[#595959]">
                  Không tìm thấy đơn đặt lịch khám nào!
                </p>
              </div>
            )
          )}

          {totalPages > 1 && (
            <div className="ml-auto">
              <PaginationSection
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>

        <DeleteConfirmationModal
          isCancel
          isOpen={isModalOpen}
          isDeleting={isLoading.deleting}
          onConfirm={handleDeleteAppointment}
          onClose={() => setModalOpen(false)}
        />
      </div>
    )
  );
};

export default HistoryBooking;