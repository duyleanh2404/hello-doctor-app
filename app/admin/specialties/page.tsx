"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

import { FiSearch } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import { LuClipboardEdit } from "react-icons/lu";

import { cn } from "@/lib/utils";
import { SpecialtyData } from "@/types/specialty-types";
import { getAllSpecialties, deleteSpecialty } from "@/services/specialty-service";
import useDebounce from "@/hooks/use-debounce";

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
import DeleteConfirmationModal from "@/components/delete-confirmation-modal";

const ManageSpecialties = () => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [inputFocused, setInputFocused] = useState<boolean>(false);

  const [specialties, setSpecialties] = useState<SpecialtyData[]>([]);
  const [specialtyToDelete, setSpecialtyToDelete] = useState<string | null>(null);

  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const fetchSpecialties = async (page: number, query: string) => {
    try {
      setIsLoading(true);
      const accessToken = Cookies.get("access_token");
      if (!accessToken) return;

      const { specialties, total } = await getAllSpecialties({
        accessToken, page, limit: 10, query
      });

      setSpecialties(specialties);

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
    fetchSpecialties(currentPage, debouncedSearchQuery);
  }, [currentPage, debouncedSearchQuery]);

  const handleDeleteSpecialty = async () => {
    try {
      setIsDeleting(true);
      if (!specialtyToDelete) return;

      const accessToken = Cookies.get("access_token");
      if (!accessToken) return;

      await deleteSpecialty({ accessToken, id: specialtyToDelete });
      await fetchSpecialties(currentPage, debouncedSearchQuery);

      if (currentPage > 1 && specialties.length === 1) {
        setCurrentPage(1);
      }

      setModalOpen(false);
      toast.success("Xóa chuyên khoa thành công!");
    } catch (err: any) {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại sau ít phút nữa!");
      router.push("/");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <h1 className="text-xl font-bold mb-4">Danh sách chuyên khoa</h1>
      <div className="relative ml-auto">
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
          placeholder="Tìm kiếm theo tên chuyên khoa..."
          onFocus={() => setInputFocused(true)}
          onBlur={() => setInputFocused(false)}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-[420px] text-[17px] border-b border-[#ccc] focus:border-primary pl-12 rounded-none shadow-none transition duration-500"
        />
      </div>

      {isLoading ? (
        <div className="h-full flex flex-col items-center justify-center gap-8">
          <div className="border-t-4 border-primary border-solid rounded-full w-10 h-10 animate-spin" />
          <p>Đang tải...</p>
        </div>
      ) : (
        <>
          <div
            className={cn(
              "relative rounded-md shadow-md overflow-x-auto",
              specialties && specialties.length > 0 ? "h-auto" : "h-full"
            )}
          >
            <Table className="h-full text-[17px]">
              <TableHeader className="h-12 bg-gray-100 sticky top-0 z-10">
                <TableRow>
                  <TableHead className="font-semibold text-black w-[50px]">STT</TableHead>
                  <TableHead className="font-semibold text-black text-start">Ảnh đại diện</TableHead>
                  <TableHead className="font-semibold text-black text-start">Tên chuyên khoa</TableHead>
                  <TableHead className="font-semibold text-black text-start">Mô tả</TableHead>
                  <TableHead className="font-semibold text-black text-start">Hành động</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {specialties.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center align-middle">
                      <span className="flex justify-center items-center h-full">
                        Chưa có chuyên khoa nào!
                      </span>
                    </TableCell>
                  </TableRow>
                ) : (
                  specialties.map((specialty, index) => {
                    const startIndex = (currentPage - 1) * 10;

                    return (
                      <TableRow key={specialty?._id}>
                        <TableCell className="text-center">{startIndex + index + 1}</TableCell>
                        <TableCell>
                          <Image
                            src={specialty?.image}
                            alt="Specialty Avatar"
                            width={50}
                            height={50}
                            className="object-cover rounded-md"
                          />
                        </TableCell>
                        <TableCell>{specialty?.name}</TableCell>
                        <TableCell dangerouslySetInnerHTML={{ __html: specialty.desc }} />
                        <TableCell className="py-6 px-4">
                          <div className="flex items-center gap-4">
                            <Button
                              type="button"
                              variant="ghost"
                              onClick={() => router.push(`/admin/specialties/edit-specialty/${specialty?._id}`)}
                            >
                              <LuClipboardEdit size="22" />
                            </Button>

                            <Button
                              type="button"
                              variant="ghost"
                              onClick={() => {
                                setSpecialtyToDelete(specialty?._id);
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
        onConfirm={handleDeleteSpecialty}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
};

export default ManageSpecialties;