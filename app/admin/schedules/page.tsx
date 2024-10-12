"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

import { FiSearch } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import { LuClipboardEdit } from "react-icons/lu";
import { FaClinicMedical } from "react-icons/fa";
import { BsClipboard2PlusFill } from "react-icons/bs";

import {
  Select,
  SelectValue,
  SelectContent,
  SelectTrigger
} from "@/components/ui/select";

import {
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableHeader
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import PaginationSection from "@/components/pagination";

const ManageSchedules = () => {
  const [inputFocused, setInputFocused] = useState(false);

  return (
    <>
      {/* Page heading */}
      <h1 className="text-xl font-bold mb-4">Danh sách lịch trình của bác sĩ</h1>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          {/* Specialty selection dropdown */}
          <Select>
            <SelectTrigger className="w-[220px] p-3 border-none shadow-none">
              <div className="flex items-center gap-3">
                {/* Location icon */}
                <BsClipboard2PlusFill className="size-5 text-[#1c3f66]" />
                {/* Placeholder for selected specialty */}
                <SelectValue placeholder="Chọn chuyên khoa" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <p>Fetch specialties</p>
            </SelectContent>
          </Select>

          {/* Clinic selection dropdown */}
          <Select>
            <SelectTrigger className="w-[220px] p-3 border-none shadow-none">
              <div className="flex items-center gap-3">
                {/* Location icon */}
                <FaClinicMedical className="size-5 text-[#1c3f66]" />
                {/* Placeholder for selected clinic */}
                <SelectValue placeholder="Chọn bệnh viện" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <p>Fetch clinics</p>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-6">
          {/* Date picker */}
          <DatePicker className="h-14 border-t-transparent border-x-transparent hover:bg-transparent shadow-none rounded-none" />

          {/* Search input field */}
          <div className="relative">
            <FiSearch
              size="22"
              className={cn(
                "absolute left-2 top-1/2 -translate-y-1/2 transition duration-500",
                inputFocused ? "text-primary" : "text-gray-500" // Change icon color on input focus
              )}
            />
            <Input
              type="text"
              spellCheck={false}
              placeholder="Tìm kiếm theo tên bác sĩ..."
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              className="w-[420px] text-[17px] border-b border-[#ccc] focus:border-primary pl-12 rounded-none shadow-none transition duration-500"
            />
          </div>
        </div>
      </div>

      {/* Table displaying schedule data */}
      <div className="relative rounded-md shadow-md overflow-x-auto">
        <Table className="text-[17px]">
          {/* Table header */}
          <TableHeader className="h-12 bg-gray-100">
            <TableRow>
              <TableHead className="font-semibold text-black w-[50px]">STT</TableHead>
              <TableHead className="font-semibold text-black text-start">Họ và tên</TableHead>
              <TableHead className="font-semibold text-black text-start">Ngày khám</TableHead>
              <TableHead className="font-semibold text-black text-start">Thời gian khám</TableHead>
              <TableHead className="font-semibold text-black text-start">Bệnh viện</TableHead>
              <TableHead className="font-semibold text-black text-start">Chuyên khoa</TableHead>
              <TableHead className="font-semibold text-black text-start">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          {/* Table body (sample row with schedule data) */}
          <TableBody>
            <TableRow>
              <TableCell className="text-center">1</TableCell>
              <TableCell>Doctor fullname</TableCell>
              <TableCell>Schedule date</TableCell>
              <TableCell>Schedule time</TableCell>
              <TableCell>Schedule clinic</TableCell>
              <TableCell>Schedule specialty</TableCell>
              <TableCell className="py-6 px-4">
                <div className="flex items-center gap-4">
                  {/* Edit button */}
                  <Button type="button" variant="ghost">
                    <LuClipboardEdit size="22" />
                  </Button>
                  {/* Delete button */}
                  <Button type="button" variant="ghost">
                    <AiOutlineDelete size="22" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* Navigate to next page */}
      <div className="ml-auto">
        <PaginationSection />
      </div>
    </>
  );
};

export default ManageSchedules;