import { cn } from "@/lib/utils";

interface IProps {
  title: string;
  subtitle?: string;
  customStyle?: string;
  icon: React.ReactNode;
};

const InfoItem = ({ icon, title, subtitle, customStyle }: IProps) => (
  <div className="flex items-center gap-4">
    <div className={cn("w-[10%] sm:w-[3%] text-[#595959]", customStyle)}>
      {icon}
    </div>
    <div className="flex flex-col gap-1 w-full">
      <p className={cn("text-[17px] font-semibold", customStyle)}>{title}</p>
      {subtitle && <p className="text-[15px] font-medium text-[#595959]">{subtitle}</p>}
    </div>
  </div>
);

export default InfoItem;