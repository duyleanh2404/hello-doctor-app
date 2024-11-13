"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { FiUpload } from "react-icons/fi";
import { useForm, SubmitHandler } from "react-hook-form";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import JoditEditor from "jodit-react";

import { CreateClinicForm } from "@/types/clinic-types";
import { createClinic } from "@/services/clinic-service";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SelectAddress from "@/components/select-address";

const CreateClinic = () => {
  const router = useRouter();

  const [content, setContent] = useState<string>("");
  const [isLoading, setLoading] = useState<boolean>(false);

  const [avatarName, setAvatarName] = useState<string>("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const [bannerName, setBannerName] = useState<string>("");
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);

  const [selectedProvince, setSelectedProvince] = useState<any | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<any | null>(null);

  const {
    watch,
    register,
    setValue,
    setError,
    clearErrors,
    handleSubmit,
    formState: { errors }
  } = useForm<CreateClinicForm>();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    clearErrors(type === "avatar" ? "avatar" : "banner");

    if (type === "avatar") {
      setAvatarName(file.name);
      setAvatarUrl(URL.createObjectURL(file));
    } else {
      setBannerName(file.name);
      setBannerUrl(URL.createObjectURL(file));
    }
  };

  const handleEditorChange = (newContent: string) => {
    clearErrors("desc");
    setContent(newContent);
    setValue("desc", newContent);
  };

  const handleValidateEditor = () => {
    if (content.trim() !== "") return;
    setError("desc", {
      type: "manual",
      message: "Vui lòng nhập mô tả của bệnh viện!"
    });
  };

  const handleCreateClinic: SubmitHandler<CreateClinicForm> = async (data) => {
    const accessToken = Cookies.get("access_token");
    if (!accessToken) return;

    setLoading(true);

    try {
      const avatarFile = data.avatar?.[0];
      const bannerFile = data.banner?.[0];

      await createClinic(
        accessToken,
        {
          avatarName,
          bannerName,
          avatar: avatarFile,
          banner: bannerFile,
          desc: content,
          name: data.name,
          address: `${data.street}, ${data.ward}, ${data.district}, ${data.province}`,
        }
      );

      router.replace("/admin/manage-clinics");
      toast.success("Thêm bệnh viện thành công!");
    } catch (error: any) {
      setLoading(false);

      switch (error) {
        case 409:
          setError("name", {
            type: "manual",
            message: "Bệnh viện này đã tồn tại!"
          });
          window.scrollTo({ top: 0, behavior: "smooth" });
          break;

        default:
          toast.success("Thêm bệnh viện thất bại. Vui lòng thử lại sau ít phút nữa!");
          router.replace("/admin/manage-clinics");
          break;
      }
    }
  };

  return (
    <>
      <h1 className="text-xl font-bold mb-4">Thêm bệnh viện mới</h1>

      <form onSubmit={handleSubmit(handleCreateClinic)}>
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
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
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
                  {...register("avatar", { required: "Vui lòng tải ảnh đại diện của chuyên khoa!" })}
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

              {errors.avatar && (
                <p className="text-red-500 text-sm">{errors.avatar.message}</p>
              )}

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
                  {...register("banner", { required: "Vui lòng tải ảnh bìa của chuyên khoa!" })}
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

              {errors.banner && (
                <p className="text-red-500 text-sm">{errors.banner.message}</p>
              )}

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
              <label className="text-[17px] font-semibold">Mô tả bệnh viện</label>
              <JoditEditor
                value={content}
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
                size="lg"
                variant="cancel"
                onClick={() => router.replace("/admin/manage-clinics")}
              >
                Hủy
              </Button>

              <Button
                type="submit"
                size="lg"
                variant="submit"
                disabled={isLoading}
                onClick={handleValidateEditor}
              >
                {isLoading ? "Đang tạo..." : "Tạo mới"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default CreateClinic;