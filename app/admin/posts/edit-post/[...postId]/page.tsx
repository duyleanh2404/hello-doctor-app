"use client";

import { useEffect, useState } from "react";
import { FiUpload } from "react-icons/fi";
import { useParams, useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import Image from "next/image";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import JoditEditor from "jodit-react";

import { cn } from "@/lib/utils";
import { getAllSpecialties } from "@/services/specialty-service";

import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getAllDoctors } from "@/services/doctor-service";
import { DoctorData } from "@/types/doctor-types";
import { SpecialtyData } from "@/types/specialty-types";
import { getPostById, updatePost } from "@/services/post-service";
import { DatePicker } from "@/components/ui/date-picker";
import { format, parse } from "date-fns";
import { PostData } from "@/types/post-types";

const EditPost = () => {
  const router = useRouter();
  const { postId } = useParams<{ postId: string }>();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dateError, setDateError] = useState<string>("");
  const [contentValue, setContentValue] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  const [imageName, setImageName] = useState<string>("");
  const [imageURL, setImageURL] = useState<string | null>(null);

  const [doctorName, setDoctorName] = useState<string>("");
  const [specialtyName, setspecialtyName] = useState<string>("");

  const [doctors, setDoctors] = useState<DoctorData[]>([]);
  const [specialties, setSpecialties] = useState<SpecialtyData[]>([]);

  const {
    watch,
    register,
    setValue,
    setError,
    clearErrors,
    handleSubmit,
    formState: { errors }
  } = useForm<PostData>();

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
    const fetchDoctors = async () => {
      try {
        const accessToken = Cookies.get("access_token");
        if (!accessToken) return;

        const { doctors } = await getAllDoctors({ accessToken });
        setDoctors(doctors);
      } catch (err: any) {
        router.push("/");
        toast.error("Có lỗi xảy ra. Vui lòng thử lại sau ít phút nữa!");
      }
    };
    fetchDoctors();
  }, []);

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        setIsLoading(true);
        const accessToken = Cookies.get("access_token");
        if (!accessToken) return;

        const { post } = await getPostById({ accessToken, id: postId });

        if (post) {
          setValue("title", post.title);
          setValue("doctor", post.doctor_id._id);
          setValue("specialty", post.specialty_id._id);

          setDoctorName(post.doctor_id.fullname);
          setspecialtyName(post.specialty_id.name);
          setImageURL(post.image);
          setContentValue(post.desc);
          setImageName(post.imageName);
          setSelectedDate(parse(post.release_date, "dd/MM/yyyy", new Date()));
        }
      } catch (err: any) {
        toast.error("Có lỗi xảy ra. Vui lòng thử lại sau ít phút nữa!");
        router.push("/");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPostData();
  }, [postId, setValue]);

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
    if (!selectedDate) {
      setDateError("Vui lòng chọn ngày đăng!");
    }

    if (contentValue.trim() !== "") return;
    setError("desc", {
      type: "manual",
      message: "Vui lòng nhập mô tả của bài viết!"
    });
  };

  const hanleEditPost: SubmitHandler<PostData> = async (postData) => {
    try {
      setIsLoading(true);
      const accessToken = Cookies.get("access_token");
      if (!accessToken) return;

      const file = postData.image?.[0];

      await updatePost({
        id: postId[0],
        imageName,
        image: file,
        accessToken,
        desc: contentValue,
        title: postData.title,
        doctor_id: postData.doctor,
        specialty_id: postData.specialty,
        release_date: selectedDate && format(selectedDate, "dd/MM/yyyy")
      });

      setIsLoading(false);
      toast.success("Cập nhật chuyên khoa thành công!");
    } catch (err: any) {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại sau ít phút nữa!");
    } finally {
      router.push("/admin/posts");
    }
  };

  return (
    <>
      <h1 className="text-xl font-bold mb-4">Thêm bài viết mới</h1>
      <form onSubmit={handleSubmit(hanleEditPost)}>
        <div className="flex flex-col gap-8 pb-6">
          <div className="flex flex-col gap-8 -mx-4 px-4">
            <div className="flex flex-col gap-2">
              <label className="text-[17px] font-semibold">Tiêu đề bài viết</label>
              <Input
                type="text"
                spellCheck={false}
                placeholder="Nhập tiêu đề bài viết"
                {...register("title", { required: "Vui lòng nhập tiêu đề bài viết!" })}
                className={cn(
                  "border border-gray-300 rounded-md p-[14px] transition duration-500",
                  errors.title ? "border-red-500" : "focus:border-primary focus:shadow-input-primary"
                )}
              />

              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title.message}</p>
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
              <label className="text-[17px] font-semibold">Bác sĩ</label>
              <Select
                {...register("doctor", { required: "Vui lòng chọn bác sĩ!" })}
                onValueChange={(value) => {
                  clearErrors("doctor");
                  setValue("doctor", value);
                }}
              >
                <SelectTrigger className={cn("w-full", errors.doctor && "border-red-500")}>
                  <SelectValue placeholder={`${doctorName}` || "Chọn bác sĩ"} />
                </SelectTrigger>
                <SelectContent>
                  {doctors?.map((doctor) => (
                    <SelectItem key={doctor?._id} value={doctor?._id}>
                      {doctor?.fullname}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {errors.doctor && (
                <p className="text-red-500 text-sm">{errors.doctor.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[17px] font-semibold">Chọn ngày đăng</label>
              <DatePicker
                dateError={dateError}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                className="h-14"
              />

              {dateError && (
                <p className="text-red-500 text-sm">{dateError}</p>
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
              {isLoading ? "Đang cập nhật..." : "Cập nhật"}
            </Button>
          </div>
        </div>
      </form>
    </>
  );
};

export default EditPost;