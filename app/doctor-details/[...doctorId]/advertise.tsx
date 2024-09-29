import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import advertises from "@/constants/advertises";

const Advertise = () => {
  const getRandomImage = useCallback(
    () => advertises[Math.floor(Math.random() * advertises.length)], []
  );

  const [imageSrc, setImageSrc] = useState(getRandomImage);

  useEffect(() => {
    const updateImage = () => setImageSrc(getRandomImage());
    const intervalId = setInterval(updateImage, 5000);

    return () => clearInterval(intervalId);
  }, [getRandomImage]);

  return (
    <div className="hidden xl:flex flex-col items-center">
      <div className="flex items-center gap-3">
        <Image
          priority
          src="/advertise-icon.svg"
          alt="Advertise Icon"
          width="20"
          height="20"
          aria-label="Advertise Icon"
        />
        <p className="font-medium text-[#595959]">Quảng cáo</p>
      </div>

      <div className="relative w-full pt-[160%]">
        <Image
          loading="lazy"
          src={imageSrc}
          alt="Advertise Image"
          fill
          className="w-full h-full object-contain p-3 rounded-lg"
        />
      </div>
    </div>
  );
};

export default Advertise;