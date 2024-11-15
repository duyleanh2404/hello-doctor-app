"use client";

import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import { FiSearch } from "react-icons/fi";
import { FaLocationDot } from "react-icons/fa6";
import { AiOutlineDelete } from "react-icons/ai";
import { LuClipboardEdit } from "react-icons/lu";

import Cookies from "js-cookie";
import toast from "react-hot-toast";

import { Province } from "@/types/auth-types";
import { UserData } from "@/types/user-types";
import { deleteUser, getAllUsers } from "@/services/user-serivce";

import useDebounce from "@/hooks/use-debounce";
import useProvinces from "@/hooks/fetch/use-provinces";

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
import Hint from "@/components/hint";
import Spinner from "@/components/spinner";
import PaginationSection from "@/components/pagination";
import DeleteConfirmationModal from "@/components/modal/delete-confirmation-modal";

const ManageUsers = () => {
  const router = useRouter();

  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [inputFocused, setInputFocused] = useState<boolean>(false);
  const [isLoading, setLoading] = useState({ users: false, deleting: false });

  const provinces: Province[] = useProvinces();
  const [selectedProvince, setSelectedProvince] = useState<string>("");

  const [users, setUsers] = useState<UserData[]>([]);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const fetchUsers = async (page: number, query?: string, province?: string) => {
    const accessToken = Cookies.get("access_token");
    if (!accessToken) return;
    setLoading({ ...isLoading, users: true });

    try {
      const { users, total } = await getAllUsers(accessToken, { page, limit: 10, query, province });
      handleUsersFetchSuccess(users, total);
    } catch (error: any) {
      console.error(error);
      toast.error("Có lỗi xảy ra. Vui lòng thử lại sau ít phút nữa!");
    } finally {
      setLoading({ ...isLoading, users: false });
    }
  };

  const handleUsersFetchSuccess = (users: UserData[], total: number) => {
    const itemsPerPage = 10;
    const totalPages = Math.ceil(total / itemsPerPage);
    setUsers(users);
    setTotalPages(totalPages);
  };

  useEffect(() => {
    fetchUsers(currentPage, debouncedSearchQuery, selectedProvince);
  }, [currentPage, debouncedSearchQuery, selectedProvince]);

  const handleDeleteUser = async () => {
    const accessToken = Cookies.get("access_token");
    if (!accessToken || !userToDelete) return;
    setLoading({ ...isLoading, deleting: true });

    try {
      await deleteUser(accessToken, userToDelete);
      await handlePrefetchingUsers();
      setModalOpen(false);
      toast.success("Xóa người dùng thành công!");
    } catch (error: any) {
      console.error(error);
      toast.error("Xóa người dùng thất bại. Vui lòng thử lại sau ít phút nữa!");
    } finally {
      setModalOpen(false);
      setLoading({ ...isLoading, deleting: false });
    }
  };

  const handlePrefetchingUsers = async () => {
    if (currentPage > 1 && users?.length === 1) {
      setCurrentPage(currentPage - 1);
      await fetchUsers(currentPage - 1);
    } else {
      await fetchUsers(currentPage);
    }
  };

  if (isLoading.users) {
    return <Spinner center />;
  }

  return (
    <>
      <h1 className="text-xl font-bold mb-4">Danh sách bệnh nhân</h1>
      <div className="flex items-center justify-between">
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
                {provinces?.map((province: any) => (
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
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            placeholder="Tìm kiếm theo tên người dùng..."
            onChange={(event) => setSearchQuery(event.target.value)}
            className="w-[420px] h-12 pl-12"
          />
        </div>
      </div >

      <div className={cn(
        "relative rounded-md shadow-md overflow-y-auto", users?.length > 0 ? "h-auto" : "h-full"
      )}>
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
            {users?.length > 0 ? (
              users?.map((user: UserData, index) => {
                const startIndex = (currentPage - 1) * 10;

                return (
                  <TableRow key={user?._id}>
                    <TableCell className="text-center">{startIndex + index + 1}</TableCell>
                    <TableCell>{user?.fullname}</TableCell>
                    <TableCell>{user?.dateOfBirth ? user?.dateOfBirth : "Chưa cập nhật"}</TableCell>
                    <TableCell>{user?.gender ? user?.gender === "male" ? "Nam" : "Nữ" : "Chưa cập nhật"}</TableCell>
                    <TableCell className="max-w-[220px]">
                      <Hint label={user?.address ? user?.address : "Chưa cập nhật"}>
                        <p className="overflow-hidden text-ellipsis whitespace-nowrap">
                          {user?.address ? user?.address : "Chưa cập nhật"}
                        </p>
                      </Hint>
                    </TableCell>
                    <TableCell>{user?.phoneNumber ? user?.phoneNumber : "Chưa cập nhật"}</TableCell>
                    <TableCell className="max-w-[40px] py-6">
                      <div className="flex items-center gap-4">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => router.replace(`/admin/manage-users/edit-user/${btoa(user?._id)}`)}
                          className="group"
                        >
                          <LuClipboardEdit size="22" className="group-hover:text-green-500 transition duration-500" />
                        </Button>

                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => {
                            setModalOpen(true);
                            setUserToDelete(user?._id);
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
                    Không tìm thấy người dùng nào!
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
      )
      }

      <DeleteConfirmationModal
        isOpen={isModalOpen}
        isDeleting={isLoading.deleting}
        onConfirm={handleDeleteUser}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
};

export default ManageUsers;