import { cn } from "@/lib/utils";
import Link from "next/link";

interface SidebarButtonProps {
  path: string;
  text: string;
  icon: JSX.Element;
  currentPath: string;
};

export const SidebarButton = ({ path, text, icon, currentPath }: SidebarButtonProps) => {
  const normalizedPath = path.replace(/^[/-]+/, "");
  const normalizedCurrentPath = currentPath.replace(/^[/-]+/, "");

  const isActive =
    normalizedCurrentPath === normalizedPath ||
    normalizedCurrentPath.startsWith(normalizedPath + "/");

  return (
    <Link
      href={path}
      className={cn(
        "relative h-16 flex items-center justify-start gap-3 py-4 px-6 hover:bg-white hover:bg-opacity-20 transition duration-500",
        // Add background and a left border if the tab is active
        isActive && "bg-white bg-opacity-20 before:absolute before:top-0 before:left-0 before:w-[3px] before:h-full before:bg-white before:rounded-lg"
      )}
    >
      {icon}
      <p className="text-[17px] font-medium text-white text-ellipsis whitespace-nowrap overflow-hidden">
        {text}
      </p>
    </Link>
  );
};