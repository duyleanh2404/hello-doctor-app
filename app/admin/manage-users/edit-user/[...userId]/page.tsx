"use client";

import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

import { FiUpload } from "react-icons/fi";
import { useForm, SubmitHandler } from "react-hook-form";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

import { EditUserForm } from "@/types/user-types";
import { District, Province } from "@/types/auth-types";
import { getUserById, editUser } from "@/services/user-serivce";

import useProvinces from "@/hooks/fetch/use-provinces";
import useDistricts from "@/hooks/fetch/use-districts";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/spinner";
import SelectAddress from "@/components/select-address";
import SelectDateOfBirth from "@/components/select-date-of-birth";

const EditUser = () => {
  const router = useRouter();
  const { userId } = useParams<{ userId: string }>();

  const [isGoogleAccount, setIsGoogleAccount] = useState<boolean>(false);
  const [isLoading, setLoading] = useState({ user: false, editing: false });

  const [imageName, setImageName] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const [provinceName, setProvinceName] = useState<string>("");
  const [districtName, setDistrictName] = useState<string>("");

  const [selectedProvince, setSelectedProvince] = useState<any | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<any | null>(null);

  const provinces: Province[] = useProvinces();
  const districts: District[] = useDistricts(selectedProvince);

  const { watch, register, setValue, clearErrors, handleSubmit, formState: { errors } } = useForm<EditUserForm>();

  useEffect(() => {
    if (!provinceName) return;
    const province = provinces.find((province: any) => province.name === provinceName.trim());
    setSelectedProvince(province);
  }, [provinceName]);

  useEffect(() => {
    if (!districts || !districtName) return;
    const district = districts.find((district: any) => district.name === districtName.trim());
    setSelectedDistrict(district);
  }, [districts, districtName]);

  useEffect(() => {
    const fetchUserData = async () => {
      const accessToken = Cookies.get("access_token");
      if (!accessToken || !userId) return;
      setLoading({ ...isLoading, user: true });

      try {
        const { user } = await getUserById(accessToken, atob(userId[0]));

        if (user.dateOfBirth && user.address) {
          const [day, month, year] = user.dateOfBirth.split("/").map((part: any) => part.trim());
          const [street, ward, district, province] = user.address.split(",").map((part: any) => part.trim());

          const userData = {
            fullname: user.fullname,
            day, month, year,
            ward, street, district, province,
            gender: user.gender,
            dateOfBirth: user.dateOfBirth,
            phoneNumber: user.phoneNumber
          };

          Object.entries(userData).forEach(([key, value]: any) => setValue(key, value));

          setImageUrl(user.image);
          setImageName(user.imageName);
          setProvinceName(province);
          setDistrictName(district);
        } else {
          setIsGoogleAccount(true);
          setValue("fullname", user.fullname);
        }
      } catch (error: any) {
        console.error(error);
        toast.error("Có lỗi xảy ra. Vui lòng thử lại sau ít phút nữa!");
      } finally {
        setLoading({ ...isLoading, user: false });
      }
    };

    fetchUserData();
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

  const handleEditUser: SubmitHandler<EditUserForm> = async (data) => {
    const accessToken = Cookies.get("access_token");
    if (!accessToken) return;
    setLoading({ ...isLoading, editing: true });

    try {
      await editUser(
        accessToken,
        {
          id: atob(userId[0]),
          fullname: data.fullname,
          gender: data.gender,
          phoneNumber: data.phoneNumber,
          dateOfBirth: `${data.day}/${data.month}/${data.year}`,
          address: `${data.street}, ${data.ward}, ${data.district}, ${data.province}`,
          imageName,
          image: data.image?.[0]
        }
      );

      toast.success("Cập nhật thông tin thành công!");
    } catch (error: any) {
      console.error(error);
      toast.error("Cập nhật thông tin thất bại. Vui lòng thử lại sau ít phút nữa!");
    } finally {
      router.replace("/admin/manage-users");
    }
  };

  if (!isGoogleAccount && isLoading.user) {
    return <Spinner center />;
  }

  return (
    <>
      <h1 className="text-xl font-bold mb-4">Chỉnh sửa thông tin bệnh nhân</h1>
      <form onSubmit={handleSubmit(handleEditUser)}>
        <div className="flex flex-col gap-8 pb-6">
          <div className="flex flex-col gap-8 -mx-4 px-4">
            <div className="flex flex-col gap-2">
              <label className="text-[17px] font-semibold">Tên bệnh nhân</label>
              <Input
                type="text"
                spellCheck={false}
                placeholder="Nhập tên bệnh nhân"
                {...register("fullname", { required: "Vui lòng nhập tên bệnh nhân!" })}
                className={cn(errors.fullname ? "border-red-500" : "border-gray-300")}
              />
              {errors.fullname && <p className="text-red-500 text-sm">{errors.fullname.message}</p>}
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
              <label className="text-[17px] font-semibold">Số điện thoại</label>
              <Input
                type="text"
                spellCheck={false}
                placeholder="Nhập số điện thoại"
                {...register("phoneNumber", { required: "Vui lòng nhập số điện thoại!" })}
                className={cn(errors.phoneNumber ? "border-red-500" : "border-gray-300")}
              />
              {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[17px] font-semibold">Ngày sinh</label>
              <SelectDateOfBirth
                watch={watch}
                errors={errors}
                register={register}
                setValue={setValue}
                clearErrors={clearErrors}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[17px] font-semibold">Giới tính</label>
              <div className="flex gap-8">
                <label className="flex items-center gap-2">
                  <Input
                    type="radio"
                    value="male"
                    className="w-4 h-4"
                    {...register("gender", { required: "Vui lòng chọn giới tính!" })}
                  />
                  Nam
                </label>

                <label className="flex items-center gap-2">
                  <Input
                    type="radio"
                    value="female"
                    className="w-4 h-4"
                    {...register("gender", { required: "Vui lòng chọn giới tính!" })}
                  />
                  Nữ
                </label>
              </div>
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

              {imageUrl ? (
                <div className="mx-auto mt-6">
                  <Image
                    src={imageUrl}
                    alt="Preview"
                    width={300}
                    height={300}
                    className="object-cover rounded-full"
                  />
                </div>
              ) : (
                <p>Chưa có ảnh đại diện</p>
              )}
            </div>

            <div className="flex items-center justify-end gap-4">
              <Button type="button" size="lg" variant="cancel" onClick={() => router.replace("/admin/manage-users")}>
                Hủy
              </Button>
              <Button type="submit" size="lg" variant="submit" disabled={isLoading.editing}>
                {isLoading.editing ? "Đang cập nhật..." : "Cập nhật"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default EditUser;