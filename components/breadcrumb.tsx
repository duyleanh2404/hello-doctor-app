import Link from "next/link";

import { IoHome } from "react-icons/io5";
import { FaAngleRight } from "react-icons/fa6";

import NProgress from "nprogress";
import "nprogress/nprogress.css";

interface BreadcrumbProps {
  labels: { label: string; href?: string }[];
};

const Breadcrumb = ({ labels }: BreadcrumbProps) => (
  <div className="wrapper w-full flex items-center gap-3 py-3 bg-white z-10 overflow-x-auto whitespace-nowrap">
    <Link
      href="/"
      onClick={() => NProgress.start()}
      className="min-w-fit flex items-center gap-3 font-medium hover:underline cursor-pointer flex-shrink-0"
    >
      <IoHome size="18" className="text-[#595959]" />
      Trang chủ
    </Link>

    {labels.map((item, index) => (
      <div key={index} className="flex items-center gap-3 flex-shrink-0">
        <FaAngleRight size="13" />
        {item.href ? (
          <Link
            href={item.href}
            onClick={() => NProgress.start()}
            className="font-medium text-primary hover:underline"
          >
            {item.label}
          </Link>
        ) : (
          <p className="font-medium text-primary cursor-default">{item.label}</p>
        )}
      </div>
    ))}
  </div>
);

export default Breadcrumb;