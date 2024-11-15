"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

import { format } from "date-fns";
import { vi } from "date-fns/locale";

import { Calendar as CalendarIcon } from "lucide-react";

import { capitalizeFirstLetter } from "@/utils/capitalize-first-letter";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface IProps {
  disableDate?: Date;
  className?: string;
  dateError?: string;
  placeholder?: string;
  selectedDate?: Date | undefined;
  setDateError?: (dateError: string) => void;
  setSelectedDate: (selectedDate: Date | undefined) => void;
};

export function DatePicker({
  disableDate, className, dateError, placeholder, selectedDate, setDateError, setSelectedDate
}: IProps) {
  const [open, setOpen] = useState(false);

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
          {
            selectedDate
              ? capitalizeFirstLetter(format(selectedDate, "PPP", { locale: vi }))
              : <span>{placeholder ? placeholder : "Chọn ngày khám"}</span>
          }
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={selectedDate}
          disabled={(date) => date < disableDate!}
          onSelect={(value) => {
            setOpen(false);
            setSelectedDate(value);
            if (setDateError) setDateError("");
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};