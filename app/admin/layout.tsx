import type { Metadata } from "next";

import MainLayout from "./main-layout";

export const metadata: Metadata = {
  title: "Trang quản trị viên | Hello Bacsi"
};

export default function AdminLayout({
  children
}: Readonly<{ children: React.ReactNode; }>) {
  return (
    <MainLayout>
      {children}
    </MainLayout>
  );
};