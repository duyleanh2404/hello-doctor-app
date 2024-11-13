import { useEffect, useState } from "react";

import toast from "react-hot-toast";

import { getDisctricts } from "@/services/auth-service";

interface Province {
  id: string;
  name: string;
};

interface District {
  id: string;
  name: string;
};

const useDistricts = (selectedProvince: Province | null) => {
  const [districts, setDistricts] = useState<District[]>([]);

  useEffect(() => {
    const fetchDistricts = async () => {
      if (!selectedProvince) return;

      try {
        const { data } = await getDisctricts(selectedProvince.id);
        setDistricts(data);
      } catch (error: any) {
        toast.error("Có lỗi xảy ra. Vui lòng thử lại sau ít phút nữa!");
      }
    };

    fetchDistricts();
  }, [selectedProvince]);

  return districts;
};

export default useDistricts;