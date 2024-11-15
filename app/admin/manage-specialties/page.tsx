"use client";

import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";

import { FiSearch } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import { LuClipboardEdit } from "react-icons/lu";

import Cookies from "js-cookie";
import toast from "react-hot-toast";

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
import Spinner from "@/components/spinner";
import PaginationSection from "@/components/pagination";
import DeleteConfirmationModal from "@/components/modal/delete-confirmation-modal";

const ManageSpecialties = () => {
  const router = useRouter();

  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [inputFocused, setInputFocused] = useState<boolean>(false);
  const [isLoading, setLoading] = useState({ specialties: false, deleting: false });

  const [specialties, setSpecialties] = useState<SpecialtyData[]>([]);
  const [specialtyToDelete, setSpecialtyToDelete] = useState<string | null>(null);

  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const fetchSpecialties = async (page: number, query?: string) => {
    const accessToken = Cookies.get("access_token");
    if (!accessToken) return;
    setLoading({ ...isLoading, specialties: true });

    try {
      const { specialties, total } = await getAllSpecialties({ page, limit: 10, query });
      handleSpecialtiesFetchSuccess(specialties, total);
    } catch (error: any) {
      console.error(error);
      toast.error("Có lỗi xảy ra. Vui lòng thử lại sau ít phút nữa!");
    } finally {
      setLoading({ ...isLoading, specialties: false });
    }
  };

  const handleSpecialtiesFetchSuccess = (specialties: SpecialtyData[], total: number) => {
    const itemsPerPage = 10;
    const totalPages = Math.ceil(total / itemsPerPage);
    setSpecialties(specialties);
    setTotalPages(totalPages);
  };

  useEffect(() => {
    fetchSpecialties(currentPage, debouncedSearchQuery);
  }, [currentPage, debouncedSearchQuery]);

  const handleDeleteSpecialty = async () => {
    const accessToken = Cookies.get("access_token");
    if (!accessToken || !specialtyToDelete) return;
    setLoading({ ...isLoading, deleting: true });

    try {
      await deleteSpecialty(accessToken, specialtyToDelete);
      await handlePrefetchingSpecialties();
      setModalOpen(false);
      toast.success("Xóa chuyên khoa thành công!");
    } catch (error: any) {
      console.error(error);
      toast.error("Xóa chuyên khoa thất bại. Vui lòng thử lại sau ít phút nữa!");
    } finally {
      setModalOpen(false);
      setLoading({ ...isLoading, deleting: false });
    }
  };

  const handlePrefetchingSpecialties = async () => {
    if (currentPage > 1 && specialties?.length === 1) {
      setCurrentPage(currentPage - 1);
      await fetchSpecialties(currentPage - 1);
    } else {
      await fetchSpecialties(currentPage);
    }
  };

  if (isLoading.specialties) {
    return <Spinner center />;
  }

  return (
    <>
      <h1 className="text-xl font-bold mb-4">Danh sách chuyên khoa</h1>
      <div className="relative ml-auto">
        <FiSearch
          size="22"
          className={cn(
            "absolute left-4 top-1/2 -translate-y-1/2 transition duration-500",
            inputFocused ? "text-primary" : "text-gray-500"
          )}
        />

        <Input
          type="text"
          spellCheck={false}
          value={searchQuery}
          onBlur={() => setInputFocused(false)}
          onFocus={() => setInputFocused(true)}
          placeholder="Tìm kiếm theo tên chuyên khoa..."
          onChange={(event) => setSearchQuery(event.target.value)}
          className="w-[420px] h-12 pl-12"
        />
      </div>

      <div className={cn(
        "relative rounded-md shadow-md overflow-x-auto", specialties?.length > 0 ? "h-auto" : "h-full"
      )}>
        <Table className="relative h-full text-[17px]">
          <TableHeader className="sticky top-0 left-0 right-0 h-12 bg-gray-100">
            <TableRow>
              <TableHead className="font-semibold text-black w-[50px]">STT</TableHead>
              <TableHead className="font-semibold text-black text-start">Ảnh đại diện</TableHead>
              <TableHead className="font-semibold text-black text-start">Tên chuyên khoa</TableHead>
              <TableHead className="font-semibold text-black text-start">Mô tả</TableHead>
              <TableHead className="font-semibold text-black text-start">Hành động</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {specialties?.length > 0 ? (
              specialties?.map((specialty: SpecialtyData, index) => {
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
                    <TableCell className="max-w-[370px] py-6">
                      <span
                        className="line-clamp-3 overflow-hidden text-ellipsis"
                        dangerouslySetInnerHTML={{ __html: specialty.desc }}
                      />
                    </TableCell>
                    <TableCell className="max-w-[40px] py-6">
                      <div className="flex items-center gap-4">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() =>
                            router.replace(`/admin/manage-specialties/edit-specialty/${btoa(specialty?._id)}`)
                          }
                          className="group"
                        >
                          <LuClipboardEdit size="22" className="group-hover:text-green-500 transition duration-500" />
                        </Button>

                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => {
                            setModalOpen(true);
                            setSpecialtyToDelete(specialty?._id);
                          }}
                          className="group"
                        >
                          <AiOutlineDelete size="22" className="group-hover:text-red-500 transition duration-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center align-middle">
                  <span className="flex justify-center items-center h-full">
                    Không tìm thấy chuyên khoa nào!
                  </span>
                </TableCell>
              </TableRow>
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

      <DeleteConfirmationModal
        isOpen={isModalOpen}
        isDeleting={isLoading.deleting}
        onConfirm={handleDeleteSpecialty}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
};

export default ManageSpecialties;