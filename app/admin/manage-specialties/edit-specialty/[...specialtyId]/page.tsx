"use client";

import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import dynamic from "next/dynamic";

import { FiUpload } from "react-icons/fi";
import { useForm, SubmitHandler } from "react-hook-form";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

import { EditSpecialtyForm } from "@/types/specialty-types";
import { editSpecialty, getSpecialtyById } from "@/services/specialty-service";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/spinner";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const EditSpecialty = () => {
  const router = useRouter();
  const { specialtyId } = useParams<{ specialtyId: string }>();

  const [content, setContent] = useState<string>("");
  const [isLoading, setLoading] = useState({ specialty: false, editing: false });

  const [imageName, setImageName] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const {
    register, setValue, setError, clearErrors, handleSubmit, formState: { errors }
  } = useForm<EditSpecialtyForm>();

  useEffect(() => {
    const fetchSpecialtyData = async () => {
      setLoading({ ...isLoading, specialty: true });

      try {
        const { specialty } = await getSpecialtyById(atob(specialtyId[0]));
        setValue("name", specialty.name);
        setValue("desc", specialty.desc);
        setImageUrl(specialty.image);
        setContent(specialty.desc);
        setImageName(specialty.imageName);
      } catch (error: any) {
        console.error(error);
        toast.error("Có lỗi xảy ra. Vui lòng thử lại sau ít phút nữa!");
      } finally {
        setLoading({ ...isLoading, specialty: false });
      }
    };

    fetchSpecialtyData();
  }, []);

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

  const handleValidateEditor = () => {
    if (content.trim() === "") {
      setError("desc", { type: "manual", message: "Vui lòng nhập mô tả của chuyên khoa!" });
    }
  };

  const handleEditSpecialty: SubmitHandler<EditSpecialtyForm> = async (specialtyData) => {
    const accessToken = Cookies.get("access_token");
    if (!accessToken) return;
    setLoading({ ...isLoading, editing: true });

    try {
      await editSpecialty(
        accessToken,
        {
          id: atob(specialtyId[0]),
          name: specialtyData.name,
          desc: content,
          imageName,
          image: specialtyData.image?.[0]
        });

      router.replace("/admin/manage-specialties");
      toast.success("Cập nhật thông tin thành công!");
    } catch (status: any) {
      handleError(status);
    }
  };

  const handleError = (status: number) => {
    setLoading({ ...isLoading, editing: false });

    if (status === 409) {
      setError("name", {
        type: "manual", message: "Chuyên khoa này đã tồn tại!"
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      toast.error("Cập nhật chuyên khoa thất bại. Vui lòng thử lại sau ít phút nữa!");
      router.replace("/admin/manage-specialties");
    }
  };

  if (isLoading.specialty) {
    return <Spinner center />;
  }

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
                {...register("name", { required: "Vui lòng nhập tên chuyên khoa!" })}
                className={cn(errors.name ? "border-red-500" : "border-gray-300")}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
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

              {errors.image && <p className="text-sm text-red-500">{errors.image.message}</p>}

              {imageUrl && (
                <div className="mx-auto mt-6">
                  <Image
                    src={imageUrl}
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
              {errors.desc && <p className="text-sm text-red-500">{errors.desc.message}</p>}
            </div>
          </div>

          <div className="flex items-center justify-end gap-4">
            <Button type="button" size="lg" variant="cancel" onClick={() => router.replace("/admin/manage-specialties")}>
              Hủy
            </Button>
            <Button type="submit" size="lg" variant="submit" disabled={isLoading.editing} onClick={handleValidateEditor}>
              {isLoading.editing ? "Đang cập nhật..." : "Cập nhật"}
            </Button>
          </div>
        </div>
      </form>
    </>
  );
};

export default EditSpecialty;