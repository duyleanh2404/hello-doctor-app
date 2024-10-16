"use client";

import { FiUpload } from "react-icons/fi";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

import { cn } from "@/lib/utils";
import { getUserById, updateUser } from "@/services/user-serivce";
import { getDisctricts, getProvinces, getWards } from "@/services/auth-service";

import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SelectDateOfBirth from "@/components/select-date-of-birth";

interface UserData {
  day: string;
  _id?: string;
  ward: string;
  desc: string;
  year: string;
  month: string;
  street: string;
  gender: string;
  address: string;
  fullname: string;
  district: string;
  province: string;
  dateOfBirth: string;
  phoneNumber: string;
  image: FileList | null;
};

const EditUser = () => {
  const router = useRouter();
  const { userId } = useParams<{ userId: string }>();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [imageName, setImageName] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const [wards, setWards] = useState<any[]>([]);
  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);

  const [wardName, setWardName] = useState<string>("");
  const [provinceName, setProvinceName] = useState<string>("");
  const [districtName, setDistrictName] = useState<string>("");

  const [selectedProvince, setSelectedProvince] = useState<any | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<any | null>(null);

  const {
    watch,
    register,
    setValue,
    clearErrors,
    handleSubmit,
    formState: { errors }
  } = useForm<UserData>();

  useEffect(() => {
    if (!provinceName) return;

    const province = provinces.find((province) => province.name === provinceName.trim());
    setSelectedProvince(province);
  }, [provinceName]);

  useEffect(() => {
    if (!districtName || !districts) return;

    const district = districts.find((district) => district.name === districtName.trim());
    setSelectedDistrict(district);
  }, [districts, districtName]);

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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!userId) return;
        setIsLoading(true);

        const accessToken = Cookies.get("access_token");
        if (!accessToken) return;

        const { user } = await getUserById({ accessToken, id: userId });

        if (user) {
          const [street, ward, district, province] = user.address.split(",").map((part: any) => part.trim());
          const [day, month, year] = user.dateOfBirth.split("/").map((part: any) => part.trim());

          setValue("day", day);
          setValue("year", year);
          setValue("ward", ward);
          setValue("month", month);
          setValue("street", street);
          setValue("district", district);
          setValue("province", province);

          setValue("fullname", user.fullname);
          setValue("gender", user.gender);
          setValue("dateOfBirth", user.dateOfBirth);
          setValue("phoneNumber", user.phoneNumber);

          setImageUrl(user.image);
          setImageName(user.imageName);

          setWardName(ward);
          setProvinceName(province);
          setDistrictName(district);
        }
      } catch (err: any) {
        toast.error("Có lỗi xảy ra. Vui lòng thử lại sau ít phút nữa!");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      clearErrors("image");
      setImageName(file.name);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const handleProvinceChange = (provinceName: any) => {
    const province = provinces.find((province) => province.name === provinceName);
    if (!province) return;

    clearErrors("province");
    setSelectedProvince(province);
    setValue("province", provinceName);
  };

  const handleDistrictChange = (districtName: any) => {
    const district = districts.find((district) => district.name === districtName);
    if (!district) return;

    clearErrors("district");
    setSelectedDistrict(district);
    setValue("district", districtName);
  };

  const handleEditUser: SubmitHandler<UserData> = async (userData) => {
    try {
      setIsLoading(true);
      const accessToken = Cookies.get("access_token");
      if (!accessToken) return;

      const imageFile = userData.image?.[0];

      await updateUser({
        id: userId[0],
        imageName,
        accessToken,
        image: imageFile,
        gender: userData.gender,
        fullname: userData.fullname,
        phoneNumber: userData.phoneNumber,
        dateOfBirth: `${userData.day}/${userData.month}/${userData.year}`,
        address: `${userData.street}, ${userData.ward}, ${userData.district}, ${userData.province}`
      });

      setIsLoading(false);
      toast.success("Cập nhật bệnh nhân thành công!");
    } catch (err: any) {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại sau ít phút nữa!");
    } finally {
      router.push("/admin/users");
    }
  };

  return (
    <>
      <h1 className="text-xl font-bold mb-4">Chỉnh sửa thông tin bệnh nhân</h1>
      <form onSubmit={handleSubmit(handleEditUser)}>
        <div className="flex flex-col gap-8 pb-6">
          <div className="flex flex-col gap-8 -mx-4 px-4">
            <div className="flex flex-col gap-2">
              <label className="text-[17px] font-semibold">Tên bệnh nhân</label>
              <Input
                type="text"
                spellCheck={false}
                placeholder="Nhập tên bệnh nhân"
                {...register("fullname", { required: "Vui lòng nhập tên bệnh nhân!" })}
                className={cn(
                  "border border-gray-300 rounded-md p-[14px] transition duration-500",
                  errors.fullname ? "border-red-500" : "focus:border-primary focus:shadow-input-primary"
                )}
              />

              {errors.fullname && (
                <p className="text-red-500 text-sm">{errors.fullname.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[17px] font-semibold">Tỉnh/Thành phố</label>
              <Select
                {...register("province", {
                  required: "Vui lòng chọn tỉnh/thành phố!"
                })}
                onValueChange={(value) => handleProvinceChange(value)}
              >
                <SelectTrigger className={cn("w-full", errors.province && "border-red-500")}>
                  <SelectValue placeholder={watch("province")} />
                </SelectTrigger>
                <SelectContent>
                  {provinces?.map((province) => (
                    <SelectItem key={province?._id} value={province?.name}>
                      {province?.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {errors.province && (
                <p className="text-red-500 text-sm">{errors.province.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[17px] font-semibold">Quận/Huyện</label>
              <Select
                disabled={!selectedProvince}
                {...register("district", {
                  required: "Vui lòng chọn quận/huyện!"
                })}
                onValueChange={(value) => handleDistrictChange(value)}
              >
                <SelectTrigger className={cn("w-full", errors.district && "border-red-500")}>
                  <SelectValue placeholder={watch("district")} />
                </SelectTrigger>
                <SelectContent>
                  {districts?.map((district: any) => (
                    <SelectItem key={district?._id} value={district?.name}>
                      {district?.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {errors.district && (
                <p className="text-red-500 text-sm">{errors.district.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[17px] font-semibold">Phường/Xã</label>
              <Select
                disabled={!selectedDistrict}
                {...register("ward", {
                  required: "Vui lòng chọn phường/xã!"
                })}
                onValueChange={(value) => setValue("ward", value)}
              >
                <SelectTrigger className={cn("w-full", errors.ward && "border-red-500")}>
                  <SelectValue placeholder={watch("ward")} />
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
              <label className="text-[17px] font-semibold">Số nhà/Đường</label>
              <Input
                type="text"
                spellCheck={false}
                placeholder="Nhập số nhà/đường"
                {...register("street", { required: "Vui lòng nhập số nhà/đường!" })}
                className={cn(
                  "border border-gray-300 rounded-md p-[14px] transition duration-500",
                  errors.street ? "border-red-500" : "focus:border-primary focus:shadow-input-primary"
                )}
              />

              {errors.street && (
                <p className="text-red-500 text-sm">{errors.street.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[17px] font-semibold">Số điện thoại</label>
              <Input
                type="text"
                spellCheck={false}
                placeholder="Nhập số điện thoại"
                {...register("phoneNumber", { required: "Vui lòng nhập số điện thoại!" })}
                className={cn(
                  "border border-gray-300 rounded-md p-[14px] transition duration-500",
                  errors.phoneNumber ? "border-red-500" : "focus:border-primary focus:shadow-input-primary"
                )}
              />

              {errors.phoneNumber && (
                <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[17px] font-semibold">Ngày sinh</label>

              <SelectDateOfBirth
                watch={watch}
                errors={errors}
                register={register}
                setValue={setValue}
                clearErrors={clearErrors}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[17px] font-semibold">Giới tính</label>
              <div className="flex gap-8">
                <label className="flex items-center gap-2">
                  <Input
                    type="radio"
                    value="male"
                    className="w-4 h-4"
                    {...register("gender", { required: "Vui lòng chọn giới tính!" })}
                  />
                  Nam
                </label>

                <label className="flex items-center gap-2">
                  <Input
                    type="radio"
                    value="female"
                    className="w-4 h-4"
                    {...register("gender", { required: "Vui lòng chọn giới tính!" })}
                  />
                  Nữ
                </label>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[17px] font-semibold">Ảnh đại diện</label>
              <div className="relative">
                <Input
                  type="file"
                  accept="image/*"
                  {...register("image")}
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <button
                  type="button"
                  className={cn(
                    "flex items-center gap-3 w-full p-[14px] border rounded-md transition duration-500",
                    errors.image ? "border-red-500" : "focus:border-primary focus:shadow-input-primary"
                  )}
                >
                  <FiUpload size="18" className="text-[#b2b2b2]" />
                  <p>{imageName || "Tải ảnh lên"}</p>
                </button>
              </div>

              {errors.image && (
                <p className="text-sm text-red-500">{errors.image.message}</p>
              )}

              {imageUrl ? (
                <div className="mx-auto mt-6">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-[300px] h-[300px] object-cover rounded-md border"
                  />
                </div>
              ) : (
                <p>Chưa có ảnh đại diện</p>
              )}
            </div>

            <div className="flex items-center justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/users")}
                className="min-w-[130px] h-[3.2rem] shadow-md transition duration-500"
              >
                Hủy
              </Button>

              <Button
                type="submit"
                variant="default"
                disabled={isLoading}
                className="min-w-[130px] h-[3.2rem] shadow-md transition duration-500"
              >
                {isLoading ? "Đang cập nhật..." : "Cập nhật"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default EditUser;