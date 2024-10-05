import {
  Carousel,
  CarouselItem,
  CarouselContent
} from "@/components/ui/carousel";

import Image from "next/image";
import heroes from "@/constants/heroes";
import Autoplay from "embla-carousel-autoplay";

const Hero = () => {
  return (
    <Carousel className="z-[-1]" plugins={[Autoplay({ delay: 3000 })]}>
      <CarouselContent>
        {heroes.map(({ id, image }) => (
          <CarouselItem key={id} className="relative w-full pt-[30%] space-header">
            <Image
              loading="lazy"
              src={image}
              alt="Hero"
              fill
              className="w-full h-full object-cover"
            />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default Hero;