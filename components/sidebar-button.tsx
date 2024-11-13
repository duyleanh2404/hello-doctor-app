import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { FaPlus } from "react-icons/fa6";

import { Button } from "@/components/ui/button";
import Hint from "@/components/hint";

interface SidebarButtonProps {
  path: string;
  text: string;
  addPath?: string;
  addLabel?: string;
  icon: JSX.Element;
  currentPath: string;
};

const SidebarButton = ({
  path, text, icon, currentPath, addLabel, addPath
}: SidebarButtonProps) => {
  const router = useRouter();
  const isActive = currentPath.replace(/^[/-]+/, "").startsWith(path.replace(/^[/-]+/, ""));

  const handleAddClick = (event: React.MouseEvent) => {
    event.preventDefault();
    if (addPath) {
      router.replace(addPath);
    }
  };

  return (
    <Link
      href={path}
      className={cn(
        "group relative h-16 flex items-center justify-between py-4 px-6 hover:bg-white hover:bg-opacity-20 transition duration-500",
        isActive && "bg-white bg-opacity-20 before:absolute before:top-0 before:left-0 before:w-[3px] before:h-full before:bg-white before:rounded-lg"
      )}
    >
      <div className="flex items-center gap-3">
        {icon}
        <p className="text-[17px] font-medium text-white text-ellipsis whitespace-nowrap overflow-hidden">
          {text}
        </p>
      </div>

      {addLabel && addPath && (
        <Hint label={addLabel}>
          <Button
            type="button"
            variant="ghost"
            onClick={handleAddClick}
            className="h-0 py-4 px-0 bg-transparent hover:bg-transparent"
          >
            <FaPlus className="size-4 text-white hover:text-white/80 opacity-0 group-hover:opacity-100 transition duration-500" />
          </Button>
        </Hint>
      )}
    </Link>
  );
};

export default SidebarButton;