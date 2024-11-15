"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import Image from "next/image";

import { useForm, SubmitHandler } from "react-hook-form";
import { IoClose } from "react-icons/io5";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type FormInput = {
  name: string;
  phone: string;
  address: string;
  agree: boolean;
};

const ModalAdvertise = () => {
  const [openModal, setOpenModal] = useState<boolean>(true);
  const { register, handleSubmit, formState: { errors } } = useForm<FormInput>();

  const onSubmit: SubmitHandler<FormInput> = (formData) => console.log(formData);

  return (
    <div
      onClick={() => setOpenModal(false)}
      className={cn(
        "hidden sm:block fixed inset-0 bg-black bg-opacity-40 transition-opacity duration-500 z-[1000]",
        openModal ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-[500px] h-[600px] 2xl:h-[650px] rounded-2xl bg-white overflow-hidden"
      >
        <Button
          type="button"
          variant="ghost"
          onClick={() => setOpenModal(false)}
          className="absolute top-4 right-8 w-[40px] h-[40px] bg-white rounded-full shadow-md z-[1001]"
        >
          <IoClose size="28" className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 text-[#262626]" />
        </Button>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full overflow-y-auto">
          <div className="relative w-full pt-[100%]">
            <Image
              fill
              loading="lazy"
              alt="Advertise"
              src="/advertise/advertise-5.png"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col gap-6 p-6">
            <div className="flex flex-col items-center gap-3">
              <h1 className="text-2xl font-bold text-[#2a4975] text-center">
                Bảo vệ sức khỏe của bạn và gia
                <br />
                đình trước khi quá muộn
              </h1>
              <p className="text-sm font-medium text-[#262626]">Cơ hội nhận ngay quà tặng hấp dẫn lên đến 3 triệu đồng</p>
            </div>

            <div className="w-full flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="font-semibold text-[#595959]">Họ và tên</label>
                <Input
                  type="text"
                  spellCheck={false}
                  placeholder="Họ và tên"
                  {...register("name", { required: "Vui lòng nhập họ tên" })}
                  className={cn(errors.name ? "border-red-500" : "border-gray-300")}
                />
                {errors.name && <span className="text-[13px] text-red-500">{errors.name.message}</span>}
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-semibold text-[#595959]">Số điện thoại</label>
                <Input
                  type="text"
                  spellCheck={false}
                  placeholder="Số điện thoại"
                  {...register("phone", { required: "Vui lòng nhập số điện thoại" })}
                  className={cn(errors.phone ? "border-red-500" : "border-gray-300")}
                />
                {errors.phone && <span className="text-[13px] text-red-500">{errors.phone.message}</span>}
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-semibold text-[#595959]">Địa chỉ</label>
                <Input
                  type="text"
                  spellCheck={false}
                  placeholder="Địa chỉ"
                  {...register("address", { required: "Vui lòng nhập địa chỉ" })}
                  className={cn(errors.address ? "border-red-500" : "border-gray-300")}
                />
                {errors.address && <span className="text-[13px] text-red-500">{errors.address.message}</span>}
              </div>

              <div className="flex items-center gap-3">
                <Input
                  type="checkbox"
                  id="check"
                  {...register("agree", { required: "Bạn phải đồng ý với các điều khoản" })}
                  className="w-[15px] h-[15px]"
                />
                <label className="text-sm select-none" htmlFor="check">
                  Tôi đã đọc và đồng ý với {""}
                  <span className="font-semibold text-primary">
                    Các Điều Khoản của chương trình
                  </span>.
                </label>
              </div>
              {errors.agree && <span className="text-[13px] text-red-500">{errors.agree.message}</span>}

              <Button
                type="submit"
                variant="default"
                className="h-14 text-[17px] font-medium text-white bg-primary hover:bg-[#2c74df] rounded-md shadow-md transition duration-500"
              >
                Đăng ký
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalAdvertise;