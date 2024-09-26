import Link from "next/link";
import Image from "next/image";

import healthCheckTools from "@/constants/health-check-tools";

const HealthCheckTools = () => {
  const renderTool = (id: number, title: string, image: string) => (
    <Link
      key={id}
      href="/"
      prefetch={false}
      className="flex flex-col items-center gap-6"
      aria-label={title}
    >
      <div className="relative w-[70px] h-[70px]">
        <Image
          loading="lazy"
          src={image}
          alt={title}
          fill
          className="w-full h-full object-cover"
        />
      </div>
      <p className="text-sm line-clamp-2 text-center leading-6">{title}</p>
    </Link>
  );

  return (
    <div className="flex flex-col gap-12 p-8 border rounded-2xl sm:rounded-md shadow-lg">
      <h1 className="text-xl font-bold text-center">Các công cụ kiểm tra sức khỏe khác</h1>
      <div className="flex flex-col gap-8">
        <div className="grid grid-cols-3 gap-6">
          {healthCheckTools.map(({ id, title, image }) => renderTool(id, title, image))}
        </div>

        <Link
          href="/health-tools"
          prefetch={false}
          className="font-semibold text-primary p-3 border border-primary rounded-md text-center"
        >
          Xem tất cả
        </Link>
      </div>
    </div>
  );
};

export default HealthCheckTools;