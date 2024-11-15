import { useState, useEffect } from "react";

import toast from "react-hot-toast";

import { SpecialtyData } from "@/types/specialty-types";
import { getSpecialtyById } from "@/services/specialty-service";

const useSpecialty = (id: string) => {
  const [specialty, setSpecialty] = useState<SpecialtyData>();

  useEffect(() => {
    const fetchSpecialty = async () => {
      try {
        const { specialty } = await getSpecialtyById(id);
        setSpecialty(specialty);
      } catch (error: any) {
        console.error(error);
        toast.error("Có lỗi xảy ra. Vui lòng thử lại sau ít phút nữa!");
      }
    };
    fetchSpecialty();
  }, []);

  return specialty;
};

export default useSpecialty;