import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thanh toán tiền khám bệnh | Hello Bacsi"
};

export default function VerifyPaymentLayout({
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