import { cn } from "@/lib/utils";
import { FaPlus } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

import Link from "next/link";
import Hint from "@/components/hint";

interface SidebarButtonProps {
  path: string;
  text: string;
  icon: JSX.Element;
  currentPath: string;
};

export const SidebarButton = ({ path, text, icon, currentPath }: SidebarButtonProps) => {
  const router = useRouter();

  const normalizedPath = path.replace(/^[/-]+/, "");
  const normalizedCurrentPath = currentPath.replace(/^[/-]+/, "");

  const isActive =
    normalizedCurrentPath === normalizedPath ||
    normalizedCurrentPath.startsWith(normalizedPath + "/");

  const handleAddDoctorClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push("/admin/doctors/add-new-doctor");
  };

  const handleAddSpecialtiesClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push("/admin/specialties/create-new-specialty");
  };

  return (
    <Link
      href={path}
      className={cn(
        "group relative h-16 flex items-center justify-between py-4 px-6 hover:bg-white hover:bg-opacity-20 transition duration-500",
        // Add background and a left border if the tab is active
        isActive && "bg-white bg-opacity-20 before:absolute before:top-0 before:left-0 before:w-[3px] before:h-full before:bg-white before:rounded-lg"
      )}
    >
      <div className="flex items-center gap-3">
        {icon}
        <p className="text-[17px] font-medium text-white text-ellipsis whitespace-nowrap overflow-hidden">
          {text}
        </p>
      </div>
      {path === "/admin/doctors" && (
        <Hint label="Đăng ký tài khoản mới cho bác sĩ">
          <Button
            type="button"
            variant="ghost"
            onClick={handleAddDoctorClick}
            className="h-0 py-4 px-0 bg-transparent hover:bg-transparent"
          >
            <FaPlus className="size-4 text-white hover:text-white/80 opacity-0 group-hover:opacity-100 transition duration-500" />
          </Button>
        </Hint>
      )}

      {path === "/admin/specialties" && (
        <Hint label="Thêm chuyên khoa mới">
          <Button
            type="button"
            variant="ghost"
            onClick={handleAddSpecialtiesClick}
            className="h-0 py-4 px-0 bg-transparent hover:bg-transparent"
          >
            <FaPlus className="size-4 text-white hover:text-white/80 opacity-0 group-hover:opacity-100 transition duration-500" />
          </Button>
        </Hint>
      )}
    </Link>
  );
};