"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { FiUpload } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useForm, SubmitHandler } from "react-hook-form";
import { createNewSpecialty } from "@/services/specialty-service";

import Cookies from "js-cookie";
import toast from "react-hot-toast";
import JoditEditor from "jodit-react";

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

  // Function to handle changes in the JoditEditor
  const handleEditorChange = (newContent: string) => {
    setContentValue(newContent); // Update the content value state
    setValue("desc", newContent); // Set the value of the description field in the form
    clearErrors("desc"); // Clear any existing error messages for the description field
  };

  // Function to handle image file selection
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Get the selected file
    if (file) {
      setImageName(file.name); // Update the image name state
      setImageURL(URL.createObjectURL(file)); // Create a URL for the image preview
      clearErrors("image"); // Clear any existing error messages for the image field
    }
  };

  // Function to validate the editor content before form submission
  const handleValidateEditor = () => {
    if (contentValue.trim() === "") { // Check if the content is empty
      setError("desc", { // Set an error message for the description field
        type: "manual",
        message: "Vui lòng nhập mô tả của chuyên khoa!"
      });
    }
  };

  // Function to handle form submission
  const onSubmit: SubmitHandler<SpecialtyData> = async (specialtyData) => {
    setIsLoading(true);
    const accessToken = Cookies.get("access_token");
    if (!accessToken) return;

    const file = specialtyData.image?.[0]; // Get the first file from the image field

    // Create a new specialty by calling the API service
    const { statusCode } = await createNewSpecialty({
      accessToken,
      name: specialtyData.name,
      imageName,
      image: file,
      desc: contentValue
    });

    // Handle duplicate specialty case
    if (statusCode === 409) {
      setError("name", { // Set an error message for the name field
        type: "manual",
        message: "Chuyên khoa này đã được tạo!"
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
      setIsLoading(false);
      return;
    }

    // Redirect to specialties list after successful creation
    setIsLoading(false);
    router.push("/admin/specialties");
    toast.success(`Thêm chuyên khoa ${specialtyData.name.toLowerCase()} thành công!`);
  };

  return (
    <>
      {/* Page heading */}
      <h1 className="text-xl font-bold mb-4">Thêm chuyên khoa mới</h1>

      {/* Form for creating a new specialty */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-8 pb-6">
          <div className="flex flex-col gap-8 -mx-4 px-4">
            {/* Specialty Name */}
            <div className="flex flex-col gap-2">
              <label className="text-[17px] font-semibold">Tên chuyên khoa</label>
              <input
                type="text"
                spellCheck={false}
                placeholder="Nhập tên chuyên khoa"
                {...register("name", {
                  required: "Vui lòng nhập tên chuyên khoa!" // Register input with validation
                })}
                className={cn(
                  "border rounded-md p-[14px] transition duration-500",
                  errors.name ? "border-red-500" : "focus:border-primary focus:shadow-input-primary"
                )}
              />

              {/* Display error message if validation fails */}
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            {/* Image Upload */}
            <div className="flex flex-col gap-2">
              <label className="text-[17px] font-semibold">Ảnh đại diện</label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  {...register("image", {
                    required: "Vui lòng tải tải ảnh đại diện của chuyên khoa!" // Register input with validation
                  })}
                  onChange={handleImageChange} // Handle image change
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
                  <p>{imageName || "Tải ảnh lên"}</p> {/* Display image name or placeholder text */}
                </button>
              </div>

              {/* Display error message if validation fails */}
              {errors.image && (
                <p className="text-red-500 text-sm">{errors.image.message}</p>
              )}

              {/* Image Preview */}
              {imageURL && (
                <div className="mx-auto mt-6">
                  <img
                    src={imageURL} // Preview image source
                    alt="Preview"
                    className="w-[300px] h-[300px] object-cover rounded-md border"
                  />
                </div>
              )}
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2">
              <label className="text-[17px] font-semibold">Mô tả chuyên khoa</label>
              <JoditEditor
                value={contentValue} // Set editor value
                onChange={handleEditorChange} // Handle editor changes
                className={cn("!rounded-md", errors.desc && "!border-red-500")}
              />

              {/* Display error message if validation fails */}
              {errors.desc && (
                <p className="text-red-500 text-sm">{errors.desc.message}</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              className="min-w-[130px] shadow-md transition duration-500"
            >
              Hủy
            </Button>

            <Button
              type="submit"
              variant="default"
              disabled={isLoading} // Disable button while loading
              onClick={handleValidateEditor}
              className="min-w-[130px] shadow-md transition duration-500"
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