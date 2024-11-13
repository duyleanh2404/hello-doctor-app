import Image from "next/image";

import Autoplay from "embla-carousel-autoplay";

import { heroes } from "@/constants/heroes";

import {
  Carousel,
  CarouselItem,
  CarouselContent
} from "@/components/ui/carousel";

const Hero = () => {
  return (
    <Carousel
      className="z-[-1]"
      plugins={[Autoplay({ delay: 3000 })]}
    >
      <CarouselContent>
        {heroes.map(({ id, image }) => (
          <CarouselItem key={id} className="relative w-full pt-[20%]">
            <Image
              fill
              loading="lazy"
              src={image}
              alt="Hero"
              className="w-full h-full object-cover"
            />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default Hero; 