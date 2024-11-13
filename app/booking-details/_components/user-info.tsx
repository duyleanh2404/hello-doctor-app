import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

import { MdEmail } from "react-icons/md";
import { FaPhone } from "react-icons/fa6";

import { Controller } from "react-hook-form";

import { UserInfoProps } from "@/types/booking-types";
import { validatePhoneNumber } from "@/utils/validate-phone-number";

import {
  Avatar,
  AvatarImage,
  AvatarFallback
} from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import Spinner from "@/components/spinner";

const UserInfo = ({
  user, isLoading, errors, control, setValue, register, clearErrors
}: UserInfoProps) => {
  const handleCheckboxChange = (checked: boolean) => {
    clearErrors("zaloPhone");
    setValue("zaloPhone", checked ? user?.phoneNumber || "" : "");
  };

  return (
    <div className="w-full lg:w-[35%] flex flex-col gap-8 p-6 border shadow-md rounded-2xl">
      <div className="flex flex-col gap-4">
        <h1 className={cn(
          "relative text-lg font-bold text-[#284a75] pl-3",
          "before:absolute before:top-1/2 before:left-0 before:-translate-y-1/2 before:w-[3px] before:h-[18px] before:bg-primary"
        )}>
          Người sử dụng dịch vụ
        </h1>

        <div className="flex flex-col gap-8">
          {isLoading || !user ? (
            <Spinner table className="py-12" />
          ) : (
            <div className="h-[190px] flex flex-col items-start justify-center gap-6 p-6 bg-[#f8f9fc] rounded-lg shadow-sm">
              <div className="flex items-center gap-3">
                <Avatar className="w-[50px] h-[50px]">
                  <AvatarImage src={user?.image} alt="User Avatar" />
                  <AvatarFallback className="text-lg font-medium text-white bg-primary">
                    {user?.fullname.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1">
                  <h1 className="text-lg font-semibold text-[#404040]">
                    {user?.fullname}
                  </h1>
                  <div className="flex items-center gap-3 text-[#595959]">
                    <p>{user?.gender === "male" ? "Nam" : "Nữ"}</p>
                    <p>{user?.dateOfBirth}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <FaPhone size="14" className="w-[20px] text-[#595959]" />
                  <p className="text-[#595959]">{user?.phoneNumber}</p>
                </div>

                <div className="flex items-center gap-3">
                  <MdEmail size="16" className="w-[20px] text-[#595959]" />
                  <p className="text-[#595959]">{user?.email}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3">
            <Image
              loading="lazy"
              src="/security.svg"
              alt="Security Icon"
              width="16"
              height="16"
              className="translate-y-1"
            />
            <div className="flex flex-col gap-1 text-sm leading-6">
              <p className="font-semibold">
                Thông tin khách hàng được bảo mật và dùng cho mục đích liên hệ hỗ trợ dịch vụ.
              </p>
              <p>
                Cập nhật thông tin cá nhân trong {""}
                <Link href="/" className="font-medium text-primary">Hồ sơ người dùng</Link> {""}
                hoặc đăng ký tài khoản mới để đặt chỗ.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h1 className="relative text-lg font-bold text-[#284a75] pl-3 before:absolute before:top-1/2 before:left-0 before:-translate-y-1/2 before:w-[3px] before:h-[18px] before:bg-primary">
          Câu hỏi khảo sát
        </h1>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 sm:gap-2">
            <h1 className="text-[17px] font-semibold text-[#404040]">
              1. Bạn đã tới sử dụng dịch vụ của bệnh viện này chưa?
            </h1>
            <div className="flex flex-col sm:flex-row items-start lg:items-center gap-4 sm:gap-8">
              <Controller
                control={control}
                name="newPatients"
                render={({ field }) => (
                  <div className="flex items-center">
                    <Input
                      id="new"
                      type="radio"
                      className="w-[16px] h-[16px] cursor-pointer"
                      value="true"
                      checked={field.value === true}
                      onChange={() => field.onChange(true)}
                    />
                    <label htmlFor="new" className="pl-3 cursor-pointer select-none">
                      Bệnh nhân mới
                    </label>
                  </div>
                )}
              />

              <Controller
                control={control}
                name="newPatients"
                render={({ field }) => (
                  <div className="flex items-center">
                    <Input
                      id="old"
                      type="radio"
                      className="w-[16px] h-[16px] cursor-pointer"
                      value="false"
                      checked={field.value === false}
                      onChange={() => field.onChange(false)}
                    />
                    <label htmlFor="old" className="pl-3 cursor-pointer select-none">
                      Bệnh nhân cũ
                    </label>
                  </div>
                )}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[17px] font-semibold text-[#404040]">Zalo</label>
            <div className="flex flex-col gap-2">
              <Input
                spellCheck={false}
                type="text"
                placeholder="Nhập số điện thoại..."
                {...register("zaloPhone", {
                  required: "Vui lòng nhập số điện thoại sử dụng Zalo",
                  validate: validatePhoneNumber
                })}
                className={cn(
                  "p-3 border border-gray-300 rounded-lg transition duration-500",
                  errors.zaloPhone ? "border-red-500" : "focus:border-primary focus:shadow-input-primary"
                )}
              />

              {errors.zaloPhone && (
                <span className="text-[13px] text-red-500">{errors.zaloPhone.message}</span>
              )}

              <div className="flex items-center space-x-2 select-none">
                <Checkbox id="terms" onCheckedChange={handleCheckboxChange} />
                <label htmlFor="terms" className="text-sm font-medium leading-none cursor-pointer">
                  Dùng số điện thoại trong hồ sơ người dùng
                </label>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[17px] font-semibold text-[#404040]">Địa chỉ chi tiết</label>
            <Input
              type="text"
              spellCheck={false}
              placeholder="Nhập địa chỉ chi tiết..."
              {...register("address", { required: "Vui lòng nhập địa chỉ chi tiết của bạn" })}
              className={cn(
                "p-3 border border-gray-300 rounded-lg transition duration-500",
                errors.address ? "border-red-500" : "focus:border-primary focus:shadow-input-primary"
              )}
            />

            {errors.address && (
              <span className="text-[13px] text-red-500">{errors.address.message}</span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-[17px] font-semibold text-[#404040]">
            2. Lí do tới thăm khám của bạn?
          </h1>
          <textarea
            rows={5}
            spellCheck={false}
            placeholder="Nhập lí do thăm khám..."
            {...register("reasons", {
              required: "Vui lòng nhập lí do thăm khám",
              minLength: { value: 10, message: "Vui lòng nhập ít nhất 10 ký tự" }
            })}
            className={cn(
              "p-3 outline-none border border-gray-300 rounded-lg transition duration-500 resize-none",
              errors.reasons ? "border-red-500" : "focus:border-primary focus:shadow-input-primary"
            )}
          />

          {errors.reasons && (
            <span className="text-[13px] text-red-500">{errors.reasons.message}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserInfo;