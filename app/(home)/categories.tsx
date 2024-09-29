import Link from "next/link";
import Image from "next/image";

import categories from "@/constants/categories";

const Categories = () => {
  return (
    <div className="wrapper py-8 border-b-2 border-dashed border-[#ccc]">
      <div className="flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-6 xl:gap-12">
        {categories.map(({ id, href, title, image }) => (
          <Link
            href={href}
            key={id}
            className="w-full lg:w-auto flex items-center gap-4 py-3 pl-4 pr-12 bg-[#f2f3f3] rounded-lg shadow-md hover:shadow-lg transition-all duration-500"
          >
            <Image
              loading="lazy"
              src={image}
              alt="Category"
              width={35}
              height={35}
            />
            <p className="xl:text-lg font-semibold">{title}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Categories;