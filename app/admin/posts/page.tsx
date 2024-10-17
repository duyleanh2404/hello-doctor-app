"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

import { FiSearch } from "react-icons/fi";
import { FaUserDoctor } from "react-icons/fa6";
import { AiOutlineDelete } from "react-icons/ai";
import { LuClipboardEdit } from "react-icons/lu";
import { BsClipboard2PlusFill } from "react-icons/bs";

import {
  Select,
  SelectValue,
  SelectContent,
  SelectTrigger,
  SelectItem
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
import { PostData } from "@/types/post-types";
import useDebounce from "@/hooks/use-debounce";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { deletePost, getAllPosts } from "@/services/post-service";
import { getAllSpecialties } from "@/services/specialty-service";
import { getAllDoctors } from "@/services/doctor-service";
import { DoctorData } from "@/types/doctor-types";
import { SpecialtyData } from "@/types/specialty-types";
import { format } from "date-fns";
import Spinner from "@/components/spinner";
import DeleteConfirmationModal from "@/components/delete-confirmation-modal";

const ManagePosts = () => {
  const router = useRouter();

  const [inputFocused, setInputFocused] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  const [posts, setPosts] = useState<PostData[]>([]);
  const [provinces, setProvinces] = useState<any[]>([]);

  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  const [postToDelete, setPostToDelete] = useState<string | null>(null);

  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const [doctors, setDoctors] = useState<DoctorData[]>([]);
  const [specialties, setSpecialties] = useState<SpecialtyData[]>([]);

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
    const fetchDoctors = async () => {
      try {
        const accessToken = Cookies.get("access_token");
        if (!accessToken) return;

        const { doctors } = await getAllDoctors({ accessToken });
        setDoctors(doctors);
      } catch (err: any) {
        router.push("/");
        toast.error("Có lỗi xảy ra. Vui lòng thử lại sau ít phút nữa!");
      }
    };
    fetchDoctors();
  }, []);

  const fetchPosts = async (page: number, query: string) => {
    try {
      setIsLoading(true);
      const accessToken = Cookies.get("access_token");
      if (!accessToken) return;

      const { posts, total } = await getAllPosts({
        accessToken,
        page,
        limit: 10,
        query,
        release_date: selectedDate && format(selectedDate, "dd/MM/yyyy"),
        specialty: selectedSpecialty,
        doctor: selectedDoctor
      });

      setPosts(posts);

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
    fetchPosts(currentPage, debouncedSearchQuery);
  }, [currentPage, debouncedSearchQuery, selectedDate, selectedDoctor, selectedSpecialty]);

  const handleDeletePost = async () => {
    try {
      setIsDeleting(true);
      if (!postToDelete) return;

      const accessToken = Cookies.get("access_token");
      if (!accessToken) return;

      await deletePost({ accessToken, id: postToDelete });
      await fetchPosts(currentPage, debouncedSearchQuery);

      if (currentPage > 1 && posts?.length === 1) {
        setCurrentPage(1);
      }

      setModalOpen(false);
      toast.success("Xóa bài viết thành công!");
    } catch (err: any) {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại sau ít phút nữa!");
      router.push("/");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <h1 className="text-xl font-bold mb-4">Danh sách bài viết</h1>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
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

          <Select onValueChange={(value) => setSelectedDoctor(value)}>
            <SelectTrigger className="w-[220px] p-3 border-none shadow-none">
              <div className="flex items-center gap-3">
                <FaUserDoctor className="size-5 text-[#1c3f66]" />
                <SelectValue placeholder="Chọn bác sĩ" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>

              {doctors?.map((doctor) => (
                <SelectItem key={doctor?._id} value={doctor?._id}>
                  {doctor?.fullname}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-6">
          <DatePicker
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            placeholder="Chọn ngày đăng"
            className="h-14 border-t-transparent border-x-transparent hover:bg-transparent shadow-none rounded-none"
          />

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
              placeholder="Tìm kiếm theo tên bài viết..."
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-[420px] text-[17px] border-b border-[#ccc] focus:border-primary pl-12 rounded-none shadow-none transition duration-500"
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <Spinner table />
      ) : (
        <>
          <div className={cn(
            "relative rounded-md shadow-md overflow-x-auto",
            posts && posts?.length > 0 ? "h-auto" : "h-full"
          )}>
            <Table className="relative h-full text-[17px]">
              <TableHeader className="sticky top-0 left-0 right-0 h-12 bg-gray-100">
                <TableRow>
                  <TableHead className="font-semibold text-black w-[50px]">STT</TableHead>
                  <TableHead className="font-semibold text-black text-start">Tên bài viết</TableHead>
                  <TableHead className="font-semibold text-black text-start">Tác giả</TableHead>
                  <TableHead className="font-semibold text-black text-start">Chuyên khoa</TableHead>
                  <TableHead className="font-semibold text-black text-start">Ngày đăng</TableHead>
                  <TableHead className="font-semibold text-black text-start">Hành động</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {posts?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center align-middle">
                      <span className="flex justify-center items-center h-full">
                        Chưa có bài viết nào!
                      </span>
                    </TableCell>
                  </TableRow>
                ) : (
                  posts?.map((post, index) => {
                    const startIndex = (currentPage - 1) * 10;

                    return (
                      <TableRow >
                        <TableCell className="text-center">{startIndex + index + 1}</TableCell>
                        <TableCell>{post?.title}</TableCell>
                        <TableCell>{post?.doctor_id?.fullname}</TableCell>
                        <TableCell>{post?.specialty_id?.name}</TableCell>
                        <TableCell>{post?.release_date}</TableCell>
                        <TableCell className="py-6 px-4">
                          <div className="flex items-center gap-4">
                            <Button
                              type="button"
                              variant="ghost"
                              onClick={() => router.push(`/admin/posts/edit-post/${post?._id}`)}
                            >
                              <LuClipboardEdit size="22" />
                            </Button>

                            <Button
                              type="button"
                              variant="ghost"
                              onClick={() => {
                                setPostToDelete(post?._id);
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
        onConfirm={handleDeletePost}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
};

export default ManagePosts;