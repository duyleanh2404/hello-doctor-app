import { cn } from "@/lib/utils";
import { useState, FormEvent } from "react";
import Image from "next/image";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import GenderOptions from "./gender-options";

const BodyMassIndex = () => {
  const [isLoading, setLoading] = useState<boolean>(false);

  const [age, setAge] = useState<number | null>(null);
  const [bmi, setBmi] = useState<number | null>(null);

  const [gender, setGender] = useState<string | null>(null);
  const [height, setHeight] = useState<number | null>(null);
  const [weight, setWeight] = useState<number | null>(null);

  const [bmiResult, setBmiResult] = useState<string>("");
  const [bmiResultColor, setBmiResultColor] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBmi(null);
    setLoading(true);
    setBmiResult("");
    setBmiResultColor("");

    if (age && age < 5) {
      setErrorMessage("Tuổi phải lớn hơn hoặc bằng 5!");
      setLoading(false);
      return;
    }

    if (height && weight) {
      const heightInMeters = height / 100;
      const calculatedBmi = weight / (heightInMeters * heightInMeters);
      setErrorMessage(null);

      let resultMessage: string;
      let resultColor: string;

      switch (true) {
        case calculatedBmi < 18.5:
          resultMessage = "Bạn đang thiếu cân!";
          resultColor = "text-orange-500";
          break;
        case calculatedBmi >= 18.5 && calculatedBmi < 24.9:
          resultMessage = "Bạn có cân nặng bình thường!";
          resultColor = "text-green-500";
          break;
        case calculatedBmi >= 25 && calculatedBmi < 29.9:
          resultMessage = "Bạn đang thừa cân!";
          resultColor = "text-yellow-500";
          break;
        default:
          resultMessage = "Bạn đang béo phì!";
          resultColor = "text-red-500";
          break;
      }

      setTimeout(() => {
        setBmi(calculatedBmi);
        setBmiResult(resultMessage);
        setBmiResultColor(resultColor);
        setLoading(false);
      }, 2000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border rounded-2xl sm:rounded-xl shadow-lg bg-white">
      <div className="flex items-center justify-between gap-6 py-8 px-6 text-white bg-gradient-to-r from-blue-500 to-blue-700 rounded-t-2xl sm:rounded-t-xl">
        <div className="flex flex-col gap-1">
          <h1 className="sm:text-lg font-bold">Tính chỉ số BMI - Chỉ số khối cơ thể</h1>
          <p className="text-[12px] sm:text-sm">
            Tham vấn y khoa: {""}
            <span className="font-semibold">Bác sĩ Nguyễn Thường Hanh</span> ngày 15/06/2021
          </p>
        </div>
        <Image loading="lazy" src="/bmi-check.png" alt="BMI" width={50} height={50} />
      </div>

      <div className="flex flex-col gap-6 pt-6 pb-8 px-6 sm:pt-8 sm:pb-10 sm:px-6">
        <div className="flex flex-col gap-2">
          <label className="text-[15px] font-semibold">Giới tính của bạn</label>
          <div className="flex items-center gap-4">
            <GenderOptions value="male" label="Nam" imgSrc="/male.svg" gender={gender} setGender={setGender} />
            <GenderOptions value="female" label="Nữ" imgSrc="/female.svg" gender={gender} setGender={setGender} />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[15px] font-medium">Số tuổi</label>
          <Input
            type="number"
            id="age"
            spellCheck={false}
            placeholder="Bạn bao nhiêu tuổi?"
            value={age ?? ""}
            onChange={(event) => {
              const value = Number(event.target.value);
              setAge(value >= 0 ? value : null);
            }}
            className={cn(errorMessage ? "border-red-500" : "border-gray-300")}
          />
          {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[15px] font-medium">Chiều cao (cm)</label>
          <Input
            type="number"
            id="height"
            placeholder="Bạn cao bao nhiêu?"
            value={height ?? ""}
            onChange={(event) => setHeight(event.target.value ? Number(event.target.value) : null)}
            className={cn(errorMessage ? "border-red-500" : "border-gray-300")}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[15px] font-medium">Cân nặng (kg)</label>
          <Input
            type="number"
            id="weight"
            placeholder="Cân nặng của bạn?"
            value={weight ?? ""}
            onChange={(event) => setWeight(event.target.value ? Number(event.target.value) : null)}
            className={cn(errorMessage ? "border-red-500" : "border-gray-300")}
          />
        </div>

        {errorMessage && <p className="text-red-500 font-medium mt-2">{errorMessage}</p>}

        <Button
          type="submit"
          size="xl"
          variant="main"
          disabled={age === null || height === null || weight === null || gender === null || isLoading}
        >
          {isLoading ? "Đang tính..." : "Tính ngay"}
        </Button>

        {bmi && (
          <div className="flex flex-col items-center gap-3 mt-4">
            <p className="text-xl font-semibold">
              Chỉ số BMI của bạn: <span className={bmiResultColor}>{bmi.toFixed(2)}</span>
            </p>
            <p className={`text-lg font-semibold ${bmiResultColor}`}>{bmiResult}</p>
          </div>
        )}
      </div>
    </form>
  );
};

export default BodyMassIndex;