import Link from "next/link";
import Image from "next/image";

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

const HealthGuide = () => {
  const { posts, isLoading } = usePosts("desc");

  if (isLoading) {
    return <Spinner center />;
  }

  return (
    <LazyLoadComponent>
      <div className="wrapper flex flex-col gap-8 pt-12 pb-20">
        <h1 className="text-xl font-bold">Cẩm nang sức khỏe</h1>
        {posts?.length > 0 ? (
          <Carousel plugins={[Autoplay({ delay: 3000 })]}>
            <CarouselContent>
              {posts?.map((post: PostData) => (
                <CarouselItem key={post?._id} className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                  <Link
                    href={`/posts/${btoa(post?._id)}`}
                    onClick={() => NProgress.start()}
                    className="flex flex-col gap-6"
                  >
                    <div className="relative w-full pt-[60%]">
                      <Image
                        loading="lazy"
                        src={post?.image}
                        alt="Post Image"
                        fill
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>

                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <p className="text-base font-bold text-primary">{post?.specialty_id?.name}</p>
                        <p className="text-sm font-semibold">{post?.releaseDate}</p>
                      </div>
                      <h1 className="text-lg font-bold line-clamp-2">{post?.title}</h1>
                    </div>

                    <div className="flex items-center gap-3">
                      <Image
                        loading="lazy"
                        src={post?.doctor_id?.image}
                        alt="Avatar Doctor"
                        width="35"
                        height="35"
                        className="rounded-full"
                      />
                      <p className="text-sm">
                        Tham vấn y khoa: <span className="font-semibold">{post?.doctor_id?.fullname}</span>
                      </p>
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        ) : (
          <div className="w-full flex flex-col items-center justify-center gap-12 pt-8">
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

export default HealthGuide;