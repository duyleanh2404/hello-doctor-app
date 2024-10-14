import Autoplay from "embla-carousel-autoplay";

import Link from "next/link";
import Image from "next/image";

import {
  Carousel,
  CarouselItem,
  CarouselContent
} from "@/components/ui/carousel";

interface HealthGuideItem {
  id: number;
  link: string;
  title: string;
  doctor: string;
  imageSrc: string;
  avatarSrc: string;
  specialty: string;
};

const healthGuideItems: HealthGuideItem[] = [
  {
    id: 1,
    link: "/posts/post-1",
    title: "Health Guide Post",
    doctor: "Doctor fullname",
    specialty: "Specialty name",
    imageSrc: "/post-1.png",
    avatarSrc: "/avatar-default.png"
  }
];

const HealthGuideItemComponent = ({
  title, specialty, doctor, imageSrc, avatarSrc, link
}: HealthGuideItem) => (
  <CarouselItem className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
    <Link href={link} className="flex flex-col gap-6">
      <div className="relative w-full pt-[60%]">
        <Image
          loading="lazy"
          src={imageSrc}
          alt="Thumbnail"
          fill
          className="w-full h-full object-cover rounded-md"
        />
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-[15px] font-bold text-primary">{specialty}</p>
        <h1 className="text-lg font-bold line-clamp-2">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <Image
          loading="lazy"
          src={avatarSrc}
          alt="Avatar"
          width="35"
          height="35"
          className="rounded-full"
        />
        <p className="text-sm">
          Tham vấn y khoa: {""}
          <span className="font-semibold">{doctor}</span>
        </p>
      </div>
    </Link>
  </CarouselItem>
);

const HealthGuide = () => {
  return (
    <div className="wrapper flex flex-col gap-8 pt-12 pb-20">
      <h1 className="text-xl font-bold">Cẩm nang sức khỏe</h1>
      <Carousel plugins={[Autoplay({ delay: 3000 })]}>
        <CarouselContent>
          {healthGuideItems.map((item) => (
            <HealthGuideItemComponent key={item.id} {...item} />
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default HealthGuide;