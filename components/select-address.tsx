import {
  UseFormWatch,
  UseFormRegister,
  UseFormSetValue,
  UseFormClearErrors
} from "react-hook-form";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import { cn } from "@/lib/utils";
import { getDisctricts, getProvinces, getWards } from "@/services/auth-service";

import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface SelectAddressProps {
  watch: UseFormWatch<any>;
  errors: Record<string, any>;
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  clearErrors: UseFormClearErrors<any>;
};

const SelectAddress = ({
  watch, errors, register, setValue, clearErrors
}: SelectAddressProps) => {
  const [wards, setWards] = useState<any[]>([]);
  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);

  const [selectedProvince, setSelectedProvince] = useState<any | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<any | null>(null);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const { data } = await getProvinces();
        setProvinces(data);
      } catch (err: any) {
        toast.error("Có lỗi xảy ra. Vui lòng thử lại sau ít phút nữa!");
      }
    };
    fetchProvinces();
  }, []);

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const { data } = await getDisctricts(selectedProvince?.id);
        setDistricts(data);
      } catch (err: any) {
        toast.error("Có lỗi xảy ra. Vui lòng thử lại sau ít phút nữa!");
      }
    };

    if (selectedProvince) {
      fetchDistricts();
    }
  }, [selectedProvince]);

  useEffect(() => {
    const fetchWards = async () => {
      try {
        const { data } = await getWards(selectedDistrict?.id);
        setWards(data);
      } catch (err: any) {
        toast.error("Có lỗi xảy ra. Vui lòng thử lại sau ít phút nữa!");
      }
    };

    if (selectedDistrict) {
      fetchWards();
    }
  }, [selectedDistrict]);

  const handleProvinceChange = (provinceName: any) => {
    const province = provinces.find((province) => province.name === provinceName);
    if (!province) return;

    clearErrors("province");
    setSelectedProvince(province);
    setValue("province", provinceName);
    setValue("ward", "Chọn phường/xã");
    setValue("district", "Chọn quận/huyện");
  };

  const handleDistrictChange = (districtName: any) => {
    const district = districts.find((district) => district.name === districtName);
    if (!district) return;

    clearErrors("province");
    setSelectedDistrict(district);
    setValue("ward", "Chọn phường/xã");
    setValue("district", districtName);
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
            <SelectValue placeholder={watch("province") || "Chọn tỉnh/thành phố"} />
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

      <div className="flex flex-col gap-2">
        <label className="text-[15px] font-medium">Quận/Huyện</label>
        <Select
          disabled={!selectedProvince}
          {...register("district", { required: "Vui lòng chọn quận/huyện!" })}
          onValueChange={(value) => handleDistrictChange(value)}
        >
          <SelectTrigger
            className={cn(
              "border border-gray-300 rounded-md transition duration-500",
              errors.district ? "border-[#ff4d4f]" : "focus:border-primary focus:shadow-input-primary"
            )}
          >
            <SelectValue placeholder={watch("district") || "Chọn quận/huyện"} />
          </SelectTrigger>
          <SelectContent>
            {districts?.map((district: any) => (
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
        <label className="text-[15px] font-medium">Phường/Xã</label>
        <Select
          disabled={!selectedDistrict}
          {...register("ward", {
            required: "Vui lòng chọn phường/xã!"
          })}
          onValueChange={(value) => setValue("ward", value)}
        >
          <SelectTrigger className={cn("w-full", errors.ward && "border-red-500")}>
            <SelectValue placeholder={watch("ward") || "Chọn phường/xã"} />
          </SelectTrigger>
          <SelectContent>
            {wards?.map((ward: any) => (
              <SelectItem key={ward?._id} value={ward?.name}>
                {ward?.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {errors.ward && (
          <p className="text-red-500 text-sm">{errors.ward.message}</p>
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