import { useState, useEffect } from "react";

import toast from "react-hot-toast";

import { SpecialtyData } from "@/types/specialty-types";
import { getAllSpecialties } from "@/services/specialty-service";

const useSpecialties = (exclude?: string) => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [specialties, setSpecialties] = useState<SpecialtyData[]>([]);

  useEffect(() => {
    const fetchSpecialties = async () => {
      setLoading(true);

      try {
        const { specialties } = await getAllSpecialties({ exclude });
        setSpecialties(specialties);
      } catch (error: any) {
        toast.error("Có lỗi xảy ra. Vui lòng thử lại sau ít phút nữa!");
      } finally {
        setLoading(false);
      }
    };

    fetchSpecialties();
  }, []);

  return { specialties, isLoading };
};

export default useSpecialties;