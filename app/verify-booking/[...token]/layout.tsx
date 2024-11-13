import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Xác nhận đơn đặt lịch | Hello Bacsi"
};

export default function VerifyBookingLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      {children}
    </div>
  );
};