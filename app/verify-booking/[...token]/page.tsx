"use client";

import { useEffect } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";

import Swal from "sweetalert2";
import Cookies from "js-cookie";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

import { RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { setVerifyingAppointment } from "@/store/slices/booking-slice";

import { verifyAppointment } from "@/services/appointment-service";

import Spinner from "@/components/spinner";

const VerifyBookingPage = () => {
  const { token } = useParams();

  const router = useRouter();
  const pathname = usePathname();

  const dispatch = useDispatch();
  const { isVerifyingAppointment } = useSelector((state: RootState) => state.booking);

  useEffect(() => {
    if (!isVerifyingAppointment) router.replace("/");
  }, []);

  useEffect(() => {
    const verifyBooking = async () => {
      const accessToken = Cookies.get("access_token");
      if (!accessToken || !isVerifyingAppointment) return;

      try {
        await verifyAppointment(accessToken, token[0]);
        Swal.fire({
          icon: "success",
          title: "Xác nhận thành công!",
          confirmButtonText: "Về trang chủ",
          text: "Nhấn vào nút phía dưới để tiếp tục đặt lịch khám bệnh!"
        })
          .then((result) => {
            if (result.isConfirmed) {
              NProgress.start();
              router.replace("/");
              dispatch(setVerifyingAppointment(false));
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
              dispatch(setVerifyingAppointment(false));
            };
          });
      }
    };

    verifyBooking();
  }, []);

  return <Spinner center />;
};

export default VerifyBookingPage; 