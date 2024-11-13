import { useState, useEffect } from "react";

import toast from "react-hot-toast";

import { ClinicData } from "@/types/clinic-types";
import { getAllClinics } from "@/services/clinic-service";

const useClinics = (exclude?: string) => {
  const [clinics, setClinics] = useState<ClinicData[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchClinics = async () => {
      setLoading(true);

      try {
        const { clinics } = await getAllClinics({ exclude });
        setClinics(clinics);
      } catch (error: any) {
        toast.error("Có lỗi xảy ra. Vui lòng thử lại sau ít phút nữa!");
      } finally {
        setLoading(false);
      }
    };

    fetchClinics();
  }, []);

  return { clinics, isLoading };
};

export default useClinics;