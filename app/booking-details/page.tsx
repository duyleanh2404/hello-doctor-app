"use client";

import { useState, useEffect, Suspense, lazy } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { format, parse } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { useForm, SubmitHandler } from "react-hook-form";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import NProgress from "nprogress";
import toast from "react-hot-toast";
import "nprogress/nprogress.css";

import {
  setBookingData,
  setVerifyingPayment,
  setVerifyingAppointment
} from "@/store/slices/booking-slice";
import { RootState } from "@/store/store";

import { getSchedule } from "@/services/schedule-service";
import { createPaymentUrl } from "@/services/payment-service";
import { createAppointment } from "@/services/appointment-service";

import { BookingData } from "@/types/booking-types";
import { ScheduleData } from "@/types/schedule-types";

import Spinner from "@/components/spinner";
import Breadcrumb from "@/components/breadcrumb";

const UserInfo = lazy(() => import("./_components/user-info"));
const ScheduleInfo = lazy(() => import("./_components/schedule-info"));

const BookingDetails = () => {
  const router = useRouter();

  const dispatch = useDispatch();
  const { userData } = useSelector((state: RootState) => state.auth);
  const [schedule, setSchedule] = useState<ScheduleData | null>(null);

  const [paymentMethod, setPaymentMethod] = useState<string>("COD");
  const [isLoading, setLoading] = useState({ schedule: false, user: false, booking: false });

  const searchParams = useSearchParams();
  const time = searchParams.get("time");
  const date = searchParams.get("date");
  const doctorId = searchParams.get("doctorId");

  const {
    control, register, setValue, clearErrors, handleSubmit, formState: { errors }
  } = useForm<BookingData>({ defaultValues: { newPatients: true } });

  useEffect(() => {
    NProgress.done();
  }, []);

  useEffect(() => {
    const fetchSchedule = async () => {
      if (!date || !doctorId) return;
      setLoading({ ...isLoading, schedule: true });

      try {
        const { schedule } = await getSchedule({
          doctor_id: atob(doctorId!),
          date: parse(atob(date!), "dd/MM/yyyy", new Date())
        });
        setSchedule(schedule);
      } catch (error: any) {
        console.error(error);
        toast.error("Có lỗi xảy ra. Vui lòng thử lại sau ít phút nữa!");
      } finally {
        setLoading({ ...isLoading, schedule: false });
      }
    };

    fetchSchedule();
  }, [date, doctorId]);

  const handleBookAppointment: SubmitHandler<BookingData> = async (appointmentData) => {
    if (!date || !time || !doctorId || !userData) return;

    const accessToken = Cookies.get("access_token");
    if (!accessToken) return;
    setLoading({ ...isLoading, booking: true });

    try {
      const formattedDate = parse(atob(date!), "dd/MM/yyyy", new Date());
      switch (paymentMethod) {
        case "COD":
          dispatch(setVerifyingAppointment(true));
          await createAppointment(
            accessToken,
            {
              user_id: userData._id,
              doctor_id: atob(doctorId!),
              date: formattedDate,
              time: atob(time!),
              address: appointmentData.address,
              reasons: appointmentData.reasons,
              zaloPhone: appointmentData.zaloPhone,
              newPatients: appointmentData.newPatients,
              payment: "COD"
            }
          );

          Swal.fire({
            icon: "success",
            title: "Đặt lịch thành công!",
            confirmButtonText: "Về trang chủ",
            text: "Vui lòng kiểm tra email để xác thực đơn đặt lịch!"
          })
            .then((result) => {
              if (result.isConfirmed) {
                NProgress.start();
                router.replace("/");
              }
            });
          break;

        case "ATM":
          dispatch(setVerifyingPayment(true));
          dispatch(setBookingData({
            user_id: userData._id,
            doctor_id: atob(doctorId!),
            date: formattedDate.toISOString(),
            time: atob(time!),
            payment: "ATM",
            address: appointmentData.address,
            reasons: appointmentData.reasons,
            zaloPhone: appointmentData.zaloPhone,
            newPatients: appointmentData.newPatients,
          }))

          if (schedule?.doctor_id?.medicalFee && schedule?.doctor_id?.fullname && schedule?.date) {
            const { paymentUrl } = await createPaymentUrl(
              accessToken,
              {
                amount: schedule?.doctor_id?.medicalFee,
                txnRef: (Math.floor(100000 + Math.random() * 900000)).toString(),
                orderInfo: `Thanh toán tiền khám bệnh ${schedule.doctor_id.fullname}, ${format(schedule.date, "dd/MM/yyyy")}`,
                returnUrl: `${process.env.NEXT_PUBLIC_URL}/verify-payment`
              }
            );
            router.replace(paymentUrl);
          }
          break;
      }
    } catch (error: any) {
      console.error(error);
      toast.error("Đặt lịch thất bại. Vui lòng thử lại sau ít phút nữa!");
      setLoading({ ...isLoading, booking: false });
      router.replace("/");
    }
  };

  return (
    <>
      <Breadcrumb
        labels={[
          { label: "Đặt lịch khám bệnh", href: "/booking-doctor" },
          { label: schedule?.doctor_id?.fullname || "Đang tải..." }
        ]}
      />

      <form
        onSubmit={handleSubmit(handleBookAppointment)}
        className="sm:wrapper flex flex-col lg:flex-row gap-6 pt-8 pb-12"
      >
        <Suspense fallback={
          <div className="w-full flex items-center justify-center">
            <Spinner center />
          </div>
        }>
          <UserInfo
            user={userData}
            errors={errors}
            control={control}
            setValue={setValue}
            register={register}
            clearErrors={clearErrors}
            isLoading={isLoading.user}
          />

          <ScheduleInfo
            time={atob(time!)!}
            schedule={schedule!}
            paymentMethod={paymentMethod}
            isBooking={isLoading.booking}
            isLoading={isLoading.schedule}
            setPaymentMethod={setPaymentMethod}
          />
        </Suspense>
      </form>

      {isLoading.booking && (
        <div className="fixed inset-0 bg-black/60 z-50">
          <Spinner center className="text-white" />
        </div>
      )}
    </>
  );
};

export default BookingDetails;