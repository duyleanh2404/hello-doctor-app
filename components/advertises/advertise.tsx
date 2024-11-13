import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

const advertises = [
  { src: "/advertise/advertise-1.png", alt: "Advertise 1" },
  { src: "/advertise/advertise-7.png", alt: "Advertise 7" },
  { src: "/advertise/advertise-3.png", alt: "Advertise 3" },
  { src: "/advertise/advertise-4.png", alt: "Advertise 4" },
  { src: "/advertise/advertise-11.png", alt: "Advertise 11" },
  { src: "/advertise/advertise-12.png", alt: "Advertise 12" }
];

const Advertise = () => {
  const getRandomImage = useCallback(() => {
    return advertises[Math.floor(Math.random() * advertises.length)];
  }, []);

  const [image, setImage] = useState(getRandomImage());

  useEffect(() => {
    const updateImage = () => setImage(getRandomImage());
    const intervalId = setInterval(updateImage, 5000);

    return () => clearInterval(intervalId);
  }, [getRandomImage]);

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-3">
        <Image
          priority
          src="/advertise-icon.svg"
          alt="Advertise Icon"
          width={20}
          height={20}
        />
        <p className="font-medium text-[#595959]">Quảng cáo</p>
      </div>

      <div className="relative w-full pt-[160%]">
        <Image
          loading="lazy"
          src={image.src}
          alt={image.alt}
          fill
          className="w-full h-full p-3 object-contain rounded-lg"
        />
      </div>
    </div>
  );
};

export default Advertise;