import type { Metadata } from "next";

import Header from "@/components/header";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Thông tin đơn đặt lịch khám | Hello Bacsi"
};

export default function BookingDetailsLayout({
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