"use client";

import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import dynamic from "next/dynamic";

import { FiUpload } from "react-icons/fi";
import { SubmitHandler, useForm } from "react-hook-form";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

import { getClinicById, editClinic } from "@/services/clinic-service";

import { EditClinicForm } from "@/types/clinic-types";
import { District, Province } from "@/types/auth-types";

import useDistricts from "@/hooks/fetch/use-districts";
import useProvinces from "@/hooks/fetch/use-provinces";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/spinner";
import SelectAddress from "@/components/select-address";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const EditClinic = () => {
  const router = useRouter();
  const { clinicId } = useParams<{ clinicId: string }>();

  const [content, setContent] = useState<string>("");
  const [isLoading, setLoading] = useState({ clinic: false, editing: false });

  const [avatarName, setAvatarName] = useState<string>("");
  const [avatarUrl, setavatarUrl] = useState<string | null>(null);

  const [bannerName, setBannerName] = useState<string>("");
  const [bannerUrl, setbannerUrl] = useState<string | null>(null);

  const [provinceName, setProvinceName] = useState<string>("");
  const [districtName, setDistrictName] = useState<string>("");

  const [selectedProvince, setSelectedProvince] = useState<any | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<any | null>(null);

  const provinces: Province[] = useProvinces();
  const districts: District[] = useDistricts(selectedProvince);

  const {
    watch, register, setValue, setError, clearErrors, handleSubmit, formState: { errors }
  } = useForm<EditClinicForm>();

  useEffect(() => {
    if (!provinceName) return;
    const province = provinces.find((province: any) => province.name === provinceName.trim());
    setSelectedProvince(province);
  }, [provinceName, provinces]);

  useEffect(() => {
    if (!districts || !districtName) return;
    const district = districts.find((district: any) => district.name === districtName.trim());
    setSelectedDistrict(district);
  }, [districts, districtName]);

  useEffect(() => {
    const fetchClinicData = async () => {
      setLoading((prevLoading) => ({ ...prevLoading, clinic: true }));

      try {
        const { clinic } = await getClinicById(atob(clinicId[0]));
        const [street, ward, district, province] = clinic.address.split(",").map((part: any) => part.trim());

        const clinicData = { name: clinic.name, street, ward, district, province };
        Object.entries(clinicData).forEach(([key, value]: any) => {
          setValue(key, value);
        });

        setContent(clinic.desc);
        setProvinceName(province);
        setDistrictName(district);
        setavatarUrl(clinic.avatar);
        setbannerUrl(clinic.banner);
        setAvatarName(clinic.avatarName);
        setBannerName(clinic.bannerName);
      } catch (error: any) {
        console.error(error);
        toast.error("Có lỗi xảy ra. Vui lòng thử lại sau ít phút nữa!");
      } finally {
        setLoading((prevLoading) => ({ ...prevLoading, clinic: false }));
      }
    };

    fetchClinicData();
  }, [clinicId, isLoading, setValue]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chỉ tải lên hình ảnh!");
      return;
    }

    clearErrors(type === "avatar" ? "avatar" : "banner");
    if (type === "avatar") {
      setAvatarName(file.name);
      setavatarUrl(URL.createObjectURL(file));
    } else {
      setBannerName(file.name);
      setbannerUrl(URL.createObjectURL(file));
    }
  };

  const handleEditorChange = (newContent: string) => {
    clearErrors("desc");
    setContent(newContent);
    setValue("desc", newContent);
  };

  const handleValidateEditor = () => {
    if (content.trim() === "") {
      setError("desc", { type: "manual", message: "Vui lòng nhập mô tả của bệnh viện!" });
    }
  };

  const handleEditClinic: SubmitHandler<EditClinicForm> = async (clinicData) => {
    const accessToken = Cookies.get("access_token");
    if (!accessToken) return;
    setLoading({ ...isLoading, editing: true });

    try {
      await editClinic(
        accessToken,
        {
          id: clinicId,
          name: clinicData.name,
          desc: content,
          avatarName,
          bannerName,
          avatar: clinicData.avatar?.[0],
          banner: clinicData.banner?.[0],
          address: `${clinicData.street}, ${clinicData.ward}, ${clinicData.district}, ${clinicData.province}`
        }
      );

      router.replace("/admin/manage-clinics");
      toast.success("Cập nhật bệnh viện thành công!");
    } catch (status: any) {
      handleError(status);
    }
  };

  const handleError = (status: number) => {
    setLoading({ ...isLoading, editing: false });

    if (status === 409) {
      setError("name", {
        type: "manual", message: "Bệnh viện này đã tồn tại!"
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      toast.error("Cập nhật bệnh viện thất bại. Vui lòng thử lại sau ít phút nữa!");
      router.replace("/admin/manage-clinics");
    }
  };

  if (isLoading.clinic) {
    return <Spinner center />;
  }

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
                className={cn(errors.name ? "border-red-500" : "border-gray-300")}
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>

            <SelectAddress
              watch={watch}
              errors={errors}
              register={register}
              setValue={setValue}
              clearErrors={clearErrors}
              selectedProvince={selectedProvince}
              selectedDistrict={selectedDistrict}
              setSelectedProvince={setSelectedProvince}
              setSelectedDistrict={setSelectedDistrict}
            />

            <div className="flex flex-col gap-2">
              <label className="text-[17px] font-semibold">Ảnh đại diện</label>
              <div className="relative">
                <Input
                  type="file"
                  accept="image/*"
                  {...register("avatar")}
                  onChange={(event) => handleFileChange(event, "avatar")}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                <Button
                  type="button"
                  size="lg"
                  variant="upload"
                  className={cn(errors.avatar ? "border-red-500" : "border-gray-300")}
                >
                  <FiUpload size="18" />
                  <p>{avatarName || "Tải ảnh lên"}</p>
                </Button>
              </div>

              {errors.avatar && <p className="text-red-500 text-sm">{errors.avatar.message}</p>}

              {avatarUrl && (
                <div className="mx-auto mt-6">
                  <Image
                    src={avatarUrl}
                    alt="Preview"
                    width={350}
                    height={350}
                    className="object-cover rounded-md"
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
                  onChange={(event) => handleFileChange(event, "banner")}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                <Button
                  type="button"
                  size="lg"
                  variant="upload"
                  className={cn(errors.banner ? "border-red-500" : "border-gray-300")}
                >
                  <FiUpload size="18" />
                  <p>{bannerName || "Tải ảnh lên"}</p>
                </Button>
              </div>

              {errors.banner && <p className="text-red-500 text-sm">{errors.banner.message}</p>}

              {bannerUrl && (
                <div className="mx-auto mt-6">
                  <Image
                    src={bannerUrl}
                    alt="Preview"
                    width={700}
                    height={700}
                    className="object-cover rounded-md"
                  />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[17px] font-semibold">Mô tả</label>
              <JoditEditor
                value={content}
                onChange={handleEditorChange}
                className={cn("!rounded-md", errors.desc && "!border-red-500")}
              />
              {errors.desc && <p className="text-red-500 text-sm">{errors.desc.message}</p>}
            </div>

            <div className="flex items-center justify-end gap-4">
              <Button type="button" size="lg" variant="cancel" onClick={() => router.replace("/admin/manage-clinics")}>
                Hủy
              </Button>
              <Button type="submit" size="lg" variant="submit" disabled={isLoading.editing} onClick={handleValidateEditor}>
                {isLoading.editing ? "Đang cập nhật..." : "Cập nhật"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default EditClinic;