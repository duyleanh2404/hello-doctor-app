"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

import { FiSearch } from "react-icons/fi";
import { FaLocationDot } from "react-icons/fa6";
import { AiOutlineDelete } from "react-icons/ai";
import { LuClipboardEdit } from "react-icons/lu";

import { cn } from "@/lib/utils";
import { ClinicData } from "@/types/clinic-types";
import { getProvinces } from "@/services/auth-service";
import { deleteClinic, getAllClinics } from "@/services/clinic-service";
import useDebounce from "@/hooks/use-debounce";

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
import Spinner from "@/components/spinner";
import PaginationSection from "@/components/pagination";
import DeleteConfirmationModal from "@/components/delete-confirmation-modal";

const ManageClinics = () => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [inputFocused, setInputFocused] = useState<boolean>(false);

  const [provinces, setProvinces] = useState<any[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<string>("");

  const [clinics, setClinics] = useState<ClinicData[]>([]);
  const [clinicToDelete, setClinicToDelete] = useState<string | null>(null);

  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const { data } = await getProvinces();
        setProvinces(data);
      } catch (err: any) {
        router.push("/");
        toast.error("Có lỗi xảy ra. Vui lòng thử lại sau ít phút nữa!");
      }
    };
    fetchProvinces();
  }, []);

  const fetchClinics = async (page: number, query: string) => {
    try {
      setIsLoading(true);
      const accessToken = Cookies.get("access_token");
      if (!accessToken) return;

      const { clinics, total } = await getAllClinics({
        accessToken, page, limit: 10, query, province: selectedProvince
      });

      setClinics(clinics);

      const itemsPerPage = 10;
      const totalPages = Math.ceil(total / itemsPerPage);

      setTotalPages(totalPages);
    } catch (err: any) {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại sau ít phút nữa!");
      router.push("/");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClinics(currentPage, debouncedSearchQuery);
  }, [currentPage, debouncedSearchQuery, selectedProvince]);

  const handleDeleteClinic = async () => {
    try {
      setIsDeleting(true);
      if (!clinicToDelete) return;

      const accessToken = Cookies.get("access_token");
      if (!accessToken) return;

      await deleteClinic({ accessToken, id: clinicToDelete });
      await fetchClinics(currentPage, debouncedSearchQuery);

      if (currentPage > 1 && clinics.length === 1) {
        setCurrentPage(1);
      }

      setModalOpen(false);
      toast.success("Xóa bệnh viện thành công!");
    } catch (err: any) {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại sau ít phút nữa!");
      router.push("/");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <h1 className="text-xl font-bold mb-4">Danh sách bệnh viện</h1>
      <div className="flex items-center justify-between">
        <Select onValueChange={(value) => setSelectedProvince(value)}>
          <SelectTrigger className="w-[220px] p-3 border-none shadow-none">
            <div className="flex items-center gap-3">
              <FaLocationDot className="size-5 text-[#1c3f66]" />
              <SelectValue placeholder="Chọn tỉnh thành" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>

            {provinces?.map((item) => (
              <SelectItem key={item?.id} value={item?.name}>
                {item?.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="relative">
          <FiSearch
            size="22"
            className={cn(
              "absolute left-2 top-1/2 -translate-y-1/2 transition duration-500",
              inputFocused ? "text-primary" : "text-gray-500"
            )}
          />

          <Input
            type="text"
            spellCheck={false}
            placeholder="Tìm kiếm theo tên bệnh viện..."
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-[420px] text-[17px] border-b border-gray-300 focus:border-primary pl-12 rounded-none shadow-none transition duration-500"
          />
        </div>
      </div>

      {isLoading ? (
        <Spinner table />
      ) : (
        <>
          <div
            className={cn(
              "relative rounded-md shadow-md overflow-x-auto",
              clinics && clinics.length > 0 ? "h-auto" : "h-full"
            )}
          >
            <Table className="relative h-full text-[17px]">
              <TableHeader className="sticky top-0 left-0 right-0 h-12 bg-gray-100">
                <TableRow>
                  <TableHead className="font-semibold text-black w-[50px]">STT</TableHead>
                  <TableHead className="font-semibold text-black text-start">Tên bệnh viện</TableHead>
                  <TableHead className="font-semibold text-black text-start">Địa chỉ</TableHead>
                  <TableHead className="font-semibold text-black text-start">Mô tả</TableHead>
                  <TableHead className="font-semibold text-black text-start">Hành động</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {clinics.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center align-middle">
                      <span className="flex justify-center items-center h-full">
                        Chưa có chuyên khoa nào!
                      </span>
                    </TableCell>
                  </TableRow>
                ) : (
                  clinics.map((clinic, index) => {
                    const startIndex = (currentPage - 1) * 10;

                    return (
                      <TableRow key={clinic?._id}>
                        <TableCell className="text-center">{startIndex + index + 1}</TableCell>
                        <TableCell>{clinic?.name}</TableCell>
                        <TableCell>{clinic?.address}</TableCell>
                        <TableCell dangerouslySetInnerHTML={{ __html: clinic.desc }} />
                        <TableCell className="py-6 px-4">
                          <div className="flex items-center gap-4">
                            <Button
                              type="button"
                              variant="ghost"
                              onClick={() => router.push(`/admin/clinics/edit-clinic/${clinic?._id}`)}
                            >
                              <LuClipboardEdit size="22" />
                            </Button>

                            <Button
                              type="button"
                              variant="ghost"
                              onClick={() => {
                                setClinicToDelete(clinic?._id);
                                setModalOpen(true);
                              }}
                            >
                              <AiOutlineDelete size="22" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="ml-auto">
              <PaginationSection
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </>
      )}

      <DeleteConfirmationModal
        isOpen={isModalOpen}
        isDeleting={isDeleting}
        onConfirm={handleDeleteClinic}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
};

export default ManageClinics;