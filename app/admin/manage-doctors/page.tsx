"use client";

import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";

import { FiSearch } from "react-icons/fi";
import { FaLocationDot } from "react-icons/fa6";
import { FaClinicMedical } from "react-icons/fa";
import { AiOutlineDelete } from "react-icons/ai";
import { LuClipboardEdit } from "react-icons/lu";
import { BsClipboard2PlusFill } from "react-icons/bs";

import Cookies from "js-cookie";
import toast from "react-hot-toast";

import { DoctorData } from "@/types/doctor-types";
import { deleteDoctor, getAllDoctors } from "@/services/doctor-service";

import useDebounce from "@/hooks/use-debounce";
import useClinics from "@/hooks/fetch/use clinics";
import useProvinces from "@/hooks/fetch/use-provinces";
import useSpecialties from "@/hooks/fetch/use-specialties";

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
import Hint from "@/components/hint";
import Spinner from "@/components/spinner";
import PaginationSection from "@/components/pagination";
import DeleteConfirmationModal from "@/components/delete-confirmation-modal";

const ManageDoctors = () => {
  const router = useRouter();

  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [inputFocused, setInputFocused] = useState<boolean>(false);
  const [isLoading, setLoading] = useState({ doctors: false, deleting: false });

  const provinces: any[] = useProvinces();
  const { specialties, isLoading: isLoadingSpecialties } = useSpecialties("desc, image");
  const { clinics, isLoading: isLoadingClinics } = useClinics("desc, address, avatar, banner");

  const [doctors, setDoctors] = useState<DoctorData[]>([]);
  const [doctorToDelete, setDoctorToDelete] = useState<string | null>(null);

  const [selectedClinic, setSelectedClinic] = useState<string>("");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("");
  const [selectedProvince, setSelectedProvince] = useState<string>("all");

  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const fetchDoctors = async (
    page: number, query?: string, clinic_id?: string, specialty_id?: string, province?: string
  ) => {
    setLoading({ ...isLoading, doctors: true });

    try {
      const { doctors, total } = await getAllDoctors({
        page, limit: 10, query, clinic_id, specialty_id, exclude: "desc", province
      });
      handleDoctorsFetchSuccess(doctors, total);
    } catch (error: any) {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại sau ít phút nữa!");
    } finally {
      setLoading({ ...isLoading, doctors: false });
    }
  };

  const handleDoctorsFetchSuccess = (doctors: DoctorData[], total: number) => {
    const itemsPerPage = 10;
    const totalPages = Math.ceil(total / itemsPerPage);
    setDoctors(doctors);
    setTotalPages(totalPages);
  };

  useEffect(() => {
    fetchDoctors(currentPage, debouncedSearchQuery, selectedClinic, selectedSpecialty, selectedProvince);
  }, [currentPage, debouncedSearchQuery, selectedClinic, selectedSpecialty, selectedProvince]);

  const handleDeleteDoctor = async () => {
    const accessToken = Cookies.get("access_token");
    if (!accessToken || !doctorToDelete) return;
    setLoading({ ...isLoading, deleting: true });

    try {
      await deleteDoctor(accessToken, doctorToDelete);
      await handlePrefetchingDoctors();
      setModalOpen(false);
      toast.success("Xóa bác sĩ thành công!");
    } catch (error: any) {
      toast.error("Xóa bác sĩ thất bại. Vui lòng thử lại sau ít phút nữa!");
    } finally {
      setLoading({ ...isLoading, deleting: false });
    }
  };

  const handlePrefetchingDoctors = async () => {
    if (currentPage > 1 && doctors?.length === 1) {
      setCurrentPage(currentPage - 1);
      await fetchDoctors(currentPage - 1);
    } else {
      await fetchDoctors(currentPage);
    }
  };

  if (isLoading.doctors) {
    return <Spinner center />;
  }

  return (
    <>
      <h1 className="text-xl font-bold mb-4">Danh sách bác sĩ</h1>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Select onValueChange={(value) => setSelectedProvince(value)}>
            <SelectTrigger className="w-[220px] p-3 border-none shadow-none">
              <div className="flex items-center gap-3">
                <FaLocationDot className="size-5 text-[#1c3f66]" />
                <SelectValue placeholder={selectedProvince === "all" ? "Tất cả" : selectedProvince || "Chọn tỉnh thành"} />
              </div>
            </SelectTrigger>
            <SelectContent>
              {provinces?.length > 0 ? (
                <>
                  <SelectItem value="all">Tất cả</SelectItem>
                  {provinces?.map((province) => (
                    <SelectItem key={province?.id} value={province?.name}>{province?.name}</SelectItem>
                  ))}
                </>
              ) : (
                <p className="text-sm font-medium text-[#595959] text-center py-4 px-2 mx-auto">
                  Không tìm thấy tỉnh thành nào!
                </p>
              )}
            </SelectContent>
          </Select>

          <Select onValueChange={(value) => setSelectedSpecialty(value)}>
            <SelectTrigger className="w-[220px] p-3 border-none shadow-none">
              <div className="flex items-center gap-3">
                <BsClipboard2PlusFill className="size-5 text-[#1c3f66]" />
                <SelectValue
                  placeholder={
                    selectedSpecialty === "all"
                      ? "Tất cả"
                      : selectedSpecialty
                        ? specialties.find(specialty => specialty._id === selectedSpecialty)?.name
                        : "Chọn chuyên khoa"
                  }
                />
              </div>
            </SelectTrigger>
            <SelectContent>
              {isLoadingSpecialties ? (
                <div className="py-6"><Spinner table /></div>
              ) : (
                specialties?.length > 0 ? (
                  <>
                    <SelectItem value="all">Tất cả</SelectItem>
                    {specialties?.map((specialty) => (
                      <SelectItem key={specialty?._id} value={specialty?._id}>{specialty?.name}</SelectItem>
                    ))}
                  </>
                ) : (
                  <p className="text-sm font-medium text-[#595959] text-center py-4 px-2 mx-auto">
                    Không tìm thấy chuyên khoa nào!
                  </p>
                )
              )}
            </SelectContent>
          </Select>

          <Select onValueChange={(value) => setSelectedClinic(value)}>
            <SelectTrigger className="w-[220px] p-3 border-none shadow-none">
              <div className="flex items-center gap-3">
                <FaClinicMedical className="size-5 text-[#1c3f66]" />
                <SelectValue
                  placeholder={
                    selectedClinic === "all"
                      ? "Tất cả"
                      : selectedClinic
                        ? clinics.find(clinic => clinic._id === selectedClinic)?.name
                        : "Chọn bệnh viện"
                  }
                />
              </div>
            </SelectTrigger>
            <SelectContent>
              {isLoadingClinics ? (
                <div className="py-6"><Spinner table /></div>
              ) : (
                clinics?.length > 0 ? (
                  <>
                    <SelectItem value="all">Tất cả</SelectItem>
                    {clinics?.map((clinic) => (
                      <SelectItem key={clinic?._id} value={clinic?._id}>{clinic?.name}</SelectItem>
                    ))}
                  </>
                ) : (
                  <p className="text-sm font-medium text-[#595959] text-center py-4 px-2 mx-auto">
                    Không tìm thấy bệnh viện nào!
                  </p>
                )
              )}
            </SelectContent>
          </Select>
        </div>

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
            placeholder="Tìm kiếm theo tên bác sĩ..."
            onChange={(event) => setSearchQuery(event.target.value)}
            className="w-[420px] h-12 pl-12"
          />
        </div>
      </div>

      <div className={cn(
        "relative rounded-md shadow-md overflow-y-auto",
        doctors?.length > 0 ? "h-auto" : "h-full"
      )}>
        <Table className="relative h-full text-[17px]">
          <TableHeader className="sticky top-0 left-0 right-0 h-12 bg-gray-100">
            <TableRow>
              <TableHead className="font-semibold text-black w-[50px]">STT</TableHead>
              <TableHead className="font-semibold text-black text-start">Ảnh đại diện</TableHead>
              <TableHead className="font-semibold text-black text-start">Họ và tên</TableHead>
              <TableHead className="font-semibold text-black text-start">Chuyên khoa</TableHead>
              <TableHead className="font-semibold text-black text-start">Bệnh viện</TableHead>
              <TableHead className="font-semibold text-black text-start">Hành động</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {doctors?.length > 0 ? (
              doctors?.map((doctor, index) => {
                const startIndex = (currentPage - 1) * 10;

                return (
                  <TableRow key={doctor?._id}>
                    <TableCell className="text-center w-[40px]">{startIndex + index + 1}</TableCell>
                    <TableCell className="w-[140px]">
                      <Image
                        src={doctor?.image || ""}
                        alt="Doctor Avatar"
                        width={60}
                        height={60}
                        className="object-cover rounded-md"
                      />
                    </TableCell>
                    <TableCell className="w-[200px]">{doctor?.fullname}</TableCell>
                    <TableCell className="w-[200px]">{doctor?.specialty_id?.name}</TableCell>
                    <TableCell className="max-w-[250px] truncate">
                      <Hint label={doctor?.clinic_id?.address}>
                        <p>{doctor?.clinic_id?.name}</p>
                      </Hint>
                    </TableCell>
                    <TableCell className="w-[100px] py-6 px-4">
                      <div className="flex items-center gap-4">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => router.replace(`/admin/manage-doctors/edit-doctor/${btoa(doctor?._id)}`)}
                          className="group"
                        >
                          <LuClipboardEdit size="22" className="group-hover:text-green-500 transition duration-500" />
                        </Button>

                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => {
                            setModalOpen(true);
                            setDoctorToDelete(doctor?._id);
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
                <TableCell colSpan={7} className="text-center align-middle">
                  <span className="flex justify-center items-center h-full">
                    Không tìm thấy bác sĩ nào!
                  </span>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div >

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
        onConfirm={handleDeleteDoctor}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
};

export default ManageDoctors;