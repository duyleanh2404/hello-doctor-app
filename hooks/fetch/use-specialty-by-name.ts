import { useState, useEffect } from "react";

import { SpecialtyData } from "@/types/specialty-types";
import { getSpecialtyByName } from "@/services/specialty-service";

const useSpecialtyByName = (name: string) => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [specialty, setSpecialty] = useState<SpecialtyData>();

  useEffect(() => {
    const fetchSpecialty = async () => {
      setLoading(true);

      try {
        const { specialty } = await getSpecialtyByName(name);
        setSpecialty(specialty);
      } catch (error: any) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchSpecialty();
  }, []);

  return { specialty, isLoading };
};

export default useSpecialtyByName;