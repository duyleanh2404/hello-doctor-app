"use client";

import { FiUpload } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import JoditEditor from "jodit-react";

import { cn } from "@/lib/utils";
import { updateSpecialty, getSpecialtyById } from "@/services/specialty-service";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SpecialtyData {
  _id?: string;
  name: string;
  desc: string;
  image: FileList | null;
};

const EditSpecialty = () => {
  const router = useRouter();
  const { specialtyId } = useParams<{ specialtyId: string }>();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [contentValue, setContentValue] = useState<string>("");

  const [imageName, setImageName] = useState<string>("");
  const [imageURL, setImageURL] = useState<string | null>(null);

  const {
    register,
    setValue,
    setError,
    clearErrors,
    handleSubmit,
    formState: { errors }
  } = useForm<SpecialtyData>();

  useEffect(() => {
    const fetchSpecialtyData = async () => {
      try {
        setIsLoading(true);
        const accessToken = Cookies.get("access_token");
        if (!accessToken) return;

        const { specialty } = await getSpecialtyById({ accessToken, id: specialtyId });

        if (specialty) {
          setValue("name", specialty.name);
          setValue("desc", specialty.desc);

          setImageURL(specialty.image);
          setContentValue(specialty.desc);
          setImageName(specialty.imageName);
        }
      } catch (err: any) {
        toast.error("Có lỗi xảy ra. Vui lòng thử lại sau ít phút nữa!");
        router.push("/");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSpecialtyData();
  }, [specialtyId, setValue]);

  const handleEditorChange = (newContent: string) => {
    clearErrors("desc");
    setContentValue(newContent);
    setValue("desc", newContent);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      clearErrors("image");
      setImageName(file.name);
      setImageURL(URL.createObjectURL(file));
    }
  };

  const handleEditSpecialty: SubmitHandler<SpecialtyData> = async (specialtyData) => {
    setIsLoading(true);
    const accessToken = Cookies.get("access_token");
    if (!accessToken) return;

    const file = specialtyData.image?.[0];

    const { errorCode } = await updateSpecialty({
      imageName,
      accessToken,
      image: file,
      id: specialtyId,
      desc: contentValue,
      name: specialtyData.name
    });

    if (errorCode === "SPECIALTY_ALREADY_EXISTS") {
      setIsLoading(false);
      setError("name", {
        type: "manual",
        message: "Chuyên khoa này đã tồn tại!"
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setIsLoading(false);
    router.push("/admin/specialties");
    toast.success("Cập nhật chuyên khoa thành công!");
  };

  return (
    <>
      <h1 className="text-xl font-bold mb-4">Chỉnh sửa chuyên khoa</h1>
      <form onSubmit={handleSubmit(handleEditSpecialty)}>
        <div className="flex flex-col gap-8 pb-6">
          <div className="flex flex-col gap-8 -mx-4 px-4">
            <div className="flex flex-col gap-2">
              <label className="text-[17px] font-semibold">Tên chuyên khoa</label>
              <Input
                type="text"
                spellCheck={false}
                placeholder="Nhập tên chuyên khoa"
                {...register("name", {
                  required: "Vui lòng nhập tên chuyên khoa!"
                })}
                className={cn(
                  "border border-gray-300 rounded-md p-[14px] transition duration-500",
                  errors.name ? "border-red-500" : "focus:border-primary focus:shadow-input-primary"
                )}
              />

              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
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

              {imageURL && (
                <div className="mx-auto mt-6">
                  <img
                    src={imageURL}
                    alt="Preview"
                    className="w-[300px] h-[300px] object-cover rounded-md border"
                  />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[17px] font-semibold">Mô tả chuyên khoa</label>
              <JoditEditor
                value={contentValue}
                onChange={handleEditorChange}
                className={cn("!rounded-md", errors.desc && "!border-red-500")}
              />

              {errors.desc && (
                <p className="text-sm text-red-500">{errors.desc.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/specialties")}
              className="min-w-[130px] h-[3.2rem] shadow-md transition duration-500"
            >
              Hủy
            </Button>

            <Button
              type="submit"
              disabled={isLoading}
              className="min-w-[130px] h-[3.2rem] shadow-md transition duration-500"
            >
              {isLoading ? "Đang cập nhật..." : "Cập nhật"}
            </Button>
          </div>
        </div>
      </form>
    </>
  );
};

export default EditSpecialty;