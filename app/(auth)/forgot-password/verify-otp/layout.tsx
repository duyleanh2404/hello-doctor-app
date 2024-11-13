import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Xác thực tài khoản | Hello Bacsi"
};

export default function VerifyOtpLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>{children}</div>
  );
};