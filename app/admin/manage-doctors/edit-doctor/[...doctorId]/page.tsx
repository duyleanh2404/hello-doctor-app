"use client";

import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

import { FiUpload } from "react-icons/fi";
import { useForm, SubmitHandler } from "react-hook-form";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import JoditEditor from "jodit-react";

import { medicalFees } from "@/constants/medical-fees";
import { formatVietnameseCurrency } from "@/utils/format-vietnamese-currency";

import { ClinicData } from "@/types/clinic-types";
import { EditDoctorForm } from "@/types/doctor-types";

import { getAllClinics } from "@/services/clinic-service";
import { editDoctor, getDoctorById } from "@/services/doctor-service";

import useDebounce from "@/hooks/use-debounce";
import useProvinces from "@/hooks/fetch/use-provinces";
import useClickOutside from "@/hooks/use-click-outside";
import useSpecialties from "@/hooks/fetch/use-specialties";

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

const EditDoctor = () => {
  const router = useRouter();

  const { doctorId } = useParams<{ doctorId: string }>();
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [isLoading, setLoading] = useState<boolean>(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);

  const [imageName, setImageName] = useState<string>("");
  const [imageURL, setImageURL] = useState<string | null>(null);

  const [content, setContent] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");
  const [specialtyName, setSpecialtyName] = useState<string>("");

  const provinces: any[] = useProvinces();
  const { specialties, isLoading: isLoadingSpecialties } = useSpecialties("desc");

  const [clinics, setClinics] = useState<ClinicData[]>([]);
  const [selectedClinic, setSelectedClinic] = useState<ClinicData | null>(null);

  const [query, setQuery] = useState<string>("");
  const debouncedQuery = useDebounce(query, 500);

  const {
    watch,
    register,
    setValue,
    setError,
    clearErrors,
    handleSubmit,
    formState: { errors }
  } = useForm<EditDoctorForm>();

  useClickOutside(dropdownRef, () => setIsDropdownVisible(false));

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const { doctor } = await getDoctorById(atob(doctorId[0]));
        if (doctor) {
          const doctorData = {
            clinic_id: doctor.clinic_id._id,
            specialty_id: doctor.specialty_id._id,
            fullname: doctor.fullname,
            province: doctor.province,
            medicalFee: doctor.medicalFee
          };

          Object.entries(doctorData).forEach(([key, value]: any) => {
            setValue(key, value);
          });

          setContent(doctor.desc);
          setImageURL(doctor.image);
          setImageName(doctor.imageName);
          setSelectedClinic(doctor.clinic_id);
          setSpecialtyName(doctor.specialty_id.name);
        }
      } catch (error: any) {
        toast.error("Có lỗi xảy ra. Vui lòng thử lại sau ít phút nữa!");
      }
    };

    fetchDoctorData();
  }, []);

  const fetchClinics = async (query?: string) => {
    try {
      const { clinics } = await getAllClinics({
        query, exclude: "desc, address, banner"
      });
      setClinics(clinics);
    } catch (error: any) {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại sau ít phút nữa!");
    }
  };

  useEffect(() => {
    fetchClinics(debouncedQuery);
  }, [debouncedQuery]);

  useEffect(() => {
    if (selectedClinic) setInputValue(selectedClinic.name);
  }, [selectedClinic]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);
    setInputValue(value);
    setIsDropdownVisible(!!value);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    clearErrors("image");
    setImageName(file.name);
    setImageURL(URL.createObjectURL(file));
  };

  const handleEditorChange = (newContent: string) => {
    clearErrors("desc");
    setContent(newContent);
    setValue("desc", newContent);
  };

  const handleValidate = () => {
    setIsDropdownVisible(false);

    if (inputValue !== selectedClinic?.name || !selectedClinic) {
      setError("clinic_id", {
        type: "manual",
        message: "Vui lòng chọn bệnh viện!"
      });
    } else {
      clearErrors("clinic_id");
    }

    if (content.trim() === "") {
      setError("desc", {
        type: "manual",
        message: "Vui lòng nhập mô tả của bác sĩ!"
      });
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectClinic = (clinic: ClinicData) => {
    clearErrors("clinic_id");
    setSelectedClinic(clinic);
    setInputValue(clinic?.name);
    setIsDropdownVisible(false);
  };

  const handleEditDoctor: SubmitHandler<EditDoctorForm> = async (data) => {
    const accessToken = Cookies.get("access_token");
    if (!accessToken || !selectedClinic) return;

    setLoading(true);

    try {
      await editDoctor(
        accessToken,
        {
          id: atob(doctorId[0]),
          clinic_id: selectedClinic._id,
          specialty_id: data.specialty_id,
          fullname: data.fullname,
          province: data.province,
          medicalFee: data.medicalFee,
          desc: content,
          imageName,
          image: data.image?.[0]
        }
      );

      toast.success("Cập nhật thông tin bác sĩ thành công!");
    } catch (error: any) {
      toast.error("Cập nhật bác sĩ thất bại. Vui lòng thử lại sau ít phút nữa!");
    } finally {
      router.replace("/admin/manage-doctors");
    }
  };

  if (provinces.length === 0 || clinics.length === 0 || specialties.length === 0) {
    return <Spinner center />;
  }

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
                className={cn(errors.fullname ? "border-red-500" : "border-gray-300")}
              />
              {errors.fullname && (
                <p className="text-red-500 text-sm">{errors.fullname.message}</p>
              )}
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
                  <SelectValue placeholder={watch("province") || "Chọn tỉnh/thành phố"} />
                </SelectTrigger>
                <SelectContent>
                  {provinces?.length > 0 ? (
                    provinces?.map((province) => (
                      <SelectItem key={province?._id} value={province?.name}>
                        {province?.name}
                      </SelectItem>
                    ))
                  ) : (
                    <p className="text-sm font-medium text-[#595959] text-center p-12 mx-auto">
                      Không tìm thấy tỉnh thành nào!
                    </p>
                  )}
                </SelectContent>
              </Select>
              {errors.province && (
                <p className="text-red-500 text-sm">{errors.province.message}</p>
              )}
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
                  <SelectValue placeholder={specialtyName || "Chọn chuyên khoa"} />
                </SelectTrigger>
                <SelectContent>
                  {isLoadingSpecialties ? (
                    <div className="py-6">
                      <Spinner table />
                    </div>
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
                            <p className="w-fit font-medium text-ellipsis overflow-hidden">
                              {specialty?.name}
                            </p>
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
              {errors.specialty_id && (
                <p className="text-red-500 text-sm">{errors.specialty_id.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[17px] font-semibold">Bệnh viện</label>
              <div ref={dropdownRef} className="relative w-full lg:w-auto flex-1">
                <Input
                  value={inputValue}
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
                  {clinics?.length > 0 ? (
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
                        <p className="w-fit font-medium text-ellipsis overflow-hidden">
                          {clinic?.name}
                        </p>
                      </Button>
                    ))
                  ) : (
                    <p className="text-sm font-medium text-[#595959] text-center p-12 mx-auto">
                      Không tìm thấy bệnh viện nào!
                    </p>
                  )}
                </div>
              </div>
              {errors.clinic_id && (
                <p className="text-red-500 text-sm">{errors.clinic_id.message}</p>
              )}
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
                  <SelectValue placeholder={formatVietnameseCurrency(watch("medicalFee")) || "Chọn giá khám bệnh"} />
                </SelectTrigger>
                <SelectContent>
                  {medicalFees.map(({ id, amount, formattedAmount }) => (
                    <SelectItem key={id} value={amount.toString()}>{formattedAmount}</SelectItem>
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
                  size="lg"
                  variant="upload"
                  className={cn(errors.image ? "border-red-500" : "border-gray-300")}
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
              {errors.desc && (
                <p className="text-red-500 text-sm">{errors.desc.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-4">
            <Button
              type="button"
              size="lg"
              variant="cancel"
              onClick={() => router.replace("/admin/manage-doctors")}
            >
              Hủy
            </Button>

            <Button
              type="submit"
              size="lg"
              variant="submit"
              disabled={isLoading}
              onClick={handleValidate}
            >
              {isLoading ? "Đang cập nhật..." : "Cập nhật"}
            </Button>
          </div>
        </div>
      </form>
    </>
  );
};

export default EditDoctor;