"use client";

import * as React from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
  setSelectedDate,
  setDateError,
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full h-12 justify-start text-left font-normal",
            !selectedDate && "text-muted-foreground",
            dateError && "border border-red-500",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedDate
            ? capitalizeFirstLetter(format(selectedDate, "PPP", { locale: vi }))
            : <span>{placeholder ? placeholder : "Chọn ngày khám"}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(value) => {
            setSelectedDate(value);
            setDateError && setDateError("");
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};