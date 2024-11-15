import Link from "next/link";
import Image from "next/image";

import { PiTrendUpDuotone } from "react-icons/pi";
import NProgress from "nprogress";
import Autoplay from "embla-carousel-autoplay";
import "nprogress/nprogress.css";

import { PostData } from "@/types/post-types";
import usePosts from "@/hooks/fetch/use-posts";

import {
  Carousel,
  CarouselItem,
  CarouselContent
} from "@/components/ui/carousel";
import Spinner from "@/components/spinner";
import LazyLoadComponent from "@/components/lazyload-component";

const NewPosts = () => {
  const { posts, isLoading } = usePosts("desc");

  if (isLoading) {
    return <Spinner center />;
  }

  return (
    <LazyLoadComponent>
      <div id="featured-articles" className="wrapper flex flex-col items-center sm:items-start gap-8 sm:gap-12 py-12">
        <div className="w-fit flex items-center gap-3 py-4 px-6 bg-[#E3F2FF] rounded-full cursor-default">
          <PiTrendUpDuotone size="22" className="text-primary" />
          <p className="text-[17px] font-semibold text-primary">Bài viết mới nhất</p>
        </div>

        {posts?.length > 0 ? (
          <>
            <div className="w-full flex flex-col lg:flex-row gap-10 pb-10 border-b-2 border-dashed border-gray-300">
              <Link
                href={`/posts/${btoa(posts[0]?._id)}`}
                onClick={() => NProgress.start()}
                className="w-full lg:w-1/2 flex flex-col gap-6"
              >
                <div className="relative w-full pt-[65%]">
                  <Image
                    loading="lazy"
                    src={posts[0]?.image}
                    alt="Post"
                    fill
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm sm:text-base font-bold text-primary">{posts[0]?.specialty_id?.name}</p>
                    <p className="text-sm font-semibold">{posts[0]?.releaseDate}</p>
                  </div>
                  <h1 className="text-lg sm:text-xl font-bold line-clamp-2">{posts[0]?.title}</h1>
                </div>

                <div className="flex items-center gap-3">
                  <Image
                    loading="lazy"
                    src={posts[0]?.doctor_id?.image}
                    alt="Avatar"
                    width={35}
                    height={35}
                    className="rounded-full"
                  />
                  <p className="text-sm sm:text-[15px]">
                    Tham vấn y khoa: <span className="font-semibold">{posts[0]?.doctor_id?.fullname}</span>
                  </p>
                </div>
              </Link>

              <div className="w-full lg:flex-1 hidden lg:flex flex-row lg:flex-col justify-between gap-6 lg:gap-0">
                {posts?.slice(1, 4)?.map((post: PostData) => (
                  <Link
                    key={post?._id}
                    href={`/posts/${btoa(post?._id)}`}
                    onClick={() => NProgress.start()}
                    className="w-1/2 lg:w-auto flex flex-col lg:flex-row-reverse gap-6"
                  >
                    <div className="relative flex-1 pt-[55%] lg:pt-[28%]">
                      <Image
                        loading="lazy"
                        src={post?.image}
                        alt="Post"
                        fill
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>

                    <div className="flex-1 flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <p className="text-base font-bold text-primary">{post?.specialty_id?.name}</p>
                        <p className="hidden sm:block text-sm font-semibold">{post?.releaseDate}</p>
                      </div>
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

            <div className="flex md:hidden flex-col gap-8">
              {posts?.slice(1, 4)?.map((post: PostData) => (
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
                    <div className="flex items-center justify-between">
                      <p className="text-base font-bold text-primary">{post?.specialty_id?.name}</p>
                      <p className="hidden sm:block text-sm font-semibold">{post?.releaseDate}</p>
                    </div>
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

            <div className="w-full hidden md:block">
              <Carousel className="w-full" plugins={[Autoplay({ delay: 3000 })]}>
                <CarouselContent>
                  {posts?.slice(4, 10)?.map((post: PostData) => (
                    <CarouselItem key={post?._id} className="basis-1/3 xl:basis-1/4">
                      <Link
                        href={`/posts/${btoa(post?._id)}`}
                        onClick={() => NProgress.start()}
                        className="flex flex-col gap-6"
                      >
                        <div className="relative w-full pt-[60%]">
                          <Image
                            loading="lazy"
                            src={post?.image}
                            alt="Post"
                            fill
                            className="w-full h-full object-cover rounded-md"
                          />
                        </div>

                        <div className="flex flex-col gap-3">
                          <div className="flex items-center justify-between">
                            <p className="text-base font-bold text-primary">{post?.specialty_id?.name}</p>
                            <p className="hidden sm:block text-sm font-semibold">{post?.releaseDate}</p>
                          </div>
                          <h1 className="text-lg font-bold line-clamp-2">{post?.title}</h1>
                        </div>

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
                      </Link>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          </>
        ) : (
          <div className="w-full hidden lg:flex flex-col items-center justify-center gap-12 pt-8">
            <Image loading="lazy" src="/not-found.png" alt="Not found" width="240" height="240" />
            <h1 className="text-xl font-semibold text-[#262626] text-center">
              Rất tiếc, hiện tại không tìm thấy bài viết nào!
            </h1>
          </div>
        )}
      </div>
    </LazyLoadComponent>
  );
};

export default NewPosts; 