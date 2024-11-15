import { useState, useEffect } from "react";

import toast from "react-hot-toast";

import { ClinicData } from "@/types/clinic-types";
import { getClinicById } from "@/services/clinic-service";

const useClinic = (id: string) => {
  const [clinic, setClinic] = useState<ClinicData>();

  useEffect(() => {
    const fetchClinic = async () => {
      try {
        const { clinic } = await getClinicById(id);
        setClinic(clinic);
      } catch (error: any) {
        console.error(error);
        toast.error("Có lỗi xảy ra. Vui lòng thử lại sau ít phút nữa!");
      }
    };
    fetchClinic();
  }, []);

  return clinic;
};

export default useClinic;