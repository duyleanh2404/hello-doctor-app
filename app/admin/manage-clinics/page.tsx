"use client";

import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";

import { FiSearch } from "react-icons/fi";
import { FaLocationDot } from "react-icons/fa6";
import { AiOutlineDelete } from "react-icons/ai";
import { LuClipboardEdit } from "react-icons/lu";

import Cookies from "js-cookie";
import toast from "react-hot-toast";

import useDebounce from "@/hooks/use-debounce";
import useProvinces from "@/hooks/fetch/use-provinces";

import { ClinicData } from "@/types/clinic-types";
import { deleteClinic, getAllClinics } from "@/services/clinic-service";

import {
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableHeader
} from "@/components/ui/table";
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/spinner";
import PaginationSection from "@/components/pagination";
import DeleteConfirmationModal from "@/components/delete-confirmation-modal";

const ManageClinics = () => {
  const router = useRouter();

  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [inputFocused, setInputFocused] = useState<boolean>(false);
  const [isLoading, setLoading] = useState({ clinics: false, deleting: false });

  const provinces: any[] = useProvinces();
  const [selectedProvince, setSelectedProvince] = useState<string>("all");

  const [clinics, setClinics] = useState<ClinicData[]>([]);
  const [clinicToDelete, setClinicToDelete] = useState<string | null>(null);

  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const fetchClinics = async (page: number, query?: string, province?: string) => {
    const accessToken = Cookies.get("access_token");
    if (!accessToken) return;

    setLoading({ ...isLoading, clinics: true });

    try {
      const { clinics, total } = await getAllClinics({
        page, limit: 10, query, exclude: "desc, banner", province
      });

      const itemsPerPage = 10;
      const totalPages = Math.ceil(total / itemsPerPage);

      setClinics(clinics);
      setTotalPages(totalPages);
    } catch (error: any) {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại sau ít phút nữa!");
    } finally {
      setLoading({ ...isLoading, clinics: false });
    }
  };

  useEffect(() => {
    fetchClinics(currentPage, debouncedSearchQuery, selectedProvince);
  }, [currentPage, debouncedSearchQuery, selectedProvince]);

  const handleDeleteClinic = async () => {
    if (!clinicToDelete) return;

    const accessToken = Cookies.get("access_token");
    if (!accessToken) return;

    setLoading({ ...isLoading, deleting: true });

    try {
      await deleteClinic(accessToken, clinicToDelete);

      if (currentPage > 1 && clinics?.length === 1) {
        setCurrentPage(currentPage - 1);
        await fetchClinics(currentPage - 1);
      } else {
        await fetchClinics(currentPage);
      }

      setModalOpen(false);
      toast.success("Xóa bệnh viện thành công!");
    } catch (error: any) {
      toast.error("Xóa bệnh viện thất bại. Vui lòng thử lại sau ít phút nữa!");
    } finally {
      setLoading({ ...isLoading, deleting: false });
    }
  };

  if (isLoading.clinics) {
    return <Spinner center />;
  }

  return (
    <>
      <h1 className="text-xl font-bold mb-4">Danh sách bệnh viện</h1>

      <div className="flex items-center justify-between">
        <Select onValueChange={(value) => setSelectedProvince(value)}>
          <SelectTrigger className="w-[220px] p-3 border-none shadow-none">
            <div className="flex items-center gap-3">
              <FaLocationDot className="size-5 text-[#1c3f66]" />
              <SelectValue
                placeholder={selectedProvince === "all" ? "Tất cả" : selectedProvince || "Chọn tỉnh thành"}
              />
            </div>
          </SelectTrigger>
          <SelectContent>
            {provinces?.length > 0 ? (
              <>
                <SelectItem value="all">Tất cả</SelectItem>
                {provinces?.map((province) => (
                  <SelectItem key={province?.id} value={province?.name}>
                    {province?.name}
                  </SelectItem>
                ))}
              </>
            ) : (
              <p className="text-sm font-medium text-[#595959] text-center py-4 px-2 mx-auto">
                Không tìm thấy tỉnh thành nào!
              </p>
            )}
          </SelectContent>
        </Select>

        <div className="relative">
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
            placeholder="Tìm kiếm theo tên bệnh viện/ phòng khám..."
            onChange={(event) => setSearchQuery(event.target.value)}
            className="w-[420px] h-12 pl-12"
          />
        </div>
      </div>

      <div className={cn(
        "relative rounded-md shadow-md overflow-x-auto",
        clinics?.length > 0 ? "h-auto" : "h-full"
      )}>
        <Table className="relative h-full text-[17px]">
          <TableHeader className="sticky top-0 left-0 right-0 h-12 bg-gray-100">
            <TableRow>
              <TableHead className="font-semibold text-black w-[50px]">STT</TableHead>
              <TableHead className="font-semibold text-black text-start">Ảnh đại diện</TableHead>
              <TableHead className="font-semibold text-black text-start">Tên bệnh viện</TableHead>
              <TableHead className="font-semibold text-black text-start">Địa chỉ</TableHead>
              <TableHead className="font-semibold text-black text-start">Hành động</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {clinics?.length > 0 ? (
              clinics?.map((clinic, index) => {
                const startIndex = (currentPage - 1) * 10;

                return (
                  <TableRow key={clinic?._id}>
                    <TableCell className="text-center">{startIndex + index + 1}</TableCell>
                    <TableCell>
                      <Image
                        src={clinic?.avatar}
                        alt="Clinic Avatar"
                        width={100}
                        height={100}
                        className="object-cover rounded-md"
                      />
                    </TableCell>
                    <TableCell>{clinic?.name}</TableCell>
                    <TableCell className="max-w-[370px] py-6">{clinic?.address}</TableCell>
                    <TableCell className="py-6">
                      <div className="flex items-center gap-4">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() =>
                            router.replace(`/admin/manage-clinics/edit-clinic/${btoa(clinic?._id)}`)
                          }
                          className="group"
                        >
                          <LuClipboardEdit
                            size="22"
                            className="group-hover:text-green-500 transition duration-500"
                          />
                        </Button>

                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => {
                            setModalOpen(true);
                            setClinicToDelete(clinic?._id);
                          }}
                          className="group"
                        >
                          <AiOutlineDelete
                            size="22"
                            className="group-hover:text-red-500 transition duration-500"
                          />
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
                    Không tìm thấy bệnh viện nào!
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
        onConfirm={handleDeleteClinic}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
};

export default ManageClinics;