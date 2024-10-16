import {
  UseFormWatch,
  UseFormRegister,
  UseFormSetValue,
  UseFormClearErrors
} from "react-hook-form";

import { cn } from "@/lib/utils";

import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger
} from "@/components/ui/select";

interface SelectDateOfBirthProps {
  watch?: UseFormWatch<any>;
  errors: Record<string, any>;
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  clearErrors: UseFormClearErrors<any>;
};

const SelectDateOfBirth = ({
  watch, errors, register, setValue, clearErrors
}: SelectDateOfBirthProps) => {
  return (
    <div className="flex gap-4">
      <div className="flex-1 flex flex-col gap-2">
        <Select
          defaultValue=""
          {...register("day", { required: "Vui lòng chọn ngày sinh!" })}
          onValueChange={(value) => {
            clearErrors("day");
            setValue("day", value);
          }}
        >
          <SelectTrigger className={cn(
            "border border-gray-300 rounded-md transition duration-500",
            errors.day ? "border-[#ff4d4f]" : "focus:border-primary focus:shadow-input-primary"
          )}>
            {watch ? (
              <SelectValue placeholder={watch("day") || "Chọn ngày"} />
            ) : (
              <SelectValue placeholder="Ngày" />
            )}
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 31 }, (_, i) => (
              <SelectItem key={i} value={(i + 1).toString()}> {i + 1}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {errors.day && (
          <p className="text-sm text-red-500">{errors.day.message}</p>
        )}
      </div>

      <div className="flex-1 flex flex-col gap-2">
        <Select
          defaultValue=""
          {...register("month", { required: "Vui lòng chọn tháng sinh!" })}
          onValueChange={(value) => {
            clearErrors("month");
            setValue("month", value);
          }}
        >
          <SelectTrigger className={cn(
            "border border-gray-300 rounded-md transition duration-500",
            errors.month ? "border-[#ff4d4f]" : "focus:border-primary focus:shadow-input-primary"
          )}>
            {watch ? (
              <SelectValue placeholder={watch("month") || "Chọn tháng"} />
            ) : (
              <SelectValue placeholder="Tháng" />
            )}
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 12 }, (_, i) => (
              <SelectItem key={i} value={(i + 1).toString()}>{i + 1}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {errors.month && (
          <p className="text-sm text-red-500">{errors.month.message}</p>
        )}
      </div>

      <div className="flex-1 flex flex-col gap-2">
        <Select
          defaultValue=""
          {...register("year", { required: "Vui lòng chọn năm sinh!" })}
          onValueChange={(value) => {
            clearErrors("year");
            setValue("year", value);
          }}
        >
          <SelectTrigger className={cn(
            "border border-gray-300 rounded-md transition duration-500",
            errors.year ? "border-[#ff4d4f]" : "focus:border-primary focus:shadow-input-primary"
          )}>
            {watch ? (
              <SelectValue placeholder={watch("year") || "Chọn năm"} />
            ) : (
              <SelectValue placeholder="Năm" />
            )}
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 100 }, (_, i) => (
              <SelectItem key={i} value={(new Date().getFullYear() - i).toString()}>
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
  );
};

export default SelectDateOfBirth;