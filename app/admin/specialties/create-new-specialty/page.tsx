"use client";

import { useState } from "react";
import { FiUpload } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import Image from "next/image";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import JoditEditor from "jodit-react";

import { cn } from "@/lib/utils";
import { createNewSpecialty } from "@/services/specialty-service";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SpecialtyData {
  _id?: string;
  name: string;
  desc: string;
  image: FileList | null;
};

const CreateNewSpecialty = () => {
  const router = useRouter();

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
      message: "Vui lòng nhập mô tả của bệnh viện!"
    });
  };

  const handleCreateNewSpecialty: SubmitHandler<SpecialtyData> = async (specialtyData) => {
    setIsLoading(true);
    const accessToken = Cookies.get("access_token");
    if (!accessToken) return;

    const file = specialtyData.image?.[0];

    const { errorCode } = await createNewSpecialty({
      imageName,
      image: file,
      accessToken,
      desc: contentValue,
      name: specialtyData.name
    });

    if (errorCode === "SPECIALTY_ALREADY_EXISTS") {
      setIsLoading(false);
      setError("name", {
        type: "manual",
        message: "Chuyên khoa này đã được tạo!"
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setIsLoading(false);
    router.push("/admin/specialties");
    toast.success("Thêm chuyên khoa thành công!");
  };

  return (
    <>
      <h1 className="text-xl font-bold mb-4">Thêm chuyên khoa mới</h1>
      <form onSubmit={handleSubmit(handleCreateNewSpecialty)}>
        <div className="flex flex-col gap-8 pb-6">
          <div className="flex flex-col gap-8 -mx-4 px-4">
            <div className="flex flex-col gap-2">
              <label className="text-[17px] font-semibold">Tên chuyên khoa</label>
              <Input
                type="text"
                spellCheck={false}
                placeholder="Nhập tên chuyên khoa"
                {...register("name", { required: "Vui lòng nhập tên chuyên khoa!" })}
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
              <label className="text-[17px] font-semibold">Ảnh đại diện</label>
              <div className="relative">
                <Input
                  type="file"
                  accept="image/*"
                  {...register("image", {
                    required: "Vui lòng tải tải ảnh đại diện của chuyên khoa!"
                  })}
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
              <label className="text-[17px] font-semibold">Mô tả chuyên khoa</label>
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
              onClick={() => router.push("/admin/specialties")}
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

export default CreateNewSpecialty;