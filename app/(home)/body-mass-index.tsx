import { useState } from "react";
import { cn } from "@/lib/utils";

import Image from "next/image";

import { Button } from "@/components/ui/button";

const BodyMassIndex = () => {
  const [age, setAge] = useState<number | string>("");
  const [gender, setGender] = useState<string | null>(null);
  const [height, setHeight] = useState<number | string>("");
  const [weight, setWeight] = useState<number | string>("");

  const handleGenderChange = (selectedGender: string) => {
    setGender(selectedGender);
  };

  const renderInputField = (
    id: string,
    label: string,
    value: number | string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    placeholder: string
  ) => (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-[15px] font-semibold">
        {label}
      </label>
      <input
        id={id}
        type="number"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="text-[15px] placeholder:text-[15px] placeholder:font-medium p-3 border rounded-md focus:border-primary focus:shadow-input-primary transition duration-500"
      />
    </div>
  );

  const renderGenderOption = (value: string, label: string, imgSrc: string) => (
    <label
      className={cn(
        "flex-1 flex items-center justify-center gap-3 p-3 border rounded-md transition duration-500 cursor-pointer",
        gender === value ? "border-primary shadow-input-primary" : ""
      )}
    >
      <Image
        loading="lazy"
        src={imgSrc}
        alt="Gender"
        width={25}
        height={25}
      />
      <p>{label}</p>
      <input
        type="radio"
        name="gender"
        value={value}
        checked={gender === value}
        onChange={() => handleGenderChange(value)}
        className="hidden"
      />
    </label>
  );

  return (
    <div className="border rounded-2xl sm:rounded-md shadow-lg">
      <div className="flex items-center justify-between gap-6 py-8 px-6 text-white bg-gradient-primary rounded-t-2xl sm:rounded-t-md">
        <div className="flex flex-col gap-1">
          <h1 className="sm:text-lg font-bold">Tính chỉ số BMI - Chỉ số khối cơ thể</h1>
          <p className="text-[12px] sm:text-sm">
            Tham vấn y khoa: <span className="font-semibold">Bác sĩ Nguyễn Thường Hanh</span> ngày 15/06/2021
          </p>
        </div>
        <Image
          loading="lazy"
          src="/bmi-check.png"
          alt="Image"
          width={50}
          height={50}
        />
      </div>

      <div className="flex flex-col gap-6 pt-6 pb-8 px-6 sm:pt-8 sm:pb-10 sm:px-6">
        <div className="flex flex-col gap-2">
          <label className="text-[15px] font-semibold">Giới tính của bạn</label>
          <div className="flex items-center gap-4">
            {renderGenderOption("male", "Nam", "/male.svg")}
            {renderGenderOption("female", "Nữ", "/female.svg")}
          </div>
        </div>

        {renderInputField("age", "Bạn bao nhiêu tuổi?", age, (e) => setAge(e.target.value), "Số tuổi")}
        {renderInputField("height", "Bạn cao bao nhiêu?", height, (e) => setHeight(e.target.value), "Chiều cao (cm)")}
        {renderInputField("weight", "Cân nặng của bạn?", weight, (e) => setWeight(e.target.value), "Cân nặng (kg)")}

        <Button
          variant="default"
          disabled={!age || !height || !weight || !gender}
          className="h-13 sm:text-[17px] font-medium text-white py-3 bg-primary hover:bg-[#2c74df] transition duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Tính ngay
        </Button>
      </div>
    </div>
  );
};

export default BodyMassIndex;