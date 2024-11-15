"use client";

import { useParams } from "next/navigation";
import { useState, useEffect, lazy, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";

import NProgress from "nprogress";
import toast from "react-hot-toast";
import "nprogress/nprogress.css";

import { getAllPosts } from "@/services/post-service";

import { Province } from "@/types/auth-types";
import { PostData } from "@/types/post-types";

import useProvinces from "@/hooks/fetch/use-provinces";
import useSpecialty from "@/hooks/fetch/use-specialty";

import Chatbot from "@/components/chatbot";
import Spinner from "@/components/spinner";
import Breadcrumb from "@/components/breadcrumb";

const Advertise = lazy(() => import("@/components/advertises/advertise"));
const OutstandingDoctor = lazy(() => import("@/app/booking-doctor/outstanding-doctor"));

const SpecialtyDetailsPage = () => {
  const [isLoading, setLoading] = useState<boolean>(false);

  const { specialtyId } = useParams<{ specialtyId: string }>();
  const specialty = useSpecialty(atob(specialtyId));

  const provinces: Province[] = useProvinces();
  const [posts, setPosts] = useState<PostData[]>([]);

  useEffect(() => {
    NProgress.done();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);

      try {
        const { posts } = await getAllPosts({ specialty_id: atob(specialtyId[0]) });
        setPosts(posts);
      } catch (error: any) {
        console.error(error);
        toast.error("Có lỗi xảy ra. Vui lòng thử lại sau ít phút nữa!");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (!specialty || isLoading) {
    return <Spinner center />;
  }

  return (
    <>
      <Breadcrumb
        labels={[
          { label: "Tất cả chuyên khoa", href: "/specialties" },
          { label: specialty?.name || "Đang tải..." }
        ]}
      />

      <div className="pt-12 bg-[#e3f2ff]">
        <div className="pb-12 mt-12 bg-white rounded-t-[3rem]">
          <div className="wrapper flex flex-col gap-16 md:gap-12 lg:gap-10">
            <div className="flex flex-col gap-6 sm:gap-0">
              <div className="max-w-[70%] flex flex-col sm:flex-row items-center sm:gap-6 md:gap-10 mx-auto">
                <div className="w-32 h-32 sm:w-40 sm:h-40 relative object-cover rounded-full bg-white shadow-md -translate-y-10 sm:-translate-y-14">
                  <Image
                    loading="lazy"
                    src={specialty?.image}
                    alt={specialty?.name}
                    layout="fill"
                    className="p-4 rounded-full object-cover"
                  />
                </div>
                <h1 className="text-[22px] sm:text-[26px] font-bold text-[#262626] -translate-y-4 sm:-translate-y-6">
                  {specialty?.name}
                </h1>
              </div>

              <div className="w-full md:max-w-[80%] lg:max-w-[70%] xl:max-w-[60%] p-6 mx-auto border rounded-lg text-center sm:text-start">
                <div dangerouslySetInnerHTML={{ __html: specialty?.desc }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="wrapper">
        <div className="flex flex-col gap-8">
          <h1 className="text-[22px] font-bold">Kiến thức chung</h1>
          {posts?.length > 0 ? (
            <div className="flex flex-col lg:flex-row gap-12">
              <div className="flex-1">
                <Link
                  href={`/posts/${btoa(posts[0]?._id)}`}
                  onClick={() => NProgress.start()}
                  className="flex flex-col gap-6"
                >
                  <div className="relative w-full pt-[65%]">
                    <Image
                      loading="lazy"
                      src={posts[0]?.image || ""}
                      alt="Image"
                      fill
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>

                  <div className="flex flex-col gap-3">
                    <p className="text-sm sm:text-[15px] font-bold text-primary">{posts[0]?.specialty_id?.name}</p>
                    <h1 className="text-lg sm:text-2xl font-bold">{posts[0]?.title}</h1>
                  </div>

                  <div className="flex items-center gap-3">
                    <Image
                      loading="lazy"
                      src={posts[0]?.doctor_id?.image || ""}
                      alt="Image"
                      width="35"
                      height="35"
                      className="rounded-full"
                    />
                    <p className="text-sm sm:text-[15px]">
                      Tham vấn y khoa: <span className="font-semibold">{posts[0]?.doctor_id?.fullname}</span>
                    </p>
                  </div>
                </Link>
              </div>

              <div className="flex-1 hidden sm:grid grid-cols-2 gap-8">
                {posts?.slice(1, 5)?.map((post: PostData) => (
                  <Link
                    href={`/posts/${btoa(post?._id)}`}
                    onClick={() => NProgress.start()}
                    key={post?._id}
                    className="flex flex-col gap-6"
                  >
                    <div className="relative w-full pt-[55%]">
                      <Image
                        loading="lazy"
                        src={post?.image}
                        alt="Image"
                        fill
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>

                    <div className="flex flex-col gap-3">
                      <p className="text-sm font-bold text-primary">{post?.specialty_id?.name}</p>
                      <h1 className="text-[17px] font-bold text-[#1f1f1f]">{post?.title}</h1>
                    </div>

                    <div className="flex items-center gap-3">
                      <Image
                        loading="lazy"
                        src={post?.doctor_id?.image}
                        alt="Image"
                        width="35"
                        height="35"
                        className="rounded-full"
                      />
                      <p className="text-sm">
                        Tham vấn y khoa: <span className="font-semibold">{post?.doctor_id?.fullname}</span>
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="block sm:hidden">
                {posts?.slice(1, 5)?.map((post: PostData) => (
                  <Link
                    key={post?._id}
                    href={`/posts/${btoa(post?._id)}`}
                    onClick={() => NProgress.start()}
                    className="flex items-center gap-6 pb-6"
                  >
                    <div className="relative w-[40%] pt-[30%]">
                      <Image
                        loading="lazy"
                        src={post?.image}
                        alt="Post"
                        fill
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>

                    <div className="flex-1 flex flex-col gap-2">
                      <p className="text-sm font-bold text-primary">{post?.specialty_id?.name}</p>
                      <h1 className="text-lg font-bold line-clamp-2">{post?.title}</h1>
                      <div className="flex items-center gap-3">
                        <Image
                          loading="lazy"
                          src={post?.doctor_id?.image}
                          alt="Avatar"
                          width={35}
                          height={35}
                          className="rounded-full"
                        />
                        <p className="text-sm sm:text-[15px]">
                          Tham vấn y khoa: <span className="font-semibold">{post?.doctor_id?.fullname}</span>
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="w-full hidden lg:flex flex-col items-center justify-center gap-12 pt-8">
              <Image loading="lazy" src="/not-found.png" alt="Not found" width="240" height="240" />
              <h1 className="text-xl font-semibold text-[#262626] text-center">
                Rất tiếc, hiện tại không tìm thấy bài viết nào!
              </h1>
            </div>
          )}
        </div>

        <div className="relative flex flex-col-reverse xl:flex-row gap-12 pt-20 pb-16">
          <div className="w-full xl:w-[65%] flex flex-col gap-8">
            <h1 className="text-[22px] font-bold">Những điều bạn cần biết</h1>
            {posts?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-12 gap-x-6">
                {posts?.slice(5)?.map((post: PostData) => (
                  <Link
                    key={post?._id}
                    href={`/posts/${btoa(post?._id)}`}
                    onClick={() => NProgress.start()}
                    className="flex flex-col gap-6"
                  >
                    <div className="relative w-full pt-[65%]">
                      <Image
                        loading="lazy"
                        src={post?.image}
                        alt="Image"
                        fill
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>

                    <div className="flex flex-col gap-3">
                      <p className="text-sm sm:text-[15px] font-bold text-primary">{post?.specialty_id?.name}</p>
                      <h1 className="text-lg sm:text-xl font-bold">{post?.title}</h1>
                    </div>

                    <div className="flex items-center gap-3">
                      <Image
                        loading="lazy"
                        src={post?.doctor_id?.image}
                        alt="Image"
                        width="35"
                        height="35"
                        className="rounded-full"
                      />
                      <p className="text-sm sm:text-[15px]">
                        Tham vấn y khoa: <span className="font-semibold"> {post?.doctor_id?.fullname}</span>
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="w-full hidden lg:flex flex-col items-center justify-center gap-12 pt-8">
                <Image loading="lazy" src="/not-found.png" alt="Not found" width="240" height="240" />
                <h1 className="text-xl font-semibold text-[#262626] text-center">
                  Rất tiếc, hiện tại không tìm thấy bài viết nào!
                </h1>
              </div>
            )}
          </div>

          <div className="flex-1 xl:block hidden">
            <Suspense fallback={<Spinner table />}><Advertise /></Suspense>
          </div>

        </div>

        <Suspense fallback={<Spinner center />}>
          <OutstandingDoctor provinces={provinces} specialty_id={specialtyId[0]} />
        </Suspense>
      </div>

      <Chatbot />
    </>
  );
};

export default SpecialtyDetailsPage;