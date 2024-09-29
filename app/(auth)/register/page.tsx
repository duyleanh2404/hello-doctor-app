"use client";

import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";

import Link from "next/link";
import Image from "next/image";

import validateEmail from "@/utils/validate-email";
import validateFullName from "@/utils/validate-fullname";
import validatePassword from "@/utils/validate-password";
import validatePhoneNumber from "@/utils/validate-phone-number";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface RegisterFormInputs {
  email: string;
  fullname: string;
  province: string;
  district: string;
  street: string;
  day: string;
  month: string;
  year: string;
  gender: string;
  password: string;
  phoneNumber: string;
};

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<RegisterFormInputs>();

  const [isShowPassword, setIsShowPassword] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState<string>("");

  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await fetch("https://provinces.open-api.vn/api/p");
        const data = await response.json();
        setProvinces(data);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    };

    fetchProvinces();
  }, []);

  useEffect(() => {
    const fetchDistricts = async () => {
      if (selectedProvince) {
        try {
          const response =
            await fetch(`https://provinces.open-api.vn/api/d/search/?q=${selectedProvince}`);
          const data = await response.json();
          setDistricts(data);
        } catch (error) {
          console.error("Error fetching districts:", error);
        }
      } else {
        setDistricts([]);
      }
    };

    fetchDistricts();
  }, [selectedProvince]);

  const handleRegister: SubmitHandler<RegisterFormInputs> = async (userData) => {
    console.log({
      email: userData.email,
      gender: userData.gender,
      password: userData.password,
      fullname: userData.fullname,
      phoneNumber: userData.phoneNumber,
      dateOfBirth: `${userData.day}/${userData.month}/${userData.year}`,
      address: `${userData.street}, ${userData.district}, ${userData.province}`
    });
  };

  return (
    <div className="h-auto bg-[#f7f9fc] overflow-y-auto">
      <div className="sm:wrapper flex flex-col items-center gap-12 py-12">
        <Link href="/">
          <Image
            loading="lazy"
            src="/logo.png"
            alt="Logo"
            width="140"
            height="31"
          />
        </Link>

        <div className="w-full sm:w-[550px] h-auto p-6 sm:p-8 bg-white rounded-xl sm:rounded-lg shadow-md">
          <form
            onSubmit={handleSubmit(handleRegister)}
            className="flex flex-col gap-8"
          >
            <h1 className="text-[22px] font-bold text-center">Đăng ký tài khoản</h1>
            <div className="flex flex-col gap-2">
              <label className="text-[15px] font-medium">Email</label>
              <Input
                type="text"
                {...register("email", {
                  required: "Vui lòng nhập email của bạn!",
                  validate: validateEmail
                })}
                spellCheck={false}
                placeholder="Nhập email của bạn"
                className={cn(
                  "placeholder:text-[#A9A9A9] p-3 border rounded-md transition duration-500",
                  errors.email ? "border-[#ff4d4f]" : "focus:border-primary focus:shadow-input-primary"
                )}
              />

              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[15px] font-medium">Tên đầy đủ</label>
              <Input
                type="text"
                {...register("fullname", {
                  required: "Vui lòng nhập tên đầy đủ của bạn!",
                  validate: validateFullName
                })}
                spellCheck={false}
                placeholder="Nhập tên đầy đủ của bạn"
                className={cn(
                  "placeholder:text-[#A9A9A9] p-3 border rounded-md transition duration-500",
                  errors.fullname ? "border-[#ff4d4f]" : "focus:border-primary focus:shadow-input-primary"
                )}
              />

              {errors.fullname && (
                <p className="text-sm text-red-500">{errors.fullname.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[15px] font-medium">Tỉnh/Thành phố</label>
              <Select
                {...register("province", { required: "Vui lòng chọn tỉnh/thành phố!" })}
                onValueChange={(value) => {
                  setSelectedProvince(value);
                  setValue("province", value);
                }}
              >
                <SelectTrigger className={cn(
                  "border rounded-md",
                  errors.province ? "border-[#ff4d4f]" : "focus:border-primary focus:shadow-input-primary"
                )}>
                  <SelectValue placeholder="Chọn tỉnh/thành phố" />
                </SelectTrigger>
                <SelectContent>
                  {provinces.map((province, index) => (
                    <SelectItem key={index} value={province.name}>
                      {province.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {errors.province && (
                <p className="text-sm text-red-500">{errors.province.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[15px] font-medium">Quận/Huyện</label>
              <Select
                disabled={!selectedProvince}
                {...register("district", { required: "Vui lòng chọn quận/huyện!" })}
                onValueChange={(value) => {
                  setValue("district", value);
                }}
              >
                <SelectTrigger className={cn(
                  "border rounded-md transition duration-500",
                  errors.district ? "border-[#ff4d4f]" : "focus:border-primary focus:shadow-input-primary"
                )}>
                  <SelectValue placeholder="Chọn quận/huyện" />
                </SelectTrigger>
                <SelectContent>
                  {districts.map((district, index) => (
                    <SelectItem key={index} value={district.name}>
                      {district.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {errors.district && (
                <p className="text-sm text-red-500">{errors.district.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[15px] font-medium">Tên đường</label>
              <Input
                type="text"
                {...register("street", {
                  required: "Vui lòng nhập tên đường của bạn!"
                })}
                spellCheck={false}
                placeholder="Nhập tên đường của bạn"
                className={cn(
                  "placeholder:text-[#A9A9A9] p-3 border rounded-md transition duration-500",
                  errors.street ? "border-[#ff4d4f]" : "focus:border-primary focus:shadow-input-primary"
                )}
              />

              {errors.street && (
                <p className="text-sm text-red-500">{errors.street.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[15px] font-medium">Số điện thoại</label>
              <Input
                type="text"
                {...register("phoneNumber", {
                  required: "Vui lòng nhập số điện thoại của bạn!",
                  validate: validatePhoneNumber
                })}
                spellCheck={false}
                placeholder="Nhập số điện thoại của bạn"
                className={cn(
                  "placeholder:text-[#A9A9A9] p-3 border rounded-md transition duration-500",
                  errors.phoneNumber ? "border-[#ff4d4f]" : "focus:border-primary focus:shadow-input-primary"
                )}
              />

              {errors.phoneNumber && (
                <p className="text-sm text-red-500">{errors.phoneNumber.message}</p>
              )}
            </div>

            <div className="flex gap-2">
              <div className="flex flex-col gap-2 w-full">
                <label className="text-[15px] font-medium">Ngày</label>
                <Select
                  {...register("day", { required: "Vui lòng chọn ngày!" })}
                  onValueChange={(value) => setValue("day", value)}
                >
                  <SelectTrigger className={cn(
                    "border rounded-md",
                    errors.day ? "border-[#ff4d4f]" : "focus:border-primary focus:shadow-input-primary"
                  )}>
                    <SelectValue placeholder="Chọn ngày" />
                  </SelectTrigger>
                  <SelectContent>
                    {[...Array(31)].map((_, i) => (
                      <SelectItem key={i + 1} value={`${i + 1}`}>
                        {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.day && (
                  <p className="text-sm text-red-500">{errors.day.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-2 w-full">
                <label className="text-[15px] font-medium">Tháng</label>
                <Select
                  {...register("month", { required: "Vui lòng chọn tháng!" })}
                  onValueChange={(value) => setValue("month", value)}
                >
                  <SelectTrigger className={cn(
                    "border rounded-md",
                    errors.month ? "border-[#ff4d4f]" : "focus:border-primary focus:shadow-input-primary"
                  )}>
                    <SelectValue placeholder="Chọn tháng" />
                  </SelectTrigger>
                  <SelectContent>
                    {[...Array(12)].map((_, i) => (
                      <SelectItem key={i + 1} value={`${i + 1}`}>
                        {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.month && (
                  <p className="text-sm text-red-500">{errors.month.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-2 w-full">
                <label className="text-[15px] font-medium">Năm</label>
                <Select
                  {...register("year", { required: "Vui lòng chọn năm!" })}
                  onValueChange={(value) => setValue("year", value)}
                >
                  <SelectTrigger className={cn(
                    "border rounded-md",
                    errors.year ? "border-[#ff4d4f]" : "focus:border-primary focus:shadow-input-primary"
                  )}>
                    <SelectValue placeholder="Chọn năm" />
                  </SelectTrigger>
                  <SelectContent>
                    {[...Array(101)].map((_, i) => (
                      <SelectItem key={new Date().getFullYear() - i} value={`${new Date().getFullYear() - i}`}>
                        {new Date().getFullYear() - i}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {errors.year && (
                  <p className="text-sm text-red-500">{errors.year.message}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[15px] font-medium">Mật khẩu</label>
              <div className="relative">
                <Input
                  type={`${isShowPassword ? "text" : "password"}`}
                  {...register("password", {
                    required: "Vui lòng nhập mật khẩu của bạn!",
                    validate: validatePassword
                  })}
                  spellCheck={false}
                  placeholder="Nhập mật khẩu của bạn"
                  className={cn(
                    "w-full placeholder:text-[#A9A9A9] p-3 border rounded-md transition duration-500",
                    errors.password ? "border-[#ff4d4f]" : "focus:border-primary focus:shadow-input-primary"
                  )}
                />

                {isShowPassword ? (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsShowPassword(!isShowPassword)}
                    className="absolute top-1/2 right-4 -translate-y-1/2 h-0 p-0 hover:bg-transparent"
                  >
                    <FaRegEye size="18" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsShowPassword(!isShowPassword)}
                    className="absolute top-1/2 right-4 -translate-y-1/2 h-0 p-0 hover:bg-transparent"
                  >
                    <FaRegEyeSlash size="18" />
                  </Button>
                )}
              </div>

              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-6 select-none">
                <label className="text-[15px] font-medium">Giới tính</label>
                <div className="flex items-center">
                  <Input
                    {...register("gender", {
                      required: "Vui lòng chọn giới tính của bạn!"
                    })}
                    type="radio"
                    id="male"
                    name="gender"
                    value="Nam"
                    className="w-[15px] h-[15px]"
                  />
                  <label htmlFor="male" className="pl-2">Nam</label>
                </div>

                <div className="flex items-center">
                  <Input
                    {...register("gender", {
                      required: "Vui lòng chọn giới tính của bạn!"
                    })}
                    type="radio"
                    id="female"
                    name="gender"
                    value="Nữ"
                    className="w-[15px] h-[15px]"
                  />
                  <label htmlFor="female" className="pl-2">Nữ</label>
                </div>
              </div>

              {errors.gender && (
                <p className="text-sm text-red-500">{errors.gender.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="h-12 relative text-[17px] font-medium text-white py-4 mt-5 bg-primary hover:bg-[#2c74df] rounded-md shadow-md transition duration-500"
            >
              Đăng ký
            </Button>

            <div className="flex items-center justify-center gap-2 select-none">
              <p className="text-[15px]">Đã có tài khoản?</p>
              <Link href="/login">
                <p className="font-medium text-primary hover:underline">Đăng nhập ngay!</p>
              </Link>
            </div>
          </form>
        </div>
      </div>

      <aside className="hidden xl:block fixed bottom-0 left-0">
        <Image
          loading="lazy"
          src="/auth/aside-left.svg"
          alt="Aside"
          width="320"
          height="258"
        />
      </aside>

      <aside className="hidden xl:block fixed bottom-0 right-5">
        <Image
          loading="lazy"
          src="/auth/aside-right.svg"
          alt="Aside"
          width="320"
          height="258"
        />
      </aside>
    </div>
  );
};

export default RegisterPage;