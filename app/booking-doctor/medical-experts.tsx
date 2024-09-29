import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";

import Image from "next/image";

import videos from "@/constants/videos";
import VideoIframe from "./video-iframe";

interface Video {
  id: string;
  title: string;
  image: string;
  src: string;
};

const MedicalExperts = () => {
  const [video, setVideo] = useState("video-1");

  const activeVideo: Video | undefined = useMemo(
    () => videos.find(({ id }) => id === video), [video]
  );

  return (
    <div className="bg-[#192e4a] py-12 space-content-lg">
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
              <button
                key={id}
                onClick={() => setVideo(id)}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-2xl transition duration-500",
                  video === id ? "bg-[#0f1c2b]" : "bg-[#00000026] hover:bg-[#0f1c2b]"
                )}
              >
                <Image
                  loading="lazy"
                  src={image}
                  alt="Thumbnail"
                  width={120}
                  height={120}
                  className="rounded-xl"
                />
                <p className="font-medium line-clamp-2 text-start">{title}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalExperts;