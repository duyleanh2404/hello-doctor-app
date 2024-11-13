"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

interface DatePickerProps {
  className?: string;
  placeholder?: string;
  dateError?: string;
  setDateError?: (dateError: string) => void;
  selectedDate?: Date | undefined;
  setSelectedDate: (selectedDate: Date | undefined) => void;
}

export function DatePicker({
  dateError,
  className,
  placeholder,
  selectedDate,
  setDateError,
  setSelectedDate,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full h-14 flex justify-start text-left font-normal hover:bg-transparent hover:border-primary hover:shadow-input-primary transition duration-500",
            !selectedDate && "text-muted-foreground",
            dateError && "border border-red-500",
            className
          )}
        >
          <CalendarIcon className="flex-shrink-0 mr-2 h-4 w-4" />
          {selectedDate
            ? capitalizeFirstLetter(format(selectedDate, "PPP", { locale: vi }))
            : <span>{placeholder ? placeholder : "Chọn ngày khám"}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={selectedDate}
          disabled={(date) => date < today}
          onSelect={(value) => {
            setOpen(false);
            setSelectedDate(value);
            setDateError && setDateError("");
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}