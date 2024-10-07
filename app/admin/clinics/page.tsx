"use client";

import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useProvinces } from "@/api/use-provinces";

import { FiSearch } from "react-icons/fi";
import { FaLocationDot } from "react-icons/fa6";
import { AiOutlineDelete } from "react-icons/ai";
import { LuClipboardEdit } from "react-icons/lu";

import {
  Select,
  SelectItem,
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
import PaginationSection from "@/components/pagination";

const ManageClinics = () => {
  const [inputFocused, setInputFocused] = useState(false);
  const [provinces, setProvinces] = useState<any[]>([]);

  // Fetch provinces data when the component mounts
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const { success, provinces } = await useProvinces();
        if (!success || !provinces) return;

        setProvinces(provinces);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    };

    fetchProvinces();
  }, []);

  return (
    <>
      {/* Page heading */}
      <h1 className="text-xl font-bold mb-4">Danh sách bệnh viện</h1>

      <div className="flex items-center justify-between">
        <Select>
          <SelectTrigger className="w-[220px] p-3 border-none shadow-none">
            <div className="flex items-center gap-3">
              {/* Location icon */}
              <FaLocationDot className="size-5" />
              {/* Placeholder for selected province */}
              <SelectValue placeholder="Chọn tỉnh thành" />
            </div>
          </SelectTrigger>
          <SelectContent>
            {provinces?.map((item) => (
              <SelectItem key={item?.id} value={item?.name}> {/* Dynamically generated options */}
                {item?.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

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
            placeholder="Tìm kiếm theo tên bệnh viện..."
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            className="w-[420px] text-[17px] border-b border-[#ccc] focus:border-primary pl-12 rounded-none shadow-none transition duration-500"
          />
        </div>
      </div>

      {/* Table displaying clinic data */}
      <div className="relative rounded-md shadow-md overflow-x-auto">
        <Table className="text-[17px]">
          {/* Table header */}
          <TableHeader className="h-12 bg-gray-100">
            <TableRow>
              <TableHead className="font-semibold text-black w-[50px]">STT</TableHead>
              <TableHead className="font-semibold text-black text-start">Tên bệnh viện</TableHead>
              <TableHead className="font-semibold text-black text-start">Địa chỉ</TableHead>
              <TableHead className="font-semibold text-black text-start">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          {/* Table body (sample row with clinic data) */}
          <TableBody>
            <TableRow>
              <TableCell className="text-center">1</TableCell>
              <TableCell>Clinic name</TableCell>
              <TableCell>Clinic address</TableCell>
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

export default ManageClinics;