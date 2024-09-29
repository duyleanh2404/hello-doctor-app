import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đăng ký tài khoản | Hello Bacsi"
};

export default function RegisterLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>{children}</div>
  );
};