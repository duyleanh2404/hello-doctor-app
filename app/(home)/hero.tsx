import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";

import {
  Carousel,
  CarouselContent,
  CarouselItem
} from "@/components/ui/carousel";
import heroes from "@/constants/heroes";

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
}

export default Hero;