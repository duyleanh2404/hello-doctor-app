"use client";

import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

import { UserData } from "@/types/user-types";
import { getProvinces } from "@/services/auth-service";
import { deleteUser, getAllUsers } from "@/services/user-serivce";
import useDebounce from "@/hooks/use-debounce";

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
import Spinner from "@/components/spinner";
import PaginationSection from "@/components/pagination";
import DeleteConfirmationModal from "@/components/delete-confirmation-modal";

const ManageUsers = () => {
  const router = useRouter();

  const [inputFocused, setInputFocused] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  const [users, setUsers] = useState<UserData[]>([]);
  const [provinces, setProvinces] = useState<any[]>([]);

  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

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

  const fetchUsers = async (page: number, query: string) => {
    try {
      setIsLoading(true);
      const accessToken = Cookies.get("access_token");
      if (!accessToken) return;

      const { users, total } = await getAllUsers({
        accessToken, page, limit: 10, province: selectedProvince, query
      });

      setUsers(users);

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
    fetchUsers(currentPage, debouncedSearchQuery);
  }, [currentPage, debouncedSearchQuery, selectedProvince]);

  const handleDeleteUser = async () => {
    try {
      setIsDeleting(true);
      if (!userToDelete) return;

      const accessToken = Cookies.get("access_token");
      if (!accessToken) return;

      await deleteUser({ accessToken, id: userToDelete });
      await fetchUsers(currentPage, debouncedSearchQuery);

      if (currentPage > 1 && users?.length === 1) {
        setCurrentPage(1);
      }

      setModalOpen(false);
      toast.success("Xóa người dùng thành công!");
    } catch (err: any) {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại sau ít phút nữa!");
      router.push("/");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <h1 className="text-xl font-bold mb-4">Danh sách bệnh nhân</h1>
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

            {provinces?.map((province) => (
              <SelectItem key={province?.id} value={province?.name}>
                {province?.name}
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
            placeholder="Tìm kiếm theo tên người dùng..."
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
                users && users?.length > 0 ? "h-auto" : "h-full"
              )}
          >
            <Table className="relative h-full text-[17px]">
              <TableHeader className="sticky top-0 left-0 right-0 h-12 bg-gray-100">
                <TableRow>
                  <TableHead className="font-semibold text-black w-[50px]">STT</TableHead>
                  <TableHead className="font-semibold text-black text-start">Họ và tên</TableHead>
                  <TableHead className="font-semibold text-black text-start">Ngày sinh</TableHead>
                  <TableHead className="font-semibold text-black text-start">Giới tính</TableHead>
                  <TableHead className="font-semibold text-black text-start">Địa chỉ</TableHead>
                  <TableHead className="font-semibold text-black text-start">Số điện thoại</TableHead>
                  <TableHead className="font-semibold text-black text-start">Hành động</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {users?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center align-middle">
                      <span className="flex justify-center items-center h-full">
                        Chưa có người dùng nào!
                      </span>
                    </TableCell>
                  </TableRow>
                ) : (
                  users?.map((user, index) => {
                    const startIndex = (currentPage - 1) * 10;

                    return (
                      <TableRow key={user?._id}>
                        <TableCell className="text-center">{startIndex + index + 1}</TableCell>
                        <TableCell>{user?.fullname}</TableCell>
                        <TableCell>{user?.dateOfBirth}</TableCell>
                        <TableCell>{user?.gender === "male" ? "Nam" : "Nữ"}</TableCell>
                        <TableCell className="max-w-[280px] overflow-hidden text-ellipsis whitespace-nowrap">
                          {user?.address}
                        </TableCell>
                        <TableCell>{user?.phoneNumber}</TableCell>
                        <TableCell className="max-w-[40px] py-6 px-0">
                          <div className="flex items-center gap-4">
                            <Button
                              type="button"
                              variant="ghost"
                              onClick={() => router.push(`/admin/users/edit-user/${user?._id}`)}
                            >
                              <LuClipboardEdit size="22" />
                            </Button>

                            <Button
                              type="button"
                              variant="ghost"
                              onClick={() => {
                                setUserToDelete(user?._id);
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
        onConfirm={handleDeleteUser}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
};

export default ManageUsers;