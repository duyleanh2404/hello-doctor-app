"use client";

import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import { format } from "date-fns";
import { jwtDecode, JwtPayload } from "jwt-decode";
import Image from "next/image";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

import { FiSearch } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import { LuClipboardEdit } from "react-icons/lu";

import { PostData } from "@/types/post-types";
import { deletePost, getAllPosts } from "@/services/post-service";
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
import { DatePicker } from "@/components/ui/date-picker";
import Hint from "@/components/hint";
import Spinner from "@/components/spinner";
import PaginationSection from "@/components/pagination";
import DeleteConfirmationModal from "@/components/modal/delete-confirmation-modal";

const ManagePosts = () => {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [inputFocused, setInputFocused] = useState<boolean>(false);
  const [isLoading, setLoading] = useState({ posts: false, deleting: false });

  const [posts, setPosts] = useState<PostData[]>([]);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);

  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const fetchPosts = async (page: number, query?: string, date?: Date) => {
    const accessToken = Cookies.get("access_token");
    if (!accessToken) return;

    const decodedToken: any = jwtDecode<JwtPayload>(accessToken);
    if (!decodedToken) return;
    setLoading({ ...isLoading, posts: true });

    try {
      const { posts, total } = await getAllPosts({
        page,
        limit: 10,
        query,
        doctor_id: decodedToken.doctor_id,
        exclude: "desc, image",
        releaseDate: date && format(date, "dd/MM/yyyy")
      });
      handlePostsFetchSuccess(posts, total);
    } catch (error: any) {
      console.error(error);
      toast.error("Có lỗi xảy ra. Vui lòng thử lại sau ít phút nữa!");
    } finally {
      setLoading({ ...isLoading, posts: false });
    }
  };

  const handlePostsFetchSuccess = (posts: PostData[], total: number) => {
    const itemsPerPage = 10;
    const totalPages = Math.ceil(total / itemsPerPage);
    setPosts(posts);
    setTotalPages(totalPages);
  };

  useEffect(() => {
    fetchPosts(currentPage, debouncedSearchQuery, selectedDate);
  }, [currentPage, debouncedSearchQuery, selectedDate]);

  const handleDeletePost = async () => {
    const accessToken = Cookies.get("access_token");
    if (!accessToken || !postToDelete) return;
    setLoading({ ...isLoading, deleting: true });

    try {
      await deletePost(accessToken, postToDelete);
      await handlePrefetchingPosts();
      setModalOpen(false);
      toast.success("Xóa bài viết thành công!");
    } catch (error: any) {
      console.error(error);
      toast.error("Xóa bài viết thất bại. Vui lòng thử lại sau ít phút nữa!");
    } finally {
      setModalOpen(false);
      setLoading({ ...isLoading, deleting: false });
    }
  };

  const handlePrefetchingPosts = async () => {
    if (currentPage > 1 && posts?.length === 1) {
      setCurrentPage(currentPage - 1);
      await fetchPosts(currentPage - 1);
    } else {
      await fetchPosts(currentPage);
    }
  };

  if (isLoading.posts) {
    return <Spinner center />;
  }

  return (
    <>
      <h1 className="text-xl font-bold mb-4">Danh sách bài viết</h1>
      <div className="flex items-center justify-between">
        <DatePicker
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          placeholder="Chọn ngày"
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

      <div className={cn(
        "relative rounded-md shadow-md overflow-x-auto", posts?.length > 0 ? "h-auto" : "h-full"
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
              posts?.map((post: PostData, index) => {
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
                          onClick={() => router.replace(`/system/manage-posts/edit-post/${btoa(post?._id)}`)}
                          className="group"
                        >
                          <LuClipboardEdit size="22" className="group-hover:text-green-500 transition duration-500" />
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
                          <AiOutlineDelete size="22" className="group-hover:text-red-500 transition duration-500" />
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