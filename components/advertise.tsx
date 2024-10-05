import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import advertises from "@/constants/advertises";

const Advertise = () => {
  // Function to get a random advertisement image from the advertises array
  const getRandomImage = useCallback(
    () => advertises[Math.floor(Math.random() * advertises.length)],
    [] // Dependencies array is empty; this function won't change
  );

  const [imageSrc, setImageSrc] = useState(getRandomImage());

  useEffect(() => {
    // Function to update the image source with a new random image
    const updateImage = () => setImageSrc(getRandomImage());

    // Set up an interval to update the image every 5000 milliseconds (5 seconds)
    const intervalId = setInterval(updateImage, 5000);

    return () => clearInterval(intervalId);
  }, [getRandomImage]);

  return (
    <div className="hidden xl:flex flex-col items-center">
      {/* Header for the advertisement section */}
      <div className="flex items-center gap-3">
        <Image
          priority
          src="/advertise-icon.svg"
          alt="Advertise Icon"
          width={20}
          height={20}
        />
        <p className="font-medium text-[#595959]">Quảng cáo</p> {/* Advertisement text */}
      </div>

      {/* Container for the advertisement image */}
      <div className="relative w-full pt-[160%]">
        <Image
          loading="lazy"
          src={imageSrc}
          alt="Advertise Image"
          fill
          className="w-full h-full p-3 object-contain rounded-lg"
        />
      </div>
    </div>
  );
};

export default Advertise;