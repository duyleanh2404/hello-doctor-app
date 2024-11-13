import Link from "next/link";
import Image from "next/image";

import { centralPoints } from "@/constants/central-points";

const CentralPoints = () => {
  return (
    <div className="wrapper py-12">
      <h1 className="text-[22px] font-bold text-center sm:text-start">Tâm điểm</h1>
      <Link href="/" className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10">
        {centralPoints.map(({ id, image }) => (
          <div key={id} className="relative w-full pt-[140%]">
            <Image
              loading="lazy"
              src={image}
              alt="Central Point"
              fill
              className="w-full h-full object-cover rounded-xl shadow-xl hover:shadow-2xl transition duration-500"
            />
          </div>
        ))}
      </Link>
    </div>
  );
};

export default CentralPoints;