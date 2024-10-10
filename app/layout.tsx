import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";

import "./globals.css";
import localFont from "next/font/local";

import ProviderAuth from "@/components/providers/provider-auth";
import ProviderStore from "@/components/providers/provider-global";

const ibmPlexSans = localFont({
  src: "./fonts/IBM-Plex-Sans.woff2",
  variable: "--font-ibm-plex-sans",
  weight: "100 700 800",
});

export const metadata: Metadata = {
  title: "Hello Bacsi | Nội dung về sức khỏe, thuốc, bệnh, thai kỳ và nuôi dạy con cùng bí quyết sống khỏe mỗi ngày",
  description: "Cung cấp thông tin về sức khỏe, thuốc, bệnh, thai kỳ và nuôi dạy con. Bí quyết sống khỏe mỗi ngày.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${ibmPlexSans.variable} antialiased`}>
        <ProviderStore>
          <ProviderAuth>
            <Toaster
              position="top-center"
              reverseOrder={false}
              toastOptions={{
                style: { maxWidth: 500 }
              }}
            />
            {children}
          </ProviderAuth>
        </ProviderStore>
      </body>
    </html>
  );
};