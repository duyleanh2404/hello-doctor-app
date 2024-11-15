import { useState, useEffect } from "react";

import toast from "react-hot-toast";

import { getWards } from "@/services/auth-service";
import { Ward, District } from "@/types/auth-types";

const useWards = (selectedDistrict: District | null) => {
  const [wards, setWards] = useState<Ward[]>([]);

  useEffect(() => {
    const fetchWards = async () => {
      if (!selectedDistrict) return;

      try {
        const { data } = await getWards(selectedDistrict.id);
        setWards(data);
      } catch (error: any) {
        console.error(error);
        toast.error("Có lỗi xảy ra. Vui lòng thử lại sau ít phút nữa!");
      }
    };

    fetchWards();
  }, [selectedDistrict]);

  return wards;
};

export default useWards;