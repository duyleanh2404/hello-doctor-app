import { useState, useEffect } from "react";

import toast from "react-hot-toast";

import { DoctorData } from "@/types/doctor-types";
import { getDoctorById } from "@/services/doctor-service";

const useDoctor = (id: string) => {
  const [doctor, setDoctor] = useState<DoctorData>();

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const { doctor } = await getDoctorById(id);
        setDoctor(doctor);
      } catch (error: any) {
        console.error(error);
        toast.error("Có lỗi xảy ra. Vui lòng thử lại sau ít phút nữa!");
      }
    };
    fetchDoctor();
  }, []);

  return doctor;
};

export default useDoctor;