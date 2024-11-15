import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

import { FaAngleRight } from "react-icons/fa6";
import NProgress from "nprogress";
import toast from "react-hot-toast";
import "nprogress/nprogress.css";

import { PostData } from "@/types/post-types";
import { getAllPosts } from "@/services/post-service";
import useSpecialtyByName from "@/hooks/fetch/use-specialty-by-name";

import Spinner from "@/components/spinner";

const SpecialistArticle = () => {
  const [isLoading, setLoading] = useState(true);

  const { specialty: heartSpecialty } = useSpecialtyByName("Tim mạch");
  const { specialty: cancerSpecialty } = useSpecialtyByName("Ung thư - Ung bướu");

  const [heartPosts, setHeartPosts] = useState<PostData[]>([]);
  const [cancerPosts, setCancerPosts] = useState<PostData[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!heartSpecialty || !cancerSpecialty) return;

      try {
        const [heartData, cancerData] = await Promise.all([
          getAllPosts({
            exclude: "desc, releaseDate",
            specialty_id: heartSpecialty?._id,
          }),
          getAllPosts({
            exclude: "desc, imageName, releaseDate, normalizedTitle",
            specialty_id: cancerSpecialty?._id,
          }),
        ]);

        setHeartPosts(heartData.posts);
        setCancerPosts(cancerData.posts);
      } catch (error: any) {
        console.error(error);
        toast.error("Có lỗi xảy ra. Vui lòng thử lại sau ít phút nữa!");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [heartSpecialty, cancerSpecialty]);

  if (isLoading) {
    return (
      <div className="wrapper w-full xl:w-[55%] flex flex-col gap-14">
        <Spinner center />
      </div>
    );
  }

  return (
    <div className="wrapper w-full xl:w-[55%] flex flex-col gap-14">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h1 className="text-[22px] font-bold">Ung thư - Ung bướu</h1>
          <Link
            href={cancerSpecialty?._id ? `/specialties/${btoa(cancerSpecialty._id)}` : "/"}
            onClick={() => cancerSpecialty?._id && NProgress.start()}
            className="flex items-center gap-2 text-[15px] font-medium text-primary"
          >
            Xem thêm <FaAngleRight size="14" />
          </Link>
        </div>

        {cancerPosts?.length > 0 ? (
          <div className="flex flex-col gap-8">
            {cancerPosts?.slice(0, 3)?.map((post: PostData) => (
              <Link
                key={post?._id}
                href={`/posts/${btoa(post?._id)}`}
                onClick={() => NProgress.start()}
                className="flex items-center gap-4 sm:gap-6"
              >
                <div className="relative flex-shrink-0 w-[160px] h-[100px] sm:w-[180px] sm:h-[120px] sm:pt-[25%] sm:pl-[40%]">
                  <Image
                    loading="lazy"
                    src={post?.image}
                    alt="Post"
                    fill
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>

                <div className="flex flex-col gap-2 sm:gap-6">
                  <div className="flex flex-col gap-1 sm:gap-2">
                    <p className="text-[13px] sm:text-[15px] font-bold text-primary">{post?.specialty_id?.name}</p>
                    <h1 className="text-sm sm:text-xl font-bold line-clamp-2">{post?.title}</h1>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="relative w-[20px] h-[20px] sm:w-[35px] sm:h-[35px]">
                      <Image
                        loading="lazy"
                        src={post?.doctor_id?.image}
                        alt="Doctor Avatar"
                        fill
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <p className="text-[12px] sm:text-[15px]">
                      Tham vấn y khoa: <span className="font-semibold">{post?.doctor_id?.fullname}</span>
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="w-full flex flex-col items-center justify-center gap-12 pt-8">
            <Image loading="lazy" src="/not-found.png" alt="Not found" width="240" height="240" />
            <h1 className="text-xl font-semibold text-[#262626] text-center">
              Rất tiếc, hiện tại không tìm thấy bài viết nào!
            </h1>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h1 className="text-[22px] font-bold">Tim mạch</h1>
          <Link
            href={heartSpecialty?._id ? `/specialties/${btoa(heartSpecialty._id)}` : "/"}
            onClick={() => cancerSpecialty?._id && NProgress.start()}
            className="flex items-center gap-2 text-[15px] font-medium text-primary"
          >
            Xem thêm <FaAngleRight size="14" />
          </Link>
        </div>

        {heartPosts?.length > 0 ? (
          <div className="flex flex-col gap-8">
            {heartPosts?.slice(0, 3)?.map((post: PostData) => (
              <Link
                key={post?._id}
                href={`/posts/${btoa(post?._id)}`}
                onClick={() => NProgress.start()}
                className="flex items-center gap-4 sm:gap-6"
              >
                <div className="relative flex-shrink-0 w-[160px] h-[100px] sm:w-[180px] sm:h-[120px] sm:pt-[25%] sm:pl-[40%]">
                  <Image
                    loading="lazy"
                    src={post?.image}
                    alt="Post"
                    fill
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>

                <div className="flex flex-col gap-2 sm:gap-6">
                  <div className="flex flex-col gap-1 sm:gap-2">
                    <p className="text-[13px] sm:text-[15px] font-bold text-primary">{post?.specialty_id?.name} </p>
                    <h1 className="text-sm sm:text-xl font-bold line-clamp-2">{post?.title}</h1>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="relative w-[20px] h-[20px] sm:w-[35px] sm:h-[35px]">
                      <Image
                        loading="lazy"
                        src={post?.doctor_id?.image}
                        alt="Doctor Avatar"
                        fill
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <p className="text-[12px] sm:text-[15px]">
                      Tham vấn y khoa: <span className="font-semibold">{post?.doctor_id?.fullname}</span>
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="w-full flex flex-col items-center justify-center gap-12 pt-8">
            <Image loading="lazy" src="/not-found.png" alt="Not found" width="240" height="240" />
            <h1 className="text-xl font-semibold text-[#262626] text-center">
              Rất tiếc, hiện tại không tìm thấy bài viết nào!
            </h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpecialistArticle;