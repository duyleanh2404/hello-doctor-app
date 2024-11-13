import type { Metadata } from "next";
import MainLayout from "./system-layout";

export const metadata: Metadata = {
  title: "Trang quản lý dành cho bác sĩ | Hello Bacsi"
};

export default function SystemLayout({
  children
}: Readonly<{ children: React.ReactNode; }>) {
  return (
    <MainLayout>
      {children}
    </MainLayout>
  );
};