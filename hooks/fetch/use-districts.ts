import { useState, useEffect } from "react";

import toast from "react-hot-toast";

import { getDisctricts } from "@/services/auth-service";
import { District, Province } from "@/types/auth-types";

const useDistricts = (selectedProvince: Province | null) => {
  const [districts, setDistricts] = useState<District[]>([]);

  useEffect(() => {
    const fetchDistricts = async () => {
      if (!selectedProvince) return;

      try {
        const { data } = await getDisctricts(selectedProvince._id);
        setDistricts(data);
      } catch (error: any) {
        console.error(error);
        toast.error("Có lỗi xảy ra. Vui lòng thử lại sau ít phút nữa!");
      }
    };

    fetchDistricts();
  }, [selectedProvince]);

  return districts;
};

export default useDistricts;