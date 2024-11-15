import { cn } from "@/lib/utils";
import Image from "next/image";

import { Input } from "@/components/ui/input";

interface IProps {
  value: string;
  label: string;
  imgSrc: string;
  gender: string | null;
  setGender: (gender: string | null) => void;
};

const GenderOptions = ({ value, label, imgSrc, gender, setGender }: IProps) => (
  <label
    className={cn(
      "flex-1 flex items-center justify-center gap-3 p-4 border border-gray-300 rounded-md transition duration-300 cursor-pointer hover:border-primary hover:shadow-input-primary",
      gender === value && "border-primary shadow-input-primary"
    )}
  >
    <Image loading="lazy" src={imgSrc} alt="Gender" width={30} height={30} />
    <p className="text-lg">{label}</p>
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

export default GenderOptions;