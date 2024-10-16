import { cn } from "@/lib/utils";

interface SpinnerProps {
  table?: boolean;
  center?: boolean;
};

const Spinner = ({ table, center }: SpinnerProps) => {
  const spinnerSize = center ? "w-14 h-14" : table ? "w-10 h-10" : "w-6 h-6";
  const textSize = center ? "text-lg" : "";

  return (
    <div className={cn(
      "flex flex-col items-center justify-center gap-8",
      center ? "min-h-screen" : table ? "h-full" : ""
    )}>
      <div className={cn(
        "border-t-4 border-primary border-solid rounded-full animate-spin",
        spinnerSize
      )} />
      {(center || table) && <p className={textSize}>Đang tải...</p>}
    </div>
  );
};

export default Spinner;