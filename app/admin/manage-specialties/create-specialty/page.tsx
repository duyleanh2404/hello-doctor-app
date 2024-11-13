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

import { CreateSpecialtyForm } from "@/types/specialty-types";
import { createSpecialty } from "@/services/specialty-service";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const CreateSpecialty = () => {
  const router = useRouter();

  const [content, setContent] = useState<string>("");
  const [isLoading, setLoading] = useState<boolean>(false);

  const [imageName, setImageName] = useState<string>("");
  const [imageURL, setImageURL] = useState<string | null>(null);

  const {
    register,
    setValue,
    setError,
    clearErrors,
    handleSubmit,
    formState: { errors }
  } = useForm<CreateSpecialtyForm>();

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

  const handleValidateEditor = () => {
    if (content.trim() !== "") return;
    setError("desc", {
      type: "manual",
      message: "Vui lòng nhập mô tả của chuyên khoa!"
    });
  };

  const handleCreateSpecialty: SubmitHandler<CreateSpecialtyForm> = async (data) => {
    const accessToken = Cookies.get("access_token");
    if (!accessToken) return;

    setLoading(true);

    try {
      await createSpecialty(
        accessToken,
        {
          name: data.name,
          desc: content,
          imageName,
          image: data.image?.[0]
        }
      );

      router.replace("/admin/manage-specialties");
      toast.success("Thêm chuyên khoa thành công!");
    } catch (error: any) {
      setLoading(false);

      switch (error) {
        case 409:
          setError("name", {
            type: "manual",
            message: "Chuyên khoa này đã tồn tại!",
          });
          window.scrollTo({ top: 0, behavior: "smooth" });
          break;

        default:
          toast.error("Thêm chuyên khoa thất bại. Vui lòng thử lại sau ít phút nữa!");
          router.replace("/admin/manage-specialties");
          break;
      }
    }
  };

  return (
    <>
      <h1 className="text-xl font-bold mb-4">Thêm chuyên khoa mới</h1>

      <form onSubmit={handleSubmit(handleCreateSpecialty)}>
        <div className="flex flex-col gap-8 pb-6">
          <div className="flex flex-col gap-8 -mx-4 px-4">
            <div className="flex flex-col gap-2">
              <label className="text-[17px] font-semibold">Tên chuyên khoa</label>
              <Input
                type="text"
                spellCheck={false}
                placeholder="Nhập tên chuyên khoa"
                {...register("name", { required: "Vui lòng nhập tên chuyên khoa!" })}
                className={cn(errors.name ? "border-red-500" : "border-gray-300")}
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
                  {...register("image", { required: "Vui lòng tải ảnh đại diện của chuyên khoa!" })}
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
                    width={220}
                    height={220}
                    className="p-6 object-cover rounded-full"
                  />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[17px] font-semibold">Mô tả chuyên khoa</label>
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
              onClick={() => router.replace("/admin/manage-specialties")}
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
      </form>
    </>
  );
};

export default CreateSpecialty;