"use client";

import { useParams } from "next/navigation";
import { useState, useEffect, Suspense, lazy } from "react";
import Image from "next/image";

import { FaLocationDot } from "react-icons/fa6";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

import useClinic from "@/hooks/fetch/use-clinic";

import BookingForm from "./booking-form";
import Spinner from "@/components/spinner";
import Breadcrumb from "@/components/breadcrumb";
import Billboard from "@/components/advertises/billboard";

const Advertise = lazy(() => import("@/components/advertises/advertise"));

const ClinicDetailsPage = () => {
  const { clinicId } = useParams<{ clinicId: string }>();
  const clinic = useClinic(atob(clinicId));

  const [showBillboard, setShowBillboard] = useState<boolean>(false);

  useEffect(() => {
    NProgress.done();
    const shouldShowBillboard = Math.random() > 0.5;
    setShowBillboard(shouldShowBillboard);
  }, []);

  if (!clinic) {
    return <Spinner center />;
  };

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      <div className="flex flex-col">
        <Breadcrumb
          labels={[
            { label: "Đặt lịch khám bệnh", href: "/booking-doctor" },
            { label: clinic?.name || "Đang tải..." }
          ]}
        />

        <div className="relative w-full pt-[30%]">
          <Image loading="lazy" src={clinic?.banner} alt="Banner" fill className="w-full h-full object-contain" />
        </div>

        <div className="wrapper w-full flex flex-col sm:flex-row sm:items-center sm:gap-4 border-b">
          <div className="relative w-[120px] sm:w-[180px] h-[120px] sm:h-[180px] bg-white border border-gray-300 
          rounded-full shadow-md -translate-y-12">
            <Image fill loading="lazy" src={clinic?.avatar} alt="Avatar" className="w-full h-full p-4 object-contain" />
          </div>

          <div className="flex flex-col gap-3 -translate-y-6 sm:-translate-y-0">
            <h1 className="text-xl font-bold">{clinic?.name}</h1>
            <div className="flex items-center gap-3">
              <FaLocationDot size="18" className="flex-shrink-0 text-[#595959]" />
              <p className="font-medium text-[#595959]">{clinic?.address}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="sm:wrapper w-full flex flex-col lg:flex-row gap-12 lg:gap-8 sm:pb-16">
        <div className="wrapper w-full lg:w-[55%] xl:w-[65%]" dangerouslySetInnerHTML={{ __html: clinic?.desc }} />

        <div className="relative w-full lg:w-auto flex-1 flex flex-col gap-8">
          <BookingForm clinic={clinic} />
          <div className="sticky hidden lg:block top-32">
            <Suspense fallback={<Spinner table />}><Advertise /></Suspense>
          </div>
        </div>
      </div>

      {showBillboard && <Billboard />}
    </div>
  );
};

export default ClinicDetailsPage;