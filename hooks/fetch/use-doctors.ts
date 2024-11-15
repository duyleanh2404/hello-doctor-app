import { useState, useEffect } from "react";

import toast from "react-hot-toast";

import { DoctorData } from "@/types/doctor-types";
import { getAllDoctors } from "@/services/doctor-service";

const useDoctors = (exclude?: string) => {
  const [doctors, setDoctors] = useState<DoctorData[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);

      try {
        const { doctors } = await getAllDoctors({ exclude });
        setDoctors(doctors);
      } catch (error: any) {
        console.error(error);
        toast.error("Có lỗi xảy ra. Vui lòng thử lại sau ít phút nữa!");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  return { doctors, isLoading };
};

export default useDoctors;