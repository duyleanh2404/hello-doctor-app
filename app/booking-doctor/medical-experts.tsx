import { cn } from "@/lib/utils";
import { useState } from "react";
import Image from "next/image";

import { videos } from "@/constants/videos";
import LazyLoadComponent from "@/components/lazyload-component";

type Video = {
  id: string;
  src: string;
  title: string;
  image: string;
};

const VideoIframe = ({ src }: { src: string }) => {
  return (
    <iframe
      src={src}
      allowFullScreen={true}
      className="absolute top-0 left-0 w-full h-full"
      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
    />
  );
};

const MedicalExperts = () => {
  const [video, setVideo] = useState<string>("video-1");
  const activeVideo: Video | undefined = videos.find(({ id }) => id === video);

  return (
    <LazyLoadComponent>
      <div className="bg-[#192e4a] py-12">
        <div className="wrapper flex flex-col gap-12 text-white">
          <div className="flex flex-col items-center gap-3">
            <h1 className="text-2xl font-bold">Chia sẻ từ chuyên gia y tế</h1>
            <p className="text-sm sm:text-[17px] text-center">
              Giúp bạn hiểu rõ hơn về sức khỏe của thân và có được phương pháp điều trị đúng đắn
            </p>
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="relative w-full lg:w-[60%] pt-[56%] lg:pt-[33.5%] rounded-2xl overflow-hidden">
              {activeVideo ? <VideoIframe src={activeVideo.src} /> : null}
            </div>

            <div className="flex-1 flex flex-col sm:grid sm:grid-cols-2 lg:flex lg:flex-col gap-4">
              {videos.map(({ id, title, image }) => (
                <div
                  key={id}
                  onClick={() => setVideo(id)}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-2xl transition duration-500 cursor-pointer select-none",
                    video === id ? "bg-[#0f1c2b]" : "bg-[#00000026] hover:bg-[#0f1c2b]"
                  )}
                >
                  <Image loading="lazy" src={image} alt="Thumbnail" width={120} height={120} className="rounded-xl" />
                  <p className="font-medium line-clamp-2 text-start">{title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </LazyLoadComponent>
  );
};

export default MedicalExperts; 