"use client";

import { Suspense, lazy, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import NProgress from "nprogress";
import "nprogress/nprogress.css";

import { shareIcons } from "@/constants/share-icons";
import usePost from "@/hooks/fetch/use-post";

import Hint from "@/components/hint";
import Chatbot from "@/components/chatbot";
import Spinner from "@/components/spinner";
import Breadcrumb from "@/components/breadcrumb";

const Advertise = lazy(() => import("@/components/advertises/advertise"));

type ShareIcon = {
  id: number;
  src: string;
};

const PostDetailsPage = () => {
  const { postId } = useParams<{ postId: string }>();
  const post = usePost(atob(postId));

  useEffect(() => {
    NProgress.done();
  }, []);

  if (!post) {
    return <Spinner center />;
  }

  return (
    <>
      <Breadcrumb
        labels={[
          { label: "Bài viết mới nhất", href: "/" },
          { label: post?.title || "Đang tải..." }
        ]}
      />

      <div className="wrapper flex flex-col lg:flex-row gap-10 pt-4 pb-16">
        <div className="w-full lg:w-[70%] flex flex-col xl:flex-row gap-10">
          <div className="w-[5%] hidden xl:block relative py-2">
            <div className="sticky top-36 flex flex-row xl:flex-col gap-8">
              {shareIcons.map(({ id, src }: ShareIcon) => (
                <Image loading="lazy" key={id} src={src} alt="Icon" width="30" height="30" />
              ))}
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-6">
            <div className="flex xl:hidden items-center justify-between">
              <div className="w-fit flex items-center gap-2 py-2 px-3 border rounded-full shadow-md">
                <p className="font-medium text-[#595959]">Tổng quan</p>
                <Image loading="lazy" src="/post-details/general.svg" alt="Icon" width="20" height="20" />
              </div>

              <div className="flex items-center gap-8">
                {shareIcons.map(({ id, src }: ShareIcon) => (
                  <Image loading="lazy" key={id} src={src} alt="Icon" width="25" height="25" />
                ))}
              </div>
            </div>

            <div dangerouslySetInnerHTML={{ __html: post?.desc || "" }} />
          </div>
        </div>

        <div className="flex-1 relative flex flex-col gap-8">
          <div className="flex flex-col items-center gap-4 p-6 border rounded-md shadow-sm">
            <div className="w-full flex flex-col items-center gap-4 pb-3 border-b">
              <Link href={`/doctor-details/${btoa(post?.doctor_id?._id)}`} onClick={() => NProgress.start()}>
                <Hint label="Xem chi tiết">
                  <Image
                    loading="lazy"
                    src={post?.doctor_id?.image || ""}
                    alt="Avatar"
                    width="80"
                    height="80"
                    className="object-cover rounded-full"
                  />
                </Hint>
              </Link>

              <div className="flex flex-col items-center gap-2">
                <p className="text-sm font-medium text-[#595959]">Tham vấn y khoa:</p>
                <h1 className="text-lg font-semibold">{post?.doctor_id?.fullname}</h1>
                <p className="font-semibold text-primary">{post?.specialty_id?.name}</p>
              </div>
            </div>

            <p className="text-sm">
              Ngày đăng: <span className="font-semibold">{post?.releaseDate}</span>
            </p>
          </div>

          <div className="sticky top-32">
            <Suspense fallback={<Spinner table />}><Advertise /></Suspense>
          </div>
        </div>
      </div>

      <Chatbot />
    </>
  );
};

export default PostDetailsPage;