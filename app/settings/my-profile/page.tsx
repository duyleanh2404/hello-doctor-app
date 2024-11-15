"use client";

import { cn } from "@/lib/utils";
import { useState, useEffect, memo } from "react";
import Image from "next/image";

import { FaBars } from "react-icons/fa6";
import { MdModeEdit } from "react-icons/md";

import { useDispatch, useSelector } from "react-redux";
import { useForm, SubmitHandler } from "react-hook-form";
import Cookies from "js-cookie";
import NProgress from "nprogress";
import toast from "react-hot-toast";
import "nprogress/nprogress.css";

import { RootState } from "@/store/store";
import { setUserData } from "@/store/slices/auth-slice";
import { setIsInfoChanged, setOpenMenuMobile } from "@/store/slices/settings-slice";

import { EditUserForm } from "@/types/user-types";
import { editUser } from "@/services/user-serivce";
import { District, Province } from "@/types/auth-types";
import { convertImageToBase64 } from "@/utils/convert-to-base64";

import useProvinces from "@/hooks/fetch/use-provinces";
import useDistricts from "@/hooks/fetch/use-districts";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SelectAddress from "@/components/select-address";
import SelectDateOfBirth from "@/components/select-date-of-birth";

const MyProfile = memo(() => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state: RootState) => state.auth);
  const { openMenuMobile } = useSelector((state: RootState) => state.settings);

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isModeEdit, setIsModeEdit] = useState<boolean>(false);

  const [provinceName, setProvinceName] = useState<string>("");
  const [districtName, setDistrictName] = useState<string>("");

  const [selectedProvince, setSelectedProvince] = useState<any | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<any | null>(null);

  const provinces: Province[] = useProvinces();
  const districts: District[] = useDistricts(selectedProvince);

  const { watch, register, setValue, clearErrors, handleSubmit, formState: { errors } } = useForm<EditUserForm>();

  useEffect(() => {
    NProgress.done();
  }, []);

  useEffect(() => {
    if (!isModeEdit) {
      Object.keys(errors).forEach((errorKey) => clearErrors(errorKey as keyof EditUserForm));
    }
  }, [isModeEdit]);

  useEffect(() => {
    if (!provinceName) return;
    const province = provinces.find((p) => p.name === provinceName.trim());
    setSelectedProvince(province);
  }, [provinceName, provinces]);

  useEffect(() => {
    if (!districts || !districtName) return;
    const district = districts.find((d) => d.name === districtName.trim());
    setSelectedDistrict(district);
  }, [districts, districtName]);

  useEffect(() => {
    if (userData && userData.address && userData.dateOfBirth) {
      const [day, month, year] = userData.dateOfBirth.split("/").map((part: any) => part.trim());
      const [street, ward, district, province] = userData.address.split(",").map((part: any) => part.trim());

      Object.entries({
        day, month, year, ward, street, district, province, gender: userData.gender
      }).forEach(([key, value]: any) => setValue(key, value));

      setProvinceName(province);
      setDistrictName(district);
    }
  }, [userData, setValue]);

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const accessToken = Cookies.get("access_token");
    if (!accessToken || !userData) return;

    const file = event.target.files?.[0];
    if (!file) return;

    NProgress.start();

    try {
      await editUser(accessToken, { image: file, id: userData._id });
      toast.success("Cập nhật ảnh đại diện thành công!");
      dispatch(setIsInfoChanged(true));

      const imageBase64 = await convertImageToBase64(file);
      dispatch(setUserData({ image: imageBase64 }));
    } catch (error: any) {
      console.error(error);
      toast.error("Cập nhật ảnh đại diện thất bại. Vui lòng thử lại sau ít phút nữa!");
    } finally {
      NProgress.done();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleEditUser: SubmitHandler<EditUserForm> = async (_userData) => {
    const accessToken = Cookies.get("access_token");
    if (!accessToken || !userData) return;
    NProgress.start();
    setIsEditing(true);

    try {
      await editUser(
        accessToken,
        {
          id: userData._id,
          fullname: _userData.fullname,
          gender: _userData.gender,
          province: _userData.province,
          phoneNumber: _userData.phoneNumber,
          dateOfBirth: `${_userData.day}/${_userData.month}/${_userData.year}`,
          address: `${_userData.street}, ${_userData.ward}, ${_userData.district}, ${_userData.province}`
        }
      );

      toast.success("Cập nhật thông tin thành công!");
      dispatch(setIsInfoChanged(true));
      dispatch(setUserData({ ...userData, fullname: _userData.fullname }));
    } catch (error: any) {
      console.error(error);
      toast.error("Cập nhật thông tin thất bại. Vui lòng thử lại sau ít phút nữa!");
    } finally {
      NProgress.done();
      setIsEditing(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <form onSubmit={handleSubmit(handleEditUser)}>
      <div className="flex flex-col items-center gap-12">
        <div className="w-full flex items-center justify-between">
          <h1 className="text-2xl font-bold">Hồ sơ của tôi</h1>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="ghost"
              className="flex items-center gap-3 hover:bg-[#e3f2ff] transition duration-500"
              onClick={() => setIsModeEdit(!isModeEdit)}
            >
              <p className="hidden sm:block font-semibold text-primary">Chỉnh sửa</p>
              <MdModeEdit className="size-5 sm:size-4 sm:text-primary" />
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={() => dispatch(setOpenMenuMobile(!openMenuMobile))}
              className="block lg:hidden p-0"
            >
              <FaBars size="22" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-6 mr-auto">
          <div className="relative">
            <label htmlFor="avatarInput" className="cursor-pointer">
              <Image
                loading="lazy"
                src={userData?.image || "/avatar-default.png"}
                alt="Avatar"
                width="100"
                height="100"
                className="object-cover rounded-full"
              />

              <Image
                loading="lazy"
                src="/my-profile/change-avatar.svg"
                alt="Change Avatar"
                width="26"
                height="26"
                className="absolute bottom-0 right-0 z-10"
              />
            </label>

            <Input
              id="avatarInput"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="text-xl font-semibold">{userData?.fullname}</h1>
            <p className="text-base sm:text-lg text-primary">@{userData?.email}</p>
          </div>
        </div>

        <div className="w-full h-auto flex flex-col gap-8 p-6 sm:p-8 bg-white shadow-md rounded-2xl">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Họ và tên</label>
            {isModeEdit ? (
              <Input
                autoFocus
                type="text"
                spellCheck={false}
                defaultValue={userData?.fullname}
                {...register("fullname", { required: "Vui lòng nhập họ và tên của bạn!" })}
                className={cn(errors.fullname ? "border-red-500" : "border-gray-300")}
              />
            ) : (
              <p className="text-[17px]">{userData?.fullname}</p>
            )}
            {errors.fullname && <p className="text-sm text-red-500">{errors.fullname.message}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Ngày sinh</label>
            {isModeEdit ? (
              <SelectDateOfBirth
                watch={watch}
                errors={errors}
                register={register}
                setValue={setValue}
                clearErrors={clearErrors}
              />
            ) : (
              <p className="text-[17px]">{userData?.dateOfBirth ? userData?.dateOfBirth : "Chưa cập nhật"}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Giới tính</label>
            {isModeEdit ? (
              <div className="flex gap-8">
                <label className="flex items-center gap-2">
                  <Input
                    type="radio"
                    value="male"
                    className="w-4 h-4"
                    defaultChecked={userData?.gender === "male"}
                    {...register("gender", { required: "Vui lòng chọn giới tính!" })}
                  />
                  Nam
                </label>

                <label className="flex items-center gap-2">
                  <Input
                    type="radio"
                    value="female"
                    className="w-4 h-4"
                    defaultChecked={userData?.gender === "female"}
                    {...register("gender", { required: "Vui lòng chọn giới tính!" })}
                  />
                  Nữ
                </label>
              </div>
            ) : (
              <p className="text-[17px]">
                {userData?.gender ? userData?.gender === "male" ? "Nam" : "Nữ" : "Chưa cập nhật"}
              </p>
            )}
            {errors.gender && <p className="text-sm text-red-500">{errors.gender.message}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Số điện thoại</label>
            {isModeEdit ? (
              <Input
                type="tel"
                defaultValue={userData?.phoneNumber}
                placeholder="Nhập số điện thoại của bạn"
                {...register("phoneNumber", { required: "Vui lòng nhập số điện thoại của bạn!" })}
                className={cn(errors.phoneNumber ? "border-red-500" : "border-gray-300")}
              />
            ) : (
              <p className="text-[17px]">{userData?.phoneNumber ? userData?.phoneNumber : "Chưa cập nhật"}</p>
            )}
            {errors.phoneNumber && <p className="text-sm text-red-500">{errors.phoneNumber.message}</p>}
          </div>

          {isModeEdit ? (
            <>
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
            </>
          ) : (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Địa chỉ</label>
              <p className="text-[17px]">{userData?.address ? userData?.address : "Chưa cập nhật"}</p>
            </div>
          )}

          {isModeEdit && (
            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-4">
              <Button
                type="button"
                size="lg"
                variant="cancel"
                onClick={() => {
                  setIsModeEdit(false);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                Hủy
              </Button>

              <Button
                type="submit"
                size="lg"
                variant="submit"
                disabled={isEditing}
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                {isEditing ? "Đang lưu..." : isModeEdit ? "Lưu thay đổi" : "Cập nhật hồ sơ"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </form>
  );
});

MyProfile.displayName = "MyProfile";

export default MyProfile;