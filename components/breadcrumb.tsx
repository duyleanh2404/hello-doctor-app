import { IoHome } from "react-icons/io5";
import { FaAngleRight } from "react-icons/fa6";

import Link from "next/link";

const Breadcrumb = ({ label }: { label: string }) => (
  <div className="wrapper w-full flex items-center gap-3 py-3 bg-white z-10">
    <Link href="/" className="min-w-fit flex items-center gap-3 font-medium hover:underline cursor-pointer">
      <IoHome size="18" className="text-[#595959]" />
      Trang chủ
    </Link>

    <Link href="/booking-doctor" className="flex items-center gap-3 font-medium text-primary hover:underline">
      <FaAngleRight size="13" />
      Đặt lịch với bác sĩ
    </Link>

    <p className="hidden sm:flex items-center gap-3 font-medium text-primary cursor-default">
      <FaAngleRight size="13" />
      {label}
    </p>
  </div>
);

export default Breadcrumb;