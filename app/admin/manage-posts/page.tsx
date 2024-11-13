"use client";

import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import { format } from "date-fns";
import Image from "next/image";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

import { FiSearch } from "react-icons/fi";
import { FaUserDoctor } from "react-icons/fa6";
import { AiOutlineDelete } from "react-icons/ai";
import { LuClipboardEdit } from "react-icons/lu";
import { BsClipboard2PlusFill } from "react-icons/bs";

import { PostData } from "@/types/post-types";
import { deletePost, getAllPosts } from "@/services/post-service";

import useDebounce from "@/hooks/use-debounce";
import useDoctors from "@/hooks/fetch/use-doctors";
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
import { DatePicker } from "@/components/ui/date-picker";
import Hint from "@/components/hint";
import Spinner from "@/components/spinner";
import PaginationSection from "@/components/pagination";
import DeleteConfirmationModal from "@/components/delete-confirmation-modal";

const ManagePosts = () => {
  const router = useRouter();

  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [inputFocused, setInputFocused] = useState<boolean>(false);
  const [isLoading, setLoading] = useState({ posts: false, deleting: false });

  const { doctors, isLoading: isLoadingDoctors } = useDoctors(
    "specialty_id, clinic_id, desc, medicalFee, image"
  );
  const { specialties, isLoading: isLoadingSpecialties } = useSpecialties("desc, image");

  const [posts, setPosts] = useState<PostData[]>([]);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);

  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("");

  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const fetchPosts = async (
    page: number, query?: string, doctor_id?: string, specialty_id?: string, date?: Date
  ) => {
    const accessToken = Cookies.get("access_token");
    if (!accessToken) return;

    setLoading({ ...isLoading, posts: true });

    try {
      const { posts, total } = await getAllPosts({
        page,
        limit: 10,
        doctor_id,
        specialty_id,
        query,
        exclude: "desc, image",
        releaseDate: date && format(date, "dd/MM/yyyy")
      });

      const itemsPerPage = 10;
      const totalPages = Math.ceil(total / itemsPerPage);

      setPosts(posts);
      setTotalPages(totalPages);
    } catch (error: any) {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại sau ít phút nữa!");
    } finally {
      setLoading({ ...isLoading, posts: false });
    }
  };

  useEffect(() => {
    fetchPosts(currentPage, debouncedSearchQuery, selectedDoctor, selectedSpecialty, selectedDate);
  }, [currentPage, debouncedSearchQuery, selectedDoctor, selectedSpecialty, selectedDate]);

  const handleDeletePost = async () => {
    if (!postToDelete) return;

    const accessToken = Cookies.get("access_token");
    if (!accessToken) return;

    setLoading({ ...isLoading, deleting: true });

    try {
      await deletePost(accessToken, postToDelete);

      if (currentPage > 1 && posts?.length === 1) {
        setCurrentPage(currentPage - 1);
        await fetchPosts(currentPage - 1);
      } else {
        await fetchPosts(currentPage);
      }

      setModalOpen(false);
      toast.success("Xóa bài viết thành công!");
    } catch (error: any) {
      toast.error("Xóa bài viết thất bại. Vui lòng thử lại sau ít phút nữa!");
    } finally {
      setLoading({ ...isLoading, deleting: false });
    }
  };

  if (isLoading.posts) {
    return <Spinner center />;
  }

  return (
    <>
      <h1 className="text-xl font-bold mb-4">Danh sách bài viết</h1>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
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
                <div className="py-6">
                  <Spinner table />
                </div>
              ) : (
                specialties?.length > 0 ? (
                  <>
                    <SelectItem value="all">Tất cả</SelectItem>
                    {specialties?.map((specialty) => (
                      <SelectItem key={specialty?._id} value={specialty?._id}>
                        {specialty?.name}
                      </SelectItem>
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

          <Select onValueChange={(value) => setSelectedDoctor(value)}>
            <SelectTrigger className="w-[220px] p-3 border-none shadow-none">
              <div className="flex items-center gap-3">
                <FaUserDoctor className="size-5 text-[#1c3f66]" />
                <SelectValue
                  placeholder={
                    selectedDoctor === "all"
                      ? "Tất cả"
                      : selectedDoctor
                        ? doctors.find(doctor => doctor._id === selectedDoctor)?.fullname
                        : "Chọn bác sĩ"
                  }
                />
              </div>
            </SelectTrigger>
            <SelectContent>
              {isLoadingDoctors ? (
                <div className="py-6">
                  <Spinner table />
                </div>
              ) : (
                doctors?.length > 0 ? (
                  <>
                    <SelectItem value="all">Tất cả</SelectItem>
                    {doctors?.map((doctor) => (
                      <SelectItem key={doctor?._id} value={doctor?._id}>
                        {doctor?.fullname}
                      </SelectItem>
                    ))}
                  </>
                ) : (
                  <p className="text-sm font-medium text-[#595959] text-center py-4 px-2 mx-auto">
                    Không tìm thấy bác sĩ nào!
                  </p>
                )
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-6">
          <DatePicker
            selectedDate={selectedDate}
            placeholder="Chọn ngày đăng"
            setSelectedDate={setSelectedDate}
            className={cn("h-12", selectedDate ? "w-fit" : "w-[240px]")}
          />

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
              placeholder="Tìm kiếm theo tên bài viết..."
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-[420px] h-12 pl-12"
            />
          </div>
        </div>
      </div>

      <div className={cn(
        "relative rounded-md shadow-md overflow-x-auto",
        posts?.length > 0 ? "h-auto" : "h-full"
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
            {posts?.length > 0 ? (
              posts?.map((post, index) => {
                const startIndex = (currentPage - 1) * 10;

                return (
                  <TableRow key={post?._id}>
                    <TableCell className="text-center">{startIndex + index + 1}</TableCell>
                    <TableCell>{post?.title}</TableCell>
                    <TableCell className="min-w-[200px]">
                      <Hint
                        customBg="bg-[#f8f9fc] shadow-lg"
                        content={
                          <div className="flex items-center gap-3 p-2">
                            <Image
                              src={post?.doctor_id?.image}
                              alt="Doctor Avatar"
                              width={45}
                              height={45}
                              className="rounded-full"
                            />
                            <p className="text-base text-black">{post?.doctor_id?.fullname}</p>
                          </div>
                        }
                      >
                        <p>{post?.doctor_id?.fullname}</p>
                      </Hint>
                    </TableCell>
                    <TableCell className="min-w-[200px]">{post?.specialty_id?.name}</TableCell>
                    <TableCell>{post?.releaseDate}</TableCell>
                    <TableCell className="py-6 px-4">
                      <div className="flex items-center gap-4">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => router.replace(`/admin/manage-posts/edit-post/${btoa(post?._id)}`)}
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
                            setPostToDelete(post?._id);
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
                <TableCell colSpan={6} className="text-center align-middle">
                  <span className="flex justify-center items-center h-full">
                    Không tìm thấy bài viết nào!
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
        onConfirm={handleDeletePost}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
};

export default ManagePosts;