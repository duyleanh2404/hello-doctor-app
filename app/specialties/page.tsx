"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

import NProgress from "nprogress";
import "nprogress/nprogress.css";

import { SpecialtyData } from "@/types/specialty-types";
import useSpecialties from "@/hooks/fetch/use-specialties";

import Chatbot from "@/components/chatbot";
import Spinner from "@/components/spinner";
import Breadcrumb from "@/components/breadcrumb";

const SpecialtiesPage = () => {
  const { specialties, isLoading } = useSpecialties("desc");

  useEffect(() => {
    NProgress.done();
  }, []);

  if (isLoading) {
    return <Spinner center />;
  }

  return (
    <>
      <Breadcrumb labels={[{ label: "Tất cả chuyên khoa" }]} />
      <div className="w-full h-fit bg-cover bg-no-repeat" style={{ backgroundImage: "url(/specialties/banner.svg)" }}>
        <div className="wrapper flex flex-col gap-16 pt-12 pb-20 sm:px-8">
          <h1 className="text-2xl sm:text-4xl font-bold text-[#284a75] text-center">Tất cả chuyên khoa</h1>
          {specialties?.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {specialties?.map((specialty: SpecialtyData) => (
                <Link
                  key={specialty?._id}
                  href={`/specialties/${btoa(specialty?._id)}`}
                  className="flex flex-col items-center gap-6 p-4 bg-white border shadow-md hover:shadow-lg rounded-xl transition duration-500"
                >
                  <Image
                    loading="lazy"
                    src={specialty?.image || "/avatar-default.png"}
                    alt="Specialty"
                    width="110"
                    height="110"
                    className="hidden sm:block"
                  />
                  <Image
                    loading="lazy"
                    src={specialty?.image || "/avatar-default.png"}
                    alt="Specialty"
                    width="80"
                    height="80"
                    className="block sm:hidden"
                  />

                  <p className="flex items-center justify-center h-[55px] text-[15px] sm:text-[17px] font-bold text-center">
                    {specialty?.name}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="w-full hidden lg:flex flex-col items-center justify-center gap-12 pt-8">
              <Image loading="lazy" src="/not-found.png" alt="Not found" width="240" height="240" />
              <h1 className="text-xl font-semibold text-[#262626] text-center">
                Rất tiếc, hiện tại không tìm thấy chuyên khoa nào!
              </h1>
            </div>
          )}
        </div>
      </div>

      <Chatbot />
    </>
  );
};

export default SpecialtiesPage;