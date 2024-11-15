"use client";

import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";

import { FiUpload } from "react-icons/fi";
import { useForm, SubmitHandler } from "react-hook-form";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

import { medicalFees } from "@/constants/medical-fees";

import { Province } from "@/types/auth-types";
import { ClinicData } from "@/types/clinic-types";
import { CreateDoctorForm } from "@/types/doctor-types";

import { getAllClinics } from "@/services/clinic-service";
import { createDoctor } from "@/services/doctor-service";

import useDebounce from "@/hooks/use-debounce";
import useProvinces from "@/hooks/fetch/use-provinces";
import useSpecialties from "@/hooks/fetch/use-specialties";
import useClickOutside from "@/hooks/use-click-outside";

import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/spinner";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const CreateDoctor = () => {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);
  const [isLoading, setLoading] = useState({ clinics: false, creating: false });

  const [content, setContent] = useState<string>("");
  const [imageName, setImageName] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const provinces: Province[] = useProvinces();
  const { specialties, isLoading: isLoadingSpecialties } = useSpecialties("desc");

  const [clinics, setClinics] = useState<ClinicData[]>([]);
  const [selectedClinic, setSelectedClinic] = useState<ClinicData | null>(null);

  const [query, setQuery] = useState<string>("");
  const debouncedQuery = useDebounce(query, 500);

  const { register, setValue, setError, clearErrors, handleSubmit, formState: { errors } } = useForm<CreateDoctorForm>();

  useClickOutside(dropdownRef, () => setIsDropdownVisible(false));

  useEffect(() => {
    const fetchClinics = async () => {
      setLoading({ ...isLoading, clinics: true });

      try {
        const { clinics } = await getAllClinics({ query: debouncedQuery });
        setClinics(clinics);
      } catch (error: any) {
        console.error(error);
        toast.error("Có lỗi xảy ra. Vui lòng thử lại sau ít phút nữa!");
      } finally {
        setLoading({ ...isLoading, clinics: false });
      }
    };

    fetchClinics();
  }, [debouncedQuery]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);
    if (selectedClinic) setSelectedClinic(null);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chỉ tải lên hình ảnh!");
      return;
    }

    clearErrors("image");
    setImageName(file.name);
    setImageUrl(URL.createObjectURL(file));
  };

  const handleEditorChange = (newContent: string) => {
    clearErrors("desc");
    setContent(newContent);
    setValue("desc", newContent);
  };

  const handleValidate = () => {
    if (!selectedClinic) {
      setError("clinic_id", { type: "manual", message: "Vui lòng chọn bệnh viện!" });
    }
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (content.trim() === "") {
      setError("desc", { type: "manual", message: "Vui lòng nhập mô tả của bác sĩ!" });
    }
  };

  const handleSelectClinic = (clinic: ClinicData) => {
    clearErrors("clinic_id");
    setSelectedClinic(clinic);
    setIsDropdownVisible(false);
  };

  const handleCreateDoctor: SubmitHandler<CreateDoctorForm> = async (doctorData) => {
    const accessToken = Cookies.get("access_token");
    if (!accessToken || !selectedClinic) return;
    setLoading({ ...isLoading, creating: true });

    try {
      await createDoctor(
        accessToken,
        {
          clinic_id: selectedClinic._id,
          specialty_id: doctorData.specialty_id,
          fullname: doctorData.fullname,
          province: doctorData.province,
          medicalFee: doctorData.medicalFee,
          desc: content,
          imageName,
          image: doctorData.image?.[0]
        }
      );

      toast.success("Thêm bác sĩ thành công!");
    } catch (error: any) {
      console.error(error);
      toast.error("Thêm bác sĩ thất bại. Vui lòng thử lại sau ít phút nữa!");
    } finally {
      router.replace("/admin/manage-doctors");
    }
  };

  return (
    <>
      <h1 className="text-xl font-bold mb-4">Thêm bác sĩ mới</h1>
      <form onSubmit={handleSubmit(handleCreateDoctor)}>
        <div className="flex flex-col gap-8 pb-6">
          <div className="flex flex-col gap-8 -mx-4 px-4">
            <div className="flex flex-col gap-2">
              <label className="text-[17px] font-semibold">Họ tên bác sĩ</label>
              <Input
                type="text"
                spellCheck={false}
                placeholder="Nhập họ tên bác sĩ"
                {...register("fullname", { required: "Vui lòng nhập họ tên bác sĩ!" })}
                className={cn(errors.fullname ? "border-red-500" : "border-gray-300")}
              />
              {errors.fullname && <p className="text-red-500 text-sm">{errors.fullname.message}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[17px] font-semibold">Tỉnh/Thành phố</label>
              <Select
                onValueChange={(value) => {
                  clearErrors("province");
                  setValue("province", value);
                }}
                {...register("province", { required: "Vui lòng chọn tỉnh/thành phố!" })}
              >
                <SelectTrigger className={cn("w-full", errors.province && "border-red-500")}>
                  <SelectValue placeholder="Chọn tỉnh/thành phố" />
                </SelectTrigger>
                <SelectContent>
                  {provinces?.length > 0 ? (
                    provinces?.map((province: any) => (
                      <SelectItem key={province?._id} value={province?.name}>{province?.name}</SelectItem>
                    ))
                  ) : (
                    <p className="text-sm font-medium text-[#595959] text-center p-12 mx-auto">
                      Không tìm thấy tỉnh thành nào!
                    </p>
                  )}
                </SelectContent>
              </Select>
              {errors.province && <p className="text-red-500 text-sm">{errors.province.message}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[17px] font-semibold">Chuyên khoa</label>
              <Select
                onValueChange={(value) => {
                  clearErrors("specialty_id");
                  setValue("specialty_id", value);
                }}
                {...register("specialty_id", { required: "Vui lòng chọn chuyên khoa!" })}
              >
                <SelectTrigger className={cn("w-full", errors.specialty_id && "border-red-500")}>
                  <SelectValue placeholder="Chọn chuyên khoa" />
                </SelectTrigger>
                <SelectContent>
                  {isLoadingSpecialties ? (
                    <div className="py-6"><Spinner table /></div>
                  ) : (
                    specialties?.length > 0 ? (
                      specialties?.map((specialty) => (
                        <SelectItem key={specialty?._id} value={specialty?._id}>
                          <div className="w-full flex items-center justify-start gap-4 hover:text-primary transition duration-500">
                            <Image
                              loading="lazy"
                              src={specialty?.image}
                              alt={specialty?.name}
                              width="30"
                              height="30"
                              className="object-cover rounded-full"
                            />
                            <p className="w-fit font-medium text-ellipsis overflow-hidden">{specialty?.name}</p>
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      <p className="text-sm font-medium text-[#595959] text-center p-12 mx-auto">
                        Không tìm thấy chuyên khoa nào!
                      </p>
                    )
                  )}
                </SelectContent>
              </Select>
              {errors.specialty_id && <p className="text-red-500 text-sm">{errors.specialty_id.message}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[17px] font-semibold">Bệnh viện</label>
              <div ref={dropdownRef} className="relative w-full lg:w-auto flex-1">
                <Input
                  value={selectedClinic ? selectedClinic?.name : query}
                  spellCheck={false}
                  onChange={handleInputChange}
                  onFocus={() => setIsDropdownVisible(true)}
                  placeholder="Tìm kiếm theo tên bệnh viện/ phòng khám"
                  className={cn(errors.clinic_id ? "border-red-500" : "border-gray-300")}
                />

                <div
                  onClick={(event) => event.stopPropagation()}
                  className={cn(
                    "absolute top-[calc(100%+10px)] left-0 w-full max-h-[400px] py-2 bg-white border rounded-lg shadow-md z-10 transition duration-500 overflow-y-auto select-none",
                    isDropdownVisible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                  )}
                >
                  {isLoading.clinics ? (
                    <div className="py-6"><Spinner table /></div>
                  ) : (
                    clinics?.length > 0 ? (
                      clinics?.map((clinic: ClinicData) => (
                        <Button
                          type="button"
                          variant="ghost"
                          key={clinic?._id}
                          onClick={() => handleSelectClinic(clinic)}
                          className="w-full h-14 flex items-center justify-start gap-4 hover:text-primary transition duration-500"
                        >
                          <Image
                            loading="lazy"
                            src={clinic?.avatar}
                            alt={clinic?.name}
                            width="40"
                            height="40"
                            className="object-cover rounded-full"
                          />
                          <p className="w-fit font-medium text-ellipsis overflow-hidden">{clinic?.name}</p>
                        </Button>
                      ))
                    ) : (
                      <p className="text-sm font-medium text-[#595959] text-center p-12 mx-auto">
                        Không tìm thấy bệnh viện nào!
                      </p>
                    )
                  )}
                </div>
              </div>
              {errors.clinic_id && <p className="text-red-500 text-sm">{errors.clinic_id.message}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[17px] font-semibold">Giá khám bệnh</label>
              <Select
                onValueChange={(value) => {
                  clearErrors("medicalFee");
                  setValue("medicalFee", Number(value));
                }}
                {...register("medicalFee", { required: "Vui lòng chọn giá khám bệnh!" })}
              >
                <SelectTrigger className={cn("w-full", errors.medicalFee && "border-red-500")}>
                  <SelectValue placeholder="Chọn giá khám bệnh" />
                </SelectTrigger>
                <SelectContent>
                  {medicalFees.map(({ id, amount, formattedAmount }) => (
                    <SelectItem key={id} value={amount.toString()}>{formattedAmount}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.medicalFee && <p className="text-red-500 text-sm">{errors.medicalFee.message}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[17px] font-semibold">Ảnh đại diện</label>
              <div className="relative">
                <Input
                  type="file"
                  accept="image/*"
                  {...register("image", { required: "Vui lòng tải ảnh đại diện của bác sĩ!" })}
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                <Button
                  type="button"
                  size="lg"
                  variant="upload"
                  className={cn(errors.image ? "border-red-500" : "border-gray-300")}
                >
                  <FiUpload size="18" />
                  <p>{imageName || "Tải ảnh lên"}</p>
                </Button>
              </div>

              {errors.image && <p className="text-red-500 text-sm">{errors.image.message}</p>}

              {imageUrl && (
                <div className="mx-auto mt-6">
                  <Image
                    src={imageUrl}
                    alt="Preview"
                    width={300}
                    height={300}
                    className="object-cover rounded-full"
                  />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[17px] font-semibold">Mô tả bác sĩ</label>
              <JoditEditor
                value={content}
                onChange={handleEditorChange}
                className={cn("!rounded-md", errors.desc && "!border-red-500")}
              />
              {errors.desc && <p className="text-red-500 text-sm">{errors.desc.message}</p>}
            </div>
          </div>

          <div className="flex items-center justify-end gap-4">
            <Button type="button" size="lg" variant="cancel" onClick={() => router.replace("/admin/manage-doctors")}>
              Hủy
            </Button>
            <Button type="submit" size="lg" variant="submit" disabled={isLoading.creating} onClick={handleValidate}>
              {isLoading.creating ? "Đang tạo..." : "Tạo mới"}
            </Button>
          </div>
        </div>
      </form>
    </>
  );
};

export default CreateDoctor;