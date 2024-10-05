import { IoHome } from "react-icons/io5";
import { FaAngleRight } from "react-icons/fa6";

import Link from "next/link";

const Breadcrumb = ({ label }: { label: string }) => (
  <div className="wrapper w-full flex items-center gap-3 py-3 bg-white z-10">
    {/* Home link directing to the root of the site */}
    <Link href="/" className="min-w-fit flex items-center gap-3 font-medium hover:underline cursor-pointer">
      <IoHome size="18" className="text-[#595959]" /> {/* Home icon */}
      Trang chủ {/* Home label */}
    </Link>

    {/* Link to the booking page with a right angle icon */}
    <Link href="/booking-doctor" className="flex items-center gap-3 font-medium text-primary hover:underline">
      <FaAngleRight size="13" /> {/* Right angle icon */}
      Đặt lịch với bác sĩ {/* Booking label */}
    </Link>

    {/* Current page label, only visible on small screens and above */}
    <p className="hidden sm:flex items-center gap-3 font-medium text-primary cursor-default">
      <FaAngleRight size="13" /> {/* Right angle icon */}
      {label} {/* Display the current page label passed as prop */}
    </p>
  </div>
);

export default Breadcrumb;