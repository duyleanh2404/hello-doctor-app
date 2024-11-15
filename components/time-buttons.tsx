import { cn } from "@/lib/utils";
import { Dispatch, SetStateAction } from "react";

import { Button } from "@/components/ui/button";

type ActiveTime = "morning" | "afternoon" | "evening";

interface TimeButtonsProps {
  activeTime: ActiveTime;
  setActiveTime: Dispatch<SetStateAction<ActiveTime>>;
};

const TimeButtons = ({ activeTime, setActiveTime }: TimeButtonsProps) => {
  const handleTimeChange = (time: ActiveTime) => {
    setActiveTime(time);
  };

  return (
    <div className="flex">
      {["morning", "afternoon", "evening"].map((time: string) => (
        <Button
          key={time}
          type="button"
          variant="ghost"
          onClick={() => handleTimeChange(time as ActiveTime)}
          className={cn(
            "flex-1 text-base sm:text-[17px] font-semibold pb-2 rounded-none",
            activeTime === time ? "text-primary border-b-[3px] border-primary" : "hover:text-primary"
          )}
        >
          {time === "morning" ? "Sáng" : time === "afternoon" ? "Chiều" : "Tối"}
        </Button>
      ))}
    </div>
  );
};

export default TimeButtons;