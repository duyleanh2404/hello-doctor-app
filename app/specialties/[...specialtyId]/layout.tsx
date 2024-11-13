import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chi tiết chuyên khoa | Hello Bacsi"
};

export default function SpecialtyDetailsLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>{children}</div>
  );
};