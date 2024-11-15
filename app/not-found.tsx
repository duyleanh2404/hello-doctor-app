"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import Header from "@/components/header";
import Footer from "@/components/footer";

const NotFoundPage = () => {
  const router = useRouter();
  const [isLoading, setLoading] = useState<boolean>(false);

  return (
    <>
      <Header />

      <div className="flex flex-col items-center justify-center gap-6 space-header bg-[#f5f5fa] pt-20 pb-36">
        <Image loading="lazy" src="/not-found.png" alt="Not found" width="250" height="250" />
        <h1 className="text-[19px] font-semibold">
          Trang bạn đang tìm kiếm không tồn tại!
        </h1>
        <Button
          type="button"
          variant="default"
          disabled={isLoading}
          onClick={() => {
            router.replace("/");
            setLoading(true);
          }}
          className="h-14 text-[17px] font-medium text-white px-6 bg-primary hover:bg-[#2c74df] rounded-md transition duration-500"
        >
          Quay về trang chủ
        </Button>
      </div>

      <Footer />
    </>
  );
};

export default NotFoundPage; 