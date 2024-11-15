import { useState, useEffect } from "react";
import { getProvinces } from "@/services/auth-service";
import toast from "react-hot-toast";

const useProvinces = () => {
  const [provinces, setProvinces] = useState([]);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const { data } = await getProvinces();
        setProvinces(data);
      } catch (error: any) {
        console.error(error);
        toast.error("Có lỗi xảy ra. Vui lòng thử lại sau ít phút nữa!");
      }
    };
    fetchProvinces();
  }, []);

  return provinces;
};

export default useProvinces;