import Image from "next/image";

import { FaUserDoctor } from "react-icons/fa6";
import { FaClinicMedical } from "react-icons/fa";

import Autoplay from "embla-carousel-autoplay";

import { teamOfExperts } from "@/constants/team-of-experts";

import { Carousel, CarouselItem, CarouselContent } from "@/components/ui/carousel";
import LazyLoadComponent from "@/components/lazyload-component";

type Expert = {
  id: number;
  name: string;
  clinic: string;
  specialty: string;
  image: string;
};

const ExpertCard = ({ expert: { image, name, specialty, clinic } }: { expert: Expert }) => (
  <div className="flex-1 flex flex-col items-center gap-8 py-6 px-4 border rounded-xl shadow-md">
    <div className="relative">
      <Image
        loading="lazy"
        src={image}
        alt="Avatar"
        width={140}
        height={140}
        className="rounded-full"
      />
      <Image
        loading="lazy"
        src="/article-medical.svg"
        alt="Medical Icon"
        width={30}
        height={30}
        className="absolute bottom-2 right-2"
      />
    </div>

    <div className="w-full flex flex-col gap-10 p-6 bg-[#e3f2ff] rounded-xl">
      <h1 className="h-[40px] text-[17px] font-semibold text-center">{name}</h1>
      <div className="h-[70px] flex flex-col gap-3 text-sm">
        <p className="flex items-center gap-3">
          <FaUserDoctor size={15} /> {specialty}
        </p>
        <p className="flex items-center gap-3">
          <FaClinicMedical size={15} /> {clinic}
        </p>
      </div>
    </div>
  </div>
);

const TeamOfExperts = () => {
  const [firstExpert, secondExpert, ...otherExperts] = teamOfExperts || [];

  return (
    <LazyLoadComponent>
      <div className="wrapper flex flex-col gap-14 pt-12 pb-20">
        <div className="flex gap-12">
          <div className="w-full xl:w-[45%] flex flex-col gap-6">
            <h1 className="text-[22px] font-bold text-center sm:text-start">Đội ngũ chuyên gia của Hello Bacsi</h1>
            <div className="flex flex-col gap-4 text-center sm:text-start leading-7">
              <p>
                Đội ngũ cố vấn của Hello Bacsi gồm các chuyên gia sức khỏe và y bác sĩ từ nhiều chuyên khoa, với đầy đủ chứng nhận, chứng chỉ hành nghề, hỗ trợ xây dựng và củng cố nội dung theo chuyên môn của mình. Trách nhiệm của chuyên gia là bảo đảm tính chính xác về mặt y học ở những nội dung đăng tải trên Hello Bacsi, thường xuyên cập nhật các thông tin mới về khoa học, nghiên cứu và sức khỏe.
              </p>
              <p>
                Đội ngũ của chúng tôi làm việc không mệt mỏi để những thông tin hữu ích có thể dễ dàng tiếp cận đến bạn đọc, giúp bạn chủ động hơn trong các quyết định chăm sóc sức khỏe.
              </p>
            </div>
          </div>

          <div className="flex-1 hidden xl:flex items-center gap-6">
            {firstExpert && <ExpertCard expert={firstExpert} />}
            {secondExpert && <ExpertCard expert={secondExpert} />}
          </div>
        </div>

        <Carousel className="w-full" plugins={[Autoplay({ delay: 3000 })]}>
          <CarouselContent>
            {otherExperts.map((expert: Expert) => (
              <CarouselItem key={expert.id} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <ExpertCard expert={expert} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </LazyLoadComponent>
  );
};

export default TeamOfExperts;