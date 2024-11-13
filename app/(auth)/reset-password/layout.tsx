import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đặt lại mật khẩu tài khoản | Hello Bacsi"
};

export default function ResetPasswordLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>{children}</div>
  );
};