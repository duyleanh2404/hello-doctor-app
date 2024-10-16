"use client";

import { FiUpload } from "react-icons/fi";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import Image from "next/image";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import JoditEditor from "jodit-react";

import { cn } from "@/lib/utils";
import { DoctorData } from "@/types/doctor-types";
import { ClinicData } from "@/types/clinic-types";
import { getProvinces } from "@/services/auth-service";
import { SpecialtyData } from "@/types/specialty-types";
import { getAllClinics } from "@/services/clinic-service";
import { getAllSpecialties } from "@/services/specialty-service";
import { getDoctorById, updateDoctor } from "@/services/doctor-service";
import medicalFees from "@/constants/medical-fees";

import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatVietnameseCurrency } from "@/utils/format-currency";

const EditDoctor = () => {
  const router = useRouter();
  const { doctorId } = useParams<{ doctorId: string }>();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [contentValue, setContentValue] = useState<string>("");

  const [imageName, setImageName] = useState<string>("");
  const [imageURL, setImageURL] = useState<string | null>(null);

  const [clinicName, setClinicName] = useState<string>("");
  const [specialtyName, setspecialtyName] = useState<string>("");

  const [provinces, setProvinces] = useState<any[]>([]);
  const [clinics, setClinics] = useState<ClinicData[]>([]);
  const [specialties, setSpecialties] = useState<SpecialtyData[]>([]);

  const {
    watch,
    register,
    setValue,
    setError,
    clearErrors,
    handleSubmit,
    formState: { errors }
  } = useForm<DoctorData>();

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
    const fetchSpecialties = async () => {
      try {
        const accessToken = Cookies.get("access_token");
        if (!accessToken) return;

        const { specialties } = await getAllSpecialties({ accessToken });
        setSpecialties(specialties);
      } catch (err: any) {
        router.push("/");
        toast.error("Có lỗi xảy ra. Vui lòng thử lại sau ít phút nữa!");
      }
    };
    fetchSpecialties();
  }, []);

  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const accessToken = Cookies.get("access_token");
        if (!accessToken) return;

        const { clinics } = await getAllClinics({ accessToken });
        setClinics(clinics);
      } catch (err: any) {
        router.push("/");
        toast.error("Có lỗi xảy ra. Vui lòng thử lại sau ít phút nữa!");
      }
    };
    fetchClinics();
  }, []);

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        setIsLoading(true);
        const accessToken = Cookies.get("access_token");
        if (!accessToken) return;

        const { doctor } = await getDoctorById({ accessToken, id: doctorId });

        if (doctor) {
          setValue("desc", doctor.desc);
          setValue("clinic", doctor.clinic_id._id);
          setValue("fullname", doctor.fullname);
          setValue("province", doctor.province);
          setValue("medicalFee", doctor.medical_fee);
          setValue("specialty", doctor.specialty_id._id);

          setImageURL(doctor.image);
          setContentValue(doctor.desc);
          setImageName(doctor.imageName);
          setClinicName(doctor.clinic_id.name);
          setspecialtyName(doctor.specialty_id.name);
        }
      } catch (err: any) {
        toast.error("Có lỗi xảy ra. Vui lòng thử lại sau ít phút nữa!");
        router.push("/");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctorData();
  }, [doctorId, setValue]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      clearErrors("image");
      setImageName(file.name);
      setImageURL(URL.createObjectURL(file));
    }
  };

  const handleEditorChange = (newContent: string) => {
    clearErrors("desc");
    setContentValue(newContent);
    setValue("desc", newContent);
  };

  const handleValidateEditor = () => {
    if (contentValue.trim() !== "") return;
    setError("desc", {
      type: "manual",
      message: "Vui lòng nhập mô tả của bác sĩ!"
    });
  };

  const handleEditDoctor: SubmitHandler<DoctorData> = async (doctorData) => {
    try {
      setIsLoading(true);
      const accessToken = Cookies.get("access_token");
      if (!accessToken) return;

      const file = doctorData.image?.[0];

      await updateDoctor({
        imageName,
        accessToken,
        image: file,
        id: doctorId,
        desc: contentValue,
        fullname: doctorData.fullname,
        province: doctorData.province,
        clinic_id: doctorData.clinic,
        medical_fee: doctorData.medicalFee,
        specialty_id: doctorData.specialty
      });

      setIsLoading(false);
      toast.success("Cập nhật thông tin bác sĩ thành công!");
    } catch (err: any) {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại sau ít phút nữa!");
    } finally {
      router.push("/admin/doctors");
    }
  };

  return (
    <>
      <h1 className="text-xl font-bold mb-4">Cập nhật thông tin bác sĩ</h1>
      <form onSubmit={handleSubmit(handleEditDoctor)}>
        <div className="flex flex-col gap-8 pb-6">
          <div className="flex flex-col gap-8 -mx-4 px-4">
            <div className="flex flex-col gap-2">
              <label className="text-[17px] font-semibold">Họ tên bác sĩ</label>
              <Input
                type="text"
                spellCheck={false}
                placeholder="Nhập họ tên bác sĩ"
                {...register("fullname", { required: "Vui lòng nhập họ tên bác sĩ!" })}
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
                {...register("province", { required: "Vui lòng chọn tỉnh/thành phố!" })}
                onValueChange={(value) => {
                  clearErrors("province");
                  setValue("province", value);
                }}
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
              <label className="text-[17px] font-semibold">Chuyên khoa</label>
              <Select
                {...register("specialty", { required: "Vui lòng chọn chuyên khoa!" })}
                onValueChange={(value) => {
                  clearErrors("specialty");
                  setValue("specialty", value);
                }}
              >
                <SelectTrigger className={cn("w-full", errors.specialty && "border-red-500")}>
                  <SelectValue placeholder={`${specialtyName}` || "Chọn chuyên khoa"} />
                </SelectTrigger>
                <SelectContent>
                  {specialties?.map((specialty) => (
                    <SelectItem key={specialty?._id} value={specialty?._id}>
                      {specialty?.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {errors.specialty && (
                <p className="text-red-500 text-sm">{errors.specialty.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[17px] font-semibold">Bệnh viện</label>
              <Select
                {...register("clinic", { required: "Vui lòng chọn bệnh viện!" })}
                onValueChange={(value) => {
                  clearErrors("clinic");
                  setValue("clinic", value);
                }}
              >
                <SelectTrigger className={cn("w-full", errors.clinic && "border-red-500")}>
                  <SelectValue placeholder={`${clinicName}` || "Chọn bệnh viện"} />
                </SelectTrigger>
                <SelectContent>
                  {clinics?.map((clinic) => (
                    <SelectItem key={clinic?._id} value={clinic?._id}>
                      {clinic?.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {errors.clinic && (
                <p className="text-red-500 text-sm">{errors.clinic.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[17px] font-semibold">Giá khám bệnh</label>
              <Select
                {...register("medicalFee", { required: "Vui lòng chọn giá khám bệnh!" })}
                onValueChange={(value) => {
                  clearErrors("medicalFee");
                  setValue("medicalFee", Number(value));
                }}
              >
                <SelectTrigger className={cn("w-full", errors.medicalFee && "border-red-500")}>
                  <SelectValue placeholder={formatVietnameseCurrency(watch("medicalFee")) || "Chọn giá khám bệnh"} />
                </SelectTrigger>
                <SelectContent>
                  {medicalFees.map((item) => (
                    <SelectItem key={item.id} value={item.amount.toString()}>
                      {item.formattedAmount}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {errors.medicalFee && (
                <p className="text-red-500 text-sm">{errors.medicalFee.message}</p>
              )}
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

                <Button
                  type="button"
                  variant="ghost"
                  className={cn(
                    "h-14 flex items-center justify-start gap-3 w-full p-4 border border-dashed border-gray-300 rounded-md transition duration-500",
                    errors.image ? "border-red-500" : "focus:border-primary focus:shadow-input-primary"
                  )}
                >
                  <FiUpload size="18" />
                  <p>{imageName || "Tải ảnh lên"}</p>
                </Button>
              </div>

              {errors.image && (
                <p className="text-red-500 text-sm">{errors.image.message}</p>
              )}

              {imageURL && (
                <div className="mx-auto mt-6">
                  <Image
                    src={imageURL}
                    alt="Preview"
                    width={300}
                    height={300}
                    className="object-cover rounded-md border"
                  />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[17px] font-semibold">Mô tả bác sĩ</label>
              <JoditEditor
                value={contentValue}
                onChange={handleEditorChange}
                className={cn("!rounded-md", errors.desc && "!border-red-500")}
              />

              {errors.desc && (
                <p className="text-red-500 text-sm">{errors.desc.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/doctors")}
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
              {isLoading ? "Đang tạo..." : "Tạo mới"}
            </Button>
          </div>
        </div>
      </form>
    </>
  );
};

export default EditDoctor;