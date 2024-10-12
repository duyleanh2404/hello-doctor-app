"use client";

import { cn } from "@/lib/utils";
import { FiUpload } from "react-icons/fi";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { updateSpecialty, getSpecialtyById } from "@/services/specialty-service";

import Cookies from "js-cookie";
import toast from "react-hot-toast";
import JoditEditor from "jodit-react";

interface SpecialtyData {
  _id?: string;
  name: string;
  desc: string;
  image: FileList | null;
};

const EditSpecialty = () => {
  const router = useRouter();
  const { specialtyId } = useParams<{ specialtyId: string }>(); // Get specialty ID from URL parameters

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
    formState: { errors },
  } = useForm<SpecialtyData>();

  useEffect(() => {
    // Function to fetch specialty data from the server
    const fetchSpecialtyData = async () => {
      try {
        setIsLoading(true);

        const accessToken = Cookies.get("access_token");
        if (!accessToken) return;

        // Fetch the specialty data using the provided ID and token
        const { specialty } = await getSpecialtyById({ accessToken, id: specialtyId });

        // Populate form fields if specialty data is received
        if (specialty) {
          setImageURL(specialty.image || null);
          setContentValue(specialty.desc || "");
          setValue("name", specialty.name || "");
          setValue("desc", specialty.desc || "");
          setImageName(specialty.imageName || "");
        }
      } catch (err) {
        toast.error("Có lỗi xảy ra. Vui lòng thử lại sau ít phút nữa!");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSpecialtyData();
  }, [specialtyId, setValue]);

  // Handle changes in the Jodit editor
  const handleEditorChange = (newContent: string) => {
    setContentValue(newContent); // Update content state
    setValue("desc", newContent); // Update form value
    clearErrors("desc"); // Clear any validation errors for description
  };

  // Handle image file input change
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Get the selected file
    if (file) {
      setImageName(file.name); // Set the image name
      setImageURL(URL.createObjectURL(file)); // Create a URL for preview
      clearErrors("image"); // Clear any validation errors for image
    }
  };

  // Handle form submission
  const onSubmit: SubmitHandler<SpecialtyData> = async (specialtyData) => {
    setIsLoading(true);
    const accessToken = Cookies.get("access_token");
    if (!accessToken) return;

    const file = specialtyData.image?.[0]; // Get the image file from the form

    // Call the update function to update specialty
    const { statusCode } = await updateSpecialty({
      accessToken,
      id: specialtyId,
      name: specialtyData.name,
      imageName,
      image: file,
      desc: contentValue,
    });

    // Handle conflict error
    if (statusCode === 409) {
      setError("name", {
        type: "manual",
        message: "Chuyên khoa này đã tồn tại!", // Error message for existing specialty
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
      setIsLoading(false);
      return;
    }

    // Navigate to the specialties list page and show success notification
    router.push("/admin/specialties");
    toast.success(`Cập nhật chuyên khoa ${specialtyData.name} thành công!`);
    setIsLoading(false);
  };

  return (
    <>
      <h1 className="text-xl font-bold mb-4">Chỉnh sửa chuyên khoa</h1> {/* Page title */}

      <form onSubmit={handleSubmit(onSubmit)}> {/* Form submission handler */}
        <div className="flex flex-col gap-8 pb-6">
          <div className="flex flex-col gap-8 -mx-4 px-4">
            {/* Specialty Name Input */}
            <div className="flex flex-col gap-2">
              {/* Label */}
              <label className="text-[17px] font-semibold">Tên chuyên khoa</label>
              <input
                type="text"
                spellCheck={false}
                placeholder="Nhập tên chuyên khoa"
                {...register("name", {
                  required: "Vui lòng nhập tên chuyên khoa!"// Register input with validation
                })}
                className={cn(
                  "border rounded-md p-[14px] transition duration-500",
                  errors.name ? "border-red-500" : "focus:border-primary focus:shadow-input-primary"
                )}
              />

              {/* Display error message if validation fails */}
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Specialty Image Input */}
            <div className="flex flex-col gap-2">
              {/* Label */}
              <label className="text-[17px] font-semibold">Ảnh đại diện</label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  {...register("image")}
                  onChange={handleImageChange} // Handle file input change
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <button
                  type="button"
                  className={cn(
                    "flex items-center gap-3 w-full p-[14px] border rounded-md transition duration-500",
                    errors.image ? "border-red-500" : "focus:border-primary focus:shadow-input-primary"
                  )}
                >
                  <FiUpload size="18" className="text-[#b2b2b2]" /> {/* Upload icon */}
                  <p>{imageName || "Tải ảnh lên"}</p> {/* Display selected image name or placeholder */}
                </button>
              </div>

              {/* Display error message if validation fails */}
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

            {/* Specialty Description Input */}
            <div className="flex flex-col gap-2">
              {/* Label */}
              <label className="text-[17px] font-semibold">Mô tả chuyên khoa</label>
              <JoditEditor
                value={contentValue} // Set editor value
                onChange={handleEditorChange} // Handle editor content change
                className={cn("!rounded-md", errors.desc && "!border-red-500")}
              />

              {/* Display error message if validation fails */}
              {errors.desc && (
                <p className="text-sm text-red-500">{errors.desc.message}</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/specialties")} // Navigate back to specialties list
              className="min-w-[130px] shadow-md transition duration-500"
            >
              Hủy
            </Button>

            <Button
              type="submit"
              disabled={isLoading} // Disable button while loading
              className="min-w-[130px] shadow-md transition duration-500"
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