"use client";

import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import dynamic from "next/dynamic";

import { format, parse } from "date-fns";
import { FiUpload } from "react-icons/fi";
import { useForm, SubmitHandler } from "react-hook-form";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

import { EditPostForm } from "@/types/post-types";
import { getPostById, updatePost } from "@/services/post-service";
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
import { DatePicker } from "@/components/ui/date-picker";
import Spinner from "@/components/spinner";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const EditPost = () => {
  const router = useRouter();

  const { postId } = useParams<{ postId: string }>();
  const { specialties, isLoading: isLoadingSpecialties } = useSpecialties("desc");

  const [content, setContent] = useState<string>("");
  const [isLoading, setLoading] = useState<boolean>(false);

  const [dateError, setDateError] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  const [imageName, setImageName] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const {
    watch, register, setValue, setError, clearErrors, handleSubmit, formState: { errors }
  } = useForm<EditPostForm>();

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const { post } = await getPostById(atob(postId[0]));
        setValue("title", post.title);
        setValue("doctor_id", post.doctor_id._id);
        setValue("specialty_id", post.specialty_id._id);
        setContent(post.desc);
        setImageUrl(post.image);
        setImageName(post.imageName);
        setSelectedDate(parse(post.releaseDate, "dd/MM/yyyy", new Date()));
      } catch (error: any) {
        console.error(error);
        toast.error("Có lỗi xảy ra. Vui lòng thử lại sau ít phút nữa!");
      }
    };

    fetchPostData();
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

  const handleValidate = () => {
    if (!selectedDate) {
      setDateError("Vui lòng chọn ngày đăng!");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    if (content.trim() === "") {
      setError("desc", { type: "manual", message: "Vui lòng nhập mô tả của bài viết!" });
    };
  };

  const handleEditPost: SubmitHandler<EditPostForm> = async (postData) => {
    const accessToken = Cookies.get("access_token");
    if (!accessToken) return;
    setLoading(true);

    try {
      await updatePost(
        accessToken,
        {
          id: postId[0],
          doctor_id: postData.doctor_id,
          specialty_id: postData.specialty_id,
          title: postData.title,
          releaseDate: selectedDate && format(selectedDate, "dd/MM/yyyy"),
          desc: content,
          imageName,
          image: postData.image?.[0],
        });

      toast.success("Cập nhật bài viết thành công!");
    } catch (error: any) {
      console.error(error);
      toast.error("Cập nhật bài viết thất bại. Vui lòng thử lại sau ít phút nữa!");
    } finally {
      router.replace("/system/manage-posts");
    }
  };

  if (!watch("specialty_id") || !watch("doctor_id")) {
    return <Spinner center />;
  }

  return (
    <>
      <h1 className="text-xl font-bold mb-4">Thêm bài viết mới</h1>
      <form onSubmit={handleSubmit(handleEditPost)}>
        <div className="flex flex-col gap-8 pb-6">
          <div className="flex flex-col gap-8 -mx-4 px-4">
            <div className="flex flex-col gap-2">
              <label className="text-[17px] font-semibold">Tiêu đề bài viết</label>
              <Input
                type="text"
                spellCheck={false}
                placeholder="Nhập tiêu đề bài viết"
                {...register("title", { required: "Vui lòng nhập tiêu đề bài viết!" })}
                className={cn(errors.title ? "border-red-500" : "border-gray-300")}
              />
              {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[17px] font-semibold">Chuyên khoa</label>
              <Select
                value={watch("specialty_id")}
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
              <label className="text-[17px] font-semibold">Chọn ngày đăng</label>
              <DatePicker
                className="h-14"
                dateError={dateError}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
              />
              {dateError && <p className="text-red-500 text-sm">{dateError}</p>}
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

              {errors.image && <p className="text-red-500 text-sm">{errors.image.message}</p>}

              {imageUrl && (
                <div className="mx-auto mt-6">
                  <Image src={imageUrl} alt="Preview" width={700} height={700} className="object-cover rounded-md" />
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
              {errors.desc && <p className="text-red-500 text-sm">{errors.desc.message}</p>}
            </div>
          </div>

          <div className="flex items-center justify-end gap-4">
            <Button type="button" size="lg" variant="cancel" onClick={() => router.replace("/system/manage-posts")}>
              Hủy
            </Button>
            <Button type="submit" size="lg" variant="submit" disabled={isLoading} onClick={handleValidate}>
              {isLoading ? "Đang cập nhật..." : "Cập nhật"}
            </Button>
          </div>
        </div>
      </form>
    </>
  );
};

export default EditPost;