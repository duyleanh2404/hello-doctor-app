"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

import { FiSearch } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import { LuClipboardEdit } from "react-icons/lu";

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
import PaginationSection from "@/components/pagination";

const ManageSpecialties = () => {
  const [inputFocused, setInputFocused] = useState(false);

  return (
    <>
      {/* Page heading */}
      <h1 className="text-xl font-bold mb-4">Danh sách chuyên khoa</h1>

      {/* Search input field */}
      <div className="relative ml-auto">
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
          placeholder="Tìm kiếm theo tên chuyên khoa..."
          onFocus={() => setInputFocused(true)}
          onBlur={() => setInputFocused(false)}
          className="w-[420px] text-[17px] border-b border-[#ccc] focus:border-primary pl-12 rounded-none shadow-none transition duration-500"
        />
      </div>

      {/* Table displaying specialty data */}
      <div className="relative rounded-md shadow-md overflow-x-auto">
        <Table className="text-[17px]">
          {/* Table header */}
          <TableHeader className="h-12 bg-gray-100">
            <TableRow>
              <TableHead className="font-semibold text-black w-[50px]">STT</TableHead>
              <TableHead className="font-semibold text-black text-start">Ảnh đại diện</TableHead>
              <TableHead className="font-semibold text-black text-start">Tên chuyên khoa</TableHead>
              <TableHead className="font-semibold text-black text-start">Mô tả</TableHead>
              <TableHead className="font-semibold text-black text-start">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          {/* Table body (sample row with specialty data) */}
          <TableBody>
            <TableRow>
              <TableCell className="text-center">1</TableCell>
              <TableCell>Specialty avatar</TableCell>
              <TableCell>Specialty name</TableCell>
              <TableCell>Specialty description</TableCell>
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

export default ManageSpecialties;