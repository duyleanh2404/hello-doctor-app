import type { Metadata } from "next";

import Header from "@/components/header";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Đặt lịch khám với bác sĩ | Hello Bacsi"
};

export default function BookingDoctorLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  );
};