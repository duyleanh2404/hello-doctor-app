import { cn } from "@/lib/utils";

import {
  UseFormWatch,
  UseFormRegister,
  UseFormSetValue,
  UseFormClearErrors
} from "react-hook-form";

import { Ward, District, Province } from "@/types/auth-types";

import useWards from "@/hooks/fetch/use-wards";
import useProvinces from "@/hooks/fetch/use-provinces";
import useDistricts from "@/hooks/fetch/use-districts";

import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface IProps {
  errors: Record<string, any>;
  selectedProvince: Province | null;
  selectedDistrict: District | null;
  watch: UseFormWatch<any>;
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  clearErrors: UseFormClearErrors<any>;
  setSelectedProvince: (province: Province | null) => void;
  setSelectedDistrict: (district: District | null) => void;
};

const SelectAddress = ({
  errors,
  watch,
  register,
  setValue,
  clearErrors,
  selectedProvince,
  selectedDistrict,
  setSelectedProvince,
  setSelectedDistrict
}: IProps) => {
  const provinces: Province[] = useProvinces();
  const wards: Ward[] = useWards(selectedDistrict);
  const districts: District[] = useDistricts(selectedProvince);

  const handleProvinceChange = (provinceName: string) => {
    const province = provinces.find((province: Province) => province.name === provinceName);
    if (!province) return;

    clearErrors("province");

    setValue("ward", "");
    setValue("district", "");
    setValue("province", provinceName);

    setSelectedDistrict(null);
    setSelectedProvince(province);
  };

  const handleDistrictChange = (districtName: string) => {
    const district = districts.find((district: District) => district.name === districtName);
    if (!district) return;

    setValue("ward", "");
    setValue("district", districtName);

    clearErrors("district");
    setSelectedDistrict(district);
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        <label className="text-[15px] font-medium">Tỉnh/Thành phố</label>
        <Select
          value={watch("province")}
          onValueChange={(value) => handleProvinceChange(value)}
          {...register("province", { required: "Vui lòng chọn tỉnh/thành phố!" })}
        >
          <SelectTrigger className={cn(
            "border rounded-md transition duration-500",
            errors.province ? "border-[#ff4d4f]" : "border-gray-300"
          )}>
            <SelectValue placeholder="Chọn tỉnh/thành phố" />
          </SelectTrigger>
          <SelectContent className="h-[300px]">
            {provinces?.length > 0 ? (
              provinces?.map((province: Province) => (
                <SelectItem key={province?.name} value={province?.name}>{province?.name}</SelectItem>
              ))
            ) : (
              <p className="text-[15px] font-medium text-[#595959] text-center py-4 px-2 mx-auto">
                Không tìm thấy tỉnh thành nào!
              </p>
            )}
          </SelectContent>
        </Select>
        {errors.province && <p className="text-sm text-red-500">{errors.province.message}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[15px] font-medium">Quận/Huyện</label>
        <Select
          value={watch("district")}
          disabled={!selectedProvince}
          onValueChange={(value) => handleDistrictChange(value)}
          {...register("district", { required: "Vui lòng chọn quận/huyện!" })}
        >
          <SelectTrigger className={cn(
            "border rounded-md transition duration-500",
            errors.district ? "border-[#ff4d4f]" : "border-gray-300"
          )}>
            <SelectValue placeholder="Chọn quận/huyện" />
          </SelectTrigger>
          <SelectContent>
            {districts?.length > 0 ? (
              districts?.map((district: District) => (
                <SelectItem key={district?.name} value={district?.name}>{district?.name}</SelectItem>
              ))
            ) : (
              <p className="text-[15px] font-medium text-[#595959] text-center py-4 px-2 mx-auto">
                Không tìm thấy quận/ huyện nào!
              </p>
            )}
          </SelectContent>
        </Select>
        {errors.district && <p className="text-sm text-red-500">{errors.district.message}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[15px] font-medium">Phường/Xã</label>
        <Select
          value={watch("ward")}
          disabled={!selectedDistrict}
          onValueChange={(value) => {
            clearErrors("ward");
            setValue("ward", value);
          }}
          {...register("ward", { required: "Vui lòng chọn phường/xã!" })}
        >
          <SelectTrigger className={cn(
            "border rounded-md transition duration-500",
            errors.ward ? "border-[#ff4d4f]" : "border-gray-300"
          )}>
            <SelectValue placeholder="Chọn phường/xã" />
          </SelectTrigger>
          <SelectContent>
            {wards?.length > 0 ? (
              wards?.map((ward: Ward) => (
                <SelectItem key={ward?._id} value={ward?.name}>{ward?.name}</SelectItem>
              ))
            ) : (
              <p className="text-[15px] font-medium text-[#595959] text-center py-4 px-2 mx-auto">
                Không tìm thấy phường/ xã nào!
              </p>
            )}
          </SelectContent>
        </Select>
        {errors.ward && <p className="text-red-500 text-sm">{errors.ward.message}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[15px] font-medium">Địa chỉ (Số nhà, Đường)</label>
        <Input
          type="text"
          spellCheck={false}
          placeholder="Nhập địa chỉ của bạn"
          {...register("street", { required: "Vui lòng nhập địa chỉ (số nhà, đường)!" })}
          className={cn(
            "placeholder:text-[#A9A9A9] p-3 border rounded-md transition duration-500",
            errors.street ? "border-[#ff4d4f]" : "border-gray-300"
          )}
        />
        {errors.street && <p className="text-sm text-red-500">{errors.street.message}</p>}
      </div>
    </>
  );
};

export default SelectAddress;