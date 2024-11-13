import { useState, useEffect } from "react";

import toast from "react-hot-toast";

import { getProvinces } from "@/services/auth-service";

const useProvinces = () => {
  const [provinces, setProvinces] = useState([]);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const { data } = await getProvinces();
        setProvinces(data);
      } catch (error: any) {
        toast.error("Có lỗi xảy ra. Vui lòng thử lại sau ít phút nữa!");
      }
    };
    fetchProvinces();
  }, []);

  return provinces;
};

export default useProvinces;