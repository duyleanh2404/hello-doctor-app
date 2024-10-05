import { cn } from "@/lib/utils";
import { useState, FormEvent } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import Image from "next/image";

interface InputFieldProps {
  id: string;
  label: string;
  placeholder: string;
  value: number | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

interface GenderOptionProps {
  value: string;
  label: string;
  imgSrc: string;
  gender: string | null;
  setGender: (gender: string | null) => void;
};

const InputField = ({ id, label, placeholder, value, onChange }: InputFieldProps) => (
  <div className="flex flex-col gap-2">
    <label htmlFor={id} className="text-[15px] font-semibold">
      {label}
    </label>
    <Input
      id={id}
      type="number"
      value={value === null ? "" : value}
      onChange={onChange}
      placeholder={placeholder}
      className="text-[15px] placeholder:text-[15px] placeholder:font-medium p-3 border focus:border-primary focus:shadow-input-primary rounded-md transition duration-500"
    />
  </div>
);

const GenderOption = ({ value, label, imgSrc, gender, setGender }: GenderOptionProps) => (
  <label
    className={cn(
      "flex-1 flex items-center justify-center gap-3 p-3 border rounded-md transition duration-500 cursor-pointer",
      gender === value && "border-primary shadow-input-primary"
    )}
  >
    <Image
      loading="lazy"
      src={imgSrc}
      alt="Gender Icon"
      width={25}
      height={25}
    />
    <p>{label}</p>
    <Input
      type="radio"
      name="gender"
      value={value}
      checked={gender === value}
      onChange={() => setGender(value)}
      className="hidden"
    />
  </label>
);

const BodyMassIndex = () => {
  const [gender, setGender] = useState<string | null>(null);

  const [age, setAge] = useState<number | null>(null);
  const [height, setHeight] = useState<number | null>(null);
  const [weight, setWeight] = useState<number | null>(null);

  // Handle form submission
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log({
      gender,
      age,
      height,
      weight
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border rounded-2xl sm:rounded-md shadow-lg"
    >
      <div className="flex items-center justify-between gap-6 py-8 px-6 text-white bg-gradient-primary rounded-t-2xl sm:rounded-t-md">
        {/* Header section with title, doctor consultation info, and an image */}
        <div className="flex flex-col gap-1">
          {/* Main form title */}
          <h1 className="sm:text-lg font-bold">Tính chỉ số BMI - Chỉ số khối cơ thể</h1>
          {/* Consultation info */}
          <p className="text-[12px] sm:text-sm">
            Tham vấn y khoa: {""}
            <span className="font-semibold">Bác sĩ Nguyễn Thường Hanh</span> ngày 15/06/2021
          </p>
        </div>

        <Image
          loading="lazy"
          src="/bmi-check.png"
          alt="BMI Icon"
          width={50}
          height={50}
        />
      </div>

      {/* Main form body */}
      <div className="flex flex-col gap-6 pt-6 pb-8 px-6 sm:pt-8 sm:pb-10 sm:px-6">
        {/* Gender selection section */}
        <div className="flex flex-col gap-2">
          {/* Label for gender */}
          <label className="text-[15px] font-semibold">Giới tính của bạn</label>
          <div className="flex items-center gap-4">
            {/* Gender selection options */}
            <GenderOption
              value="male"
              label="Nam"
              imgSrc="/male.svg"
              gender={gender}
              setGender={setGender}
            />
            <GenderOption
              value="female"
              label="Nữ"
              imgSrc="/female.svg"
              gender={gender}
              setGender={setGender}
            />
          </div>
        </div>

        {/* Age input field */}
        <InputField
          id="age"
          label="Số tuổi"
          placeholder="Bạn bao nhiêu tuổi?"
          value={age}
          onChange={(e) => setAge(e.target.value ? Number(e.target.value) : null)}
        />

        {/* Height input field */}
        <InputField
          id="height"
          label="Chiều cao (cm)"
          placeholder="Bạn cao bao nhiêu?"
          value={height}
          onChange={(e) => setHeight(e.target.value ? Number(e.target.value) : null)}
        />

        {/* Weight input field */}
        <InputField
          id="weight"
          label="Cân nặng (kg)"
          placeholder="Cân nặng của bạn?"
          value={weight}
          onChange={(e) => setWeight(e.target.value ? Number(e.target.value) : null)}
        />

        {/* Submit button */}
        <Button
          type="submit"
          variant="default"
          disabled={age === null || height === null || weight === null || gender === null}
          className="h-12 sm:text-[17px] font-medium text-white py-3 bg-primary hover:bg-[#2c74df] transition duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Tính ngay
        </Button>
      </div>
    </form>
  );
};

export default BodyMassIndex;