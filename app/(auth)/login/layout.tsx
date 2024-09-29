import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đăng nhập | Hello Bacsi"
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