import type { Metadata } from "next";

import Header from "@/components/header";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Chi tiết bệnh viện/ phòng khám | Hello Bacsi"
};

export default function ClinicDetailsLayout({
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