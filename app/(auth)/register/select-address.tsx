import {
  UseFormRegister,
  UseFormSetValue,
  UseFormClearErrors
} from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import { cn } from "@/lib/utils";
import { getProvinces } from "@/services/auth-service";
import { RegisterFormInputs } from "@/types/auth-types";

import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface SelectAddressProps {
  errors: Record<string, any>;
  register: UseFormRegister<RegisterFormInputs>;
  setValue: UseFormSetValue<RegisterFormInputs>;
  clearErrors: UseFormClearErrors<RegisterFormInputs>;
};

const SelectAddress = ({ errors, register, setValue, clearErrors }: SelectAddressProps) => {
  const router = useRouter();

  const [provinces, setProvinces] = useState<any[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<any | null>(null);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const provinces = await getProvinces();
        setProvinces(provinces);
      } catch (err: any) {
        router.push("/");
        toast.error("Có lỗi xảy ra. Vui lòng thử lại sau ít phút nữa!");
      }
    };
    fetchProvinces();
  }, []);

  const handleProvinceChange = (provinceName: any) => {
    const province = provinces.find((province) => province.name === provinceName);
    if (!province) return;

    clearErrors("province");
    setSelectedProvince(province);
    setValue("province", provinceName);
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        <label className="text-[15px] font-medium">Tỉnh/Thành phố</label>
        <Select
          {...register("province", { required: "Vui lòng chọn tỉnh/thành phố!" })}
          onValueChange={(value) => handleProvinceChange(value)}
        >
          <SelectTrigger
            className={cn(
              "border border-gray-300 rounded-md transition duration-500",
              errors.province ? "border-[#ff4d4f]" : "focus:border-primary focus:shadow-input-primary"
            )}
          >
            <SelectValue placeholder="Chọn tỉnh/thành phố" />
          </SelectTrigger>
          <SelectContent className="h-[300px]">
            {provinces?.map((province) => (
              <SelectItem key={province?.name} value={province?.name}>
                {province?.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {errors.province && (
          <p className="text-sm text-red-500">{errors.province.message}</p>
        )}
      </div>

      <div className={cn("flex flex-col gap-2", !selectedProvince && "cursor-not-allowed")}>
        <label className="text-[15px] font-medium">Quận/Huyện</label>
        <Select
          disabled={!selectedProvince}
          {...register("district", { required: "Vui lòng chọn quận/huyện!" })}
          onValueChange={(value) => {
            clearErrors("district");
            setValue("district", value);
          }}
        >
          <SelectTrigger
            className={cn(
              "border border-gray-300 rounded-md transition duration-500",
              errors.district ? "border-[#ff4d4f]" : "focus:border-primary focus:shadow-input-primary"
            )}
          >
            <SelectValue placeholder="Chọn quận/huyện" />
          </SelectTrigger>
          <SelectContent>
            {selectedProvince?.districts?.map((district: any) => (
              <SelectItem key={district?.name} value={district?.name}>
                {district?.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {errors.district && (
          <p className="text-sm text-red-500">{errors.district.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[15px] font-medium">Địa chỉ (Số nhà, Đường)</label>
        <Input
          type="text"
          spellCheck={false}
          placeholder="Nhập địa chỉ của bạn"
          {...register("street", { required: "Vui lòng nhập địa chỉ (số nhà, đường)!" })}
          className={cn(
            "placeholder:text-[#A9A9A9] p-3 border border-gray-300 rounded-md transition duration-500",
            errors.street ? "border-[#ff4d4f]" : "focus:border-primary focus:shadow-input-primary"
          )}
        />

        {errors.street && (
          <p className="text-sm text-red-500">{errors.street.message}</p>
        )}
      </div>
    </>
  );
};

export default SelectAddress;