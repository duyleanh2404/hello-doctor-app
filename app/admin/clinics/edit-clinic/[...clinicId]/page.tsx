"use client";

import { FiUpload } from "react-icons/fi";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import Image from "next/image";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import JoditEditor from "jodit-react";

import { cn } from "@/lib/utils";
import { getProvinces } from "@/services/auth-service";
import { getClinicById, updateClinic } from "@/services/clinic-service";

import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ClinicData {
  _id?: string;
  name: string;
  desc: string;
  street: string;
  district: string;
  province: string;
  avatar: FileList | null;
  banner: FileList | null;
};

const EditClinic = () => {
  const router = useRouter();
  const { clinicId } = useParams<{ clinicId: string }>();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [contentValue, setContentValue] = useState<string>("");

  const [avatarName, setAvatarName] = useState<string>("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const [bannerName, setBannerName] = useState<string>("");
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);

  const [provinces, setProvinces] = useState<any[]>([]);
  const [provinceName, setProvinceName] = useState<string>("");
  const [selectedProvince, setSelectedProvince] = useState<any | null>(null);

  const {
    watch,
    register,
    setValue,
    setError,
    clearErrors,
    handleSubmit,
    formState: { errors }
  } = useForm<ClinicData>();

  useEffect(() => {
    if (!provinceName) return;

    const province = provinces.find((province) => province.name === provinceName.trim());
    setSelectedProvince(province);
  }, [provinceName]);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const { data } = await getProvinces();
        setProvinces(data);
      } catch (err: any) {
        router.push("/");
        toast.error("Có lỗi xảy ra. Vui lòng thử lại sau ít phút nữa!");
      }
    };
    fetchProvinces();
  }, []);

  useEffect(() => {
    const fetchClinicData = async () => {
      try {
        if (!clinicId) return;
        setIsLoading(true);

        const accessToken = Cookies.get("access_token");
        if (!accessToken) return;

        const { clinic } = await getClinicById({ accessToken, id: clinicId });

        if (clinic) {
          const [street, district, province] = clinic.address.split(",").map((part: any) => part.trim());

          setValue("street", street);
          setValue("name", clinic.name);
          setValue("desc", clinic.desc);
          setValue("district", district);
          setValue("province", province);

          setProvinceName(province);
          setAvatarUrl(clinic.avatar);
          setBannerUrl(clinic.banner);
          setContentValue(clinic.desc);
          setAvatarName(clinic.avatarName);
          setBannerName(clinic.bannerName);
        }
      } catch (err: any) {
        toast.error("Có lỗi xảy ra. Vui lòng thử lại sau ít phút nữa!");
      } finally {
        setIsLoading(false);
      }
    };

    fetchClinicData();
  }, [clinicId]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = event.target.files?.[0];
    if (file) {
      clearErrors(type === "avatar" ? "avatar" : "banner");
      if (type === "avatar") {
        setAvatarName(file.name);
        setAvatarUrl(URL.createObjectURL(file));
      } else {
        setBannerName(file.name);
        setBannerUrl(URL.createObjectURL(file));
      }
    }
  };

  const handleEditorChange = (newContent: string) => {
    clearErrors("desc");
    setContentValue(newContent);
    setValue("desc", newContent);
  };

  const handleProvinceChange = (provinceName: any) => {
    const province = provinces.find((province) => province.name === provinceName);
    if (!province) return;

    clearErrors("province");
    setValue("district", "Chọn quận/huyện");
    setSelectedProvince(province);
    setValue("province", provinceName);
  };

  const handleValidateEditor = () => {
    if (contentValue.trim() !== "") return;
    setError("desc", {
      type: "manual",
      message: "Vui lòng nhập mô tả của bệnh viện!"
    });
  };

  const handleEditClinic: SubmitHandler<ClinicData> = async (clinicData) => {
    setIsLoading(true);
    const accessToken = Cookies.get("access_token");
    if (!accessToken) return;

    const avatarFile = clinicData.avatar?.[0];
    const bannerFile = clinicData.banner?.[0];

    const { errorCode } = await updateClinic({
      id: clinicId,
      avatarName,
      bannerName,
      accessToken,
      avatar: avatarFile,
      banner: bannerFile,
      name: clinicData.name,
      desc: clinicData.desc,
      address: `${clinicData.street}, ${clinicData.district}, ${clinicData.province}`
    });

    if (errorCode === "CLINIC_ALREADY_EXISTS") {
      setIsLoading(false);
      setError("name", {
        type: "manual",
        message: "Bệnh viện này đã tồn tại!"
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setIsLoading(false);
    router.push("/admin/clinics");
    toast.success("Cập nhật bệnh viện thành công!");
  };

  return (
    <>
      <h1 className="text-xl font-bold mb-4">Chỉnh sửa thông tin bệnh viện</h1>
      <form onSubmit={handleSubmit(handleEditClinic)}>
        <div className="flex flex-col gap-8 pb-6">
          <div className="flex flex-col gap-8 -mx-4 px-4">
            <div className="flex flex-col gap-2">
              <label className="text-[17px] font-semibold">Tên bệnh viện</label>
              <Input
                type="text"
                spellCheck={false}
                placeholder="Nhập tên bệnh viện"
                {...register("name", { required: "Vui lòng nhập tên bệnh viện!" })}
                className={cn(
                  "border border-gray-300 rounded-md p-[14px] transition duration-500",
                  errors.name ? "border-red-500" : "focus:border-primary focus:shadow-input-primary"
                )}
              />

              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
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
                  <SelectValue placeholder={watch("province") || "Chọn tỉnh/thành phố"} />
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
                {...register("district", {
                  required: "Vui lòng chọn quận/huyện!"
                })}
                onValueChange={(value) => setValue("district", value)}
              >
                <SelectTrigger className={cn("w-full", errors.district && "border-red-500")}>
                  <SelectValue placeholder={watch("district") || "Chọn quận/huyện"} />
                </SelectTrigger>
                <SelectContent>
                  {selectedProvince?.districts?.map((district: any) => (
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
              <label className="text-[17px] font-semibold">Ảnh đại diện</label>
              <div className="relative">
                <Input
                  type="file"
                  accept="image/*"
                  {...register("avatar")}
                  onChange={(e) => handleFileChange(e, "avatar")}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                <Button
                  type="button"
                  variant="ghost"
                  className={cn(
                    "h-14 flex items-center justify-start gap-3 w-full p-4 border border-dashed border-gray-300 rounded-md transition duration-500",
                    errors.avatar ? "border-red-500" : "focus:border-primary focus:shadow-input-primary"
                  )}
                >
                  <FiUpload size="18" />
                  <p>{avatarName || "Tải ảnh lên"}</p>
                </Button>
              </div>

              {errors.avatar && (
                <p className="text-red-500 text-sm">{errors.avatar.message}</p>
              )}

              {avatarUrl && (
                <div className="mx-auto mt-6">
                  <Image
                    src={avatarUrl}
                    alt="Preview"
                    width={300}
                    height={300}
                    className="object-cover rounded-md border"
                  />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[17px] font-semibold">Ảnh bìa</label>
              <div className="relative">
                <Input
                  type="file"
                  accept="image/*"
                  {...register("banner")}
                  onChange={(e) => handleFileChange(e, "banner")}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                <Button
                  type="button"
                  variant="ghost"
                  className={cn(
                    "h-14 flex items-center justify-start gap-3 w-full p-4 border border-dashed border-gray-300 rounded-md transition duration-500",
                    errors.banner ? "border-red-500" : "focus:border-primary focus:shadow-input-primary"
                  )}
                >
                  <FiUpload size="18" />
                  <p>{bannerName || "Tải ảnh lên"}</p>
                </Button>
              </div>

              {errors.banner && (
                <p className="text-red-500 text-sm">{errors.banner.message}</p>
              )}

              {bannerUrl && (
                <div className="mx-auto mt-6">
                  <Image
                    src={bannerUrl}
                    alt="Preview"
                    width={300}
                    height={300}
                    className="object-cover rounded-md border"
                  />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[17px] font-semibold">Mô tả</label>
              <JoditEditor
                value={contentValue}
                onChange={handleEditorChange}
                className={cn("!rounded-md", errors.desc && "!border-red-500")}
              />

              {errors.desc && (
                <p className="text-red-500 text-sm">{errors.desc.message}</p>
              )}
            </div>

            <div className="flex items-center justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/clinics")}
                className="min-w-[130px] h-[3.2rem] shadow-md transition duration-500"
              >
                Hủy
              </Button>

              <Button
                type="submit"
                variant="default"
                disabled={isLoading}
                onClick={handleValidateEditor}
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

export default EditClinic;