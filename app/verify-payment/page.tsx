"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import Swal from "sweetalert2";
import Cookies from "js-cookie";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

import { RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { setVerifyingPayment } from "@/store/slices/booking-slice";

import { createAppointment } from "@/services/appointment-service";

import Spinner from "@/components/spinner";

const VerifyPaymentPage = () => {
  const router = useRouter();
  const pathname = usePathname();

  const dispatch = useDispatch();
  const { bookingData, isVerifyingPayment } = useSelector((state: RootState) => state.booking);

  const searchParams = useSearchParams();
  const vnp_TransactionStatus = searchParams.get("vnp_TransactionStatus");

  useEffect(() => {
    if (!isVerifyingPayment) router.replace("/");
  }, []);

  useEffect(() => {
    const handleVerifyAppointment = async () => {
      const accessToken = Cookies.get("access_token");
      if (!accessToken || !bookingData) return;

      if (vnp_TransactionStatus === "00") {
        try {
          const appointmentDate = new Date(bookingData.date);
          await createAppointment(accessToken, { ...bookingData, date: appointmentDate });

          Swal.fire({
            icon: "success",
            title: "Thanh toán thành công!",
            confirmButtonText: "Về trang chủ",
            text: "Vui lòng kiểm tra email để nhận được thông tin về lịch khám bệnh!"
          })
            .then((result) => {
              if (result.isConfirmed) {
                NProgress.start();
                router.replace("/");
                dispatch(setVerifyingPayment(false));
              };
            });
        } catch (error: any) {
          console.error(error);
          Swal.fire({
            icon: "error",
            title: "Có lỗi xảy ra!",
            confirmButtonText: "Về trang chủ",
            text: "Xin lỗi về sự bất tiện này. Chúng tôi sẽ cố gắng khắc phục sớm nhất!"
          })
            .then((result) => {
              if (result.isConfirmed) {
                if (pathname !== "/") NProgress.start();
                router.replace("/");
                dispatch(setVerifyingPayment(false));
              };
            });
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Thanh toán thất bại!",
          confirmButtonText: "Về trang chủ",
          text: "Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại!"
        })
          .then((result) => {
            if (result.isConfirmed) {
              NProgress.start();
              router.replace("/");
              dispatch(setVerifyingPayment(false));
            };
          });
      }
    };

    handleVerifyAppointment();
  }, []);

  return <Spinner center />;
};

export default VerifyPaymentPage;