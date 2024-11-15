import { Input } from "@/components/ui/input";

interface IProps {
  id: string;
  label: string;
  placeholder: string;
  value: number | null;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const InputField = ({ id, label, placeholder, value, onChange }: IProps) => (
  <div className="flex flex-col gap-2">
    <label htmlFor={id} className="text-[15px] font-semibold">{label}</label>
    <Input
      id={id}
      type="number"
      spellCheck={false}
      onChange={onChange}
      placeholder={placeholder}
      value={value === null ? "" : value}
    />
  </div>
);

export default InputField;