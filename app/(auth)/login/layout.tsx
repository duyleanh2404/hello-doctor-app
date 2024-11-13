import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đăng nhập tài khoản | Hello Bacsi"
};

export default function LoginLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>{children}</div>
  );
};