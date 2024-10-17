"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

import { cn } from "@/lib/utils";
import { DoctorData } from "@/types/doctor-types";
import { ClinicData } from "@/types/clinic-types";
import { getProvinces } from "@/services/auth-service";
import { SpecialtyData } from "@/types/specialty-types";
import { deleteDoctor, getAllDoctors } from "@/services/doctor-service";
import useDebounce from "@/hooks/use-debounce";

import { FiSearch } from "react-icons/fi";
import { FaLocationDot } from "react-icons/fa6";
import { FaClinicMedical } from "react-icons/fa";
import { AiOutlineDelete } from "react-icons/ai";
import { LuClipboardEdit } from "react-icons/lu";
import { BsClipboard2PlusFill } from "react-icons/bs";

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
import { getAllSpecialties } from "@/services/specialty-service";
import { getAllClinics } from "@/services/clinic-service";

const ManageDoctors = () => {
  const router = useRouter();

  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const [inputFocused, setInputFocused] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  const [provinces, setProvinces] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<DoctorData[]>([]);
  const [clinics, setClinics] = useState<ClinicData[]>([]);
  const [specialties, setSpecialties] = useState<SpecialtyData[]>([]);

  const [selectedClinic, setSelectedClinic] = useState<string>("");
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("");

  const [doctorToDelete, setDoctorToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const { data } = await getProvinces();
        setProvinces(data);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    };
    fetchProvinces();
  }, []);

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const accessToken = Cookies.get("access_token");
        if (!accessToken) return;

        const { specialties } = await getAllSpecialties({ accessToken });
        setSpecialties(specialties);
      } catch (err: any) {
        router.push("/");
        toast.error("Có lỗi xảy ra. Vui lòng thử lại sau ít phút nữa!");
      }
    };
    fetchSpecialties();
  }, []);

  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const accessToken = Cookies.get("access_token");
        if (!accessToken) return;

        const { clinics } = await getAllClinics({ accessToken });
        setClinics(clinics);
      } catch (err: any) {
        router.push("/");
        toast.error("Có lỗi xảy ra. Vui lòng thử lại sau ít phút nữa!");
      }
    };
    fetchClinics();
  }, []);

  const fetchDoctors = async (
    page: number,
    query: string,
    clinic?: string,
    province?: string,
    specialty?: string
  ) => {
    try {
      setIsLoading(true);
      const accessToken = Cookies.get("access_token");
      if (!accessToken) return;

      const { doctors, total } = await getAllDoctors({
        accessToken, page, limit: 10, query, clinic, province, specialty
      });

      setDoctors(doctors);

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
    fetchDoctors(currentPage, debouncedSearchQuery, selectedClinic, selectedProvince, selectedSpecialty);
  }, [currentPage, debouncedSearchQuery, selectedProvince, selectedSpecialty, selectedClinic]);

  const handleDeleteDoctor = async () => {
    try {
      setIsDeleting(true);
      if (!doctorToDelete) return;

      const accessToken = Cookies.get("access_token");
      if (!accessToken) return;

      await deleteDoctor({ accessToken, id: doctorToDelete });
      await fetchDoctors(currentPage, debouncedSearchQuery);

      if (currentPage > 1 && doctors?.length === 1) {
        setCurrentPage(1);
      }

      setModalOpen(false);
      toast.success("Xóa bác sĩ thành công!");
    } catch (err: any) {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại sau ít phút nữa!");
      router.push("/");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <h1 className="text-xl font-bold mb-4">Danh sách bác sĩ</h1>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
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

          <Select onValueChange={(value) => setSelectedSpecialty(value)}>
            <SelectTrigger className="w-[220px] p-3 border-none shadow-none">
              <div className="flex items-center gap-3">
                <BsClipboard2PlusFill className="size-5 text-[#1c3f66]" />
                <SelectValue placeholder="Chọn chuyên khoa" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>

              {specialties?.map((specialty) => (
                <SelectItem key={specialty?._id} value={specialty?._id}>
                  {specialty?.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={(value) => setSelectedClinic(value)}>
            <SelectTrigger className="w-[220px] p-3 border-none shadow-none">
              <div className="flex items-center gap-3">
                <FaClinicMedical className="size-5 text-[#1c3f66]" />
                <SelectValue placeholder="Chọn bệnh viện" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>

              {clinics?.map((clinic) => (
                <SelectItem key={clinic?._id} value={clinic?._id}>
                  {clinic?.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

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
            placeholder="Tìm kiếm theo tên bác sĩ..."
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-[420px] text-[17px] border-b border-[#ccc] focus:border-primary pl-12 rounded-none shadow-none transition duration-500"
          />
        </div>
      </div>

      {isLoading ? (
        <Spinner table />
      ) : (
        <>
          <div
            className={
              cn(
                "relative rounded-md shadow-md overflow-x-auto",
                doctors && doctors?.length > 0 ? "h-auto" : "h-full"
              )}
          >
            <Table className="relative h-full text-[17px]">
              <TableHeader className="sticky top-0 left-0 right-0 h-12 bg-gray-100">
                <TableRow>
                  <TableHead className="font-semibold text-black w-[50px]">STT</TableHead>
                  <TableHead className="font-semibold text-black text-start">Họ và tên</TableHead>
                  <TableHead className="font-semibold text-black text-start">Chuyên khoa</TableHead>
                  <TableHead className="font-semibold text-black text-start">Bệnh viện</TableHead>
                  <TableHead className="font-semibold text-black text-start">Tỉnh thành</TableHead>
                  <TableHead className="font-semibold text-black text-start">Hành động</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {doctors?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center align-middle">
                      <span className="flex justify-center items-center h-full">
                        Chưa có bác sĩ nào!
                      </span>
                    </TableCell>
                  </TableRow>
                ) : (
                  doctors?.map((doctor, index) => {
                    const startIndex = (currentPage - 1) * 10;

                    return (
                      <TableRow key={doctor?._id}>
                        <TableCell className="text-center">{startIndex + index + 1}</TableCell>
                        <TableCell>{doctor?.fullname}</TableCell>
                        <TableCell>{doctor?.specialty_id?.name}</TableCell>
                        <TableCell>{doctor?.clinic_id?.name}</TableCell>
                        <TableCell>{doctor?.province}</TableCell>
                        <TableCell className="py-6 px-4">
                          <div className="flex items-center gap-4">
                            <Button
                              type="button"
                              variant="ghost"
                              onClick={() => router.push(`/admin/doctors/edit-doctor/${doctor?._id}`)}
                            >
                              <LuClipboardEdit size="22" />
                            </Button>

                            <Button
                              type="button"
                              variant="ghost"
                              onClick={() => {
                                setDoctorToDelete(doctor?._id);
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
        </>
      )}

      <DeleteConfirmationModal
        isOpen={isModalOpen}
        isDeleting={isDeleting}
        onConfirm={handleDeleteDoctor}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
};

export default ManageDoctors;