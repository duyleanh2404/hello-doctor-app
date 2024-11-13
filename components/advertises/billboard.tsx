import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import Image from "next/image";

import { IoClose } from "react-icons/io5";

import { Button } from "@/components/ui/button";

const advertises = [
  { src: "/advertise/advertise-8.png", alt: "Advertise 1" },
  { src: "/advertise/advertise-9.png", alt: "Advertise 2" },
  { src: "/advertise/advertise-10.png", alt: "Advertise 3" }
];

const Billboard = () => {
  const [isOpen, setOpen] = useState<boolean>(true);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % advertises.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={cn(
        "hidden md:block fixed bottom-0 left-1/2 -translate-x-1/2 w-full lg:w-[80%] xl:w-1/2 bg-white shadow-md transition-opacity duration-500 z-10",
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}
    >
      <div className="flex flex-col items-center mx-auto">
        <div className="flex items-center gap-3 py-2 px-4">
          <Image
            loading="lazy"
            src="/advertise/advertise-icon.svg"
            alt="Advertise Icon"
            width={22}
            height={22}
          />
          <p className="font-medium">Quảng cáo</p>
        </div>

        <div className="relative w-full h-[90px]">
          <Image
            loading="lazy"
            src={advertises[currentImageIndex].src}
            alt={advertises[currentImageIndex].alt}
            fill
            className="object-cover"
          />
        </div>
      </div>

      <Button
        type="button"
        variant="ghost"
        onClick={() => setOpen(false)}
        className="h-0 absolute top-2 right-2 text-white hover:text-white p-[14px] bg-[#BFBFBF] hover:bg-[#BFBFBF]/80 rounded-full"
      >
        <IoClose
          size={20}
          className="absolute top-1/2 left-[52%] -translate-y-1/2 -translate-x-1/2"
        />
      </Button>
    </div>
  );
};

export default Billboard;