import Image from "next/image";

import introduces from "@/constants/introduces";

interface Introduce {
  id: number;
  title: string;
  desc: string;
  image: string;
}

interface IntroduceCardProps {
  introduce: Introduce;
}

const IntroduceCard = ({ introduce }: IntroduceCardProps) => {
  const { title, desc, image } = introduce;

  return (
    <div className="flex flex-col items-center gap-10 py-8 px-6 bg-[#e3f2ff] rounded-md shadow-lg">
      <Image
        loading="lazy"
        src={image}
        alt={title}
        width={220}
        height={147}
        className="object-cover"
      />
      <div className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-lg font-bold">{title}</h1>
        <p className="text-sm leading-7">{desc}</p>
      </div>
    </div>
  );
};

const Introduces = () => {
  return (
    <div className="wrapper py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-12 lg:gap-6">
        {introduces.map((introduce: Introduce) => (
          <IntroduceCard key={introduce.id} introduce={introduce} />
        ))}
      </div>
    </div>
  );
};

export default Introduces;