import type { Metadata } from "next";

import Header from "@/components/header";
import Footer from "@/components/footer";
import MainSettingsLayout from "./main-settings-layout";

export const metadata: Metadata = {
  title: "Hồ sơ của tôi | Hello Bacsi"
};

export default function SettingsLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Header />
      <MainSettingsLayout>
        {children}
      </MainSettingsLayout>
      <Footer />
    </div>
  );
};