import { cn } from "@/lib/utils";
import Image from "next/image";

import { Button } from "@/components/ui/button";

interface ProfileTabProps {
  icon: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
};

const ProfileTab = ({ icon, label, onClick, isActive }: ProfileTabProps) => (
  <Button
    type="button"
    variant="ghost"
    onClick={onClick}
    className="flex items-center justify-start gap-3 p-0 sm:p-3 hover:bg-[#e3f2ff] rounded-md transition duration-500"
  >
    <Image
      loading="lazy"
      src={`/my-profile/${icon}`}
      alt={label}
      width="24"
      height="24"
    />
    <p
      className={cn(
        "text-[17px] font-medium transition duration-500",
        isActive ? "text-primary" : "text-black hover:text-primary"
      )}
    >
      {label}
    </p>
  </Button>
);

export default ProfileTab;