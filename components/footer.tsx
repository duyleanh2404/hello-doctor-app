import Link from "next/link";
import Image from "next/image";

import socials from "@/constants/socials";
import certificates from "@/constants/certificates";

const healthTopics = [
  "Chuyên đề sức khỏe",
  "Kiểm tra sức khỏe",
  "Tìm bệnh viện",
  "Cộng đồng",
  "Cửa hàng"
];

const policies = [
  "Điều khoản sử dụng",
  "Chính sách Quyền riêng tư",
  "Chính sách Biên tập và Chỉnh sửa",
  "Chính sách Quảng cáo và Tài trợ",
  "Câu hỏi thường gặp",
  "Tiêu chuẩn cộng đồng",
  "Quy định đặt lịch bác sĩ và mua hàng"
];

const aboutUs = [
  "Tự giới thiệu",
  "Ban điều hành",
  "Tuyển dụng",
  "Quảng cáo",
  "Liên hệ"
];

const Footer = () => {
  return (
    <footer className="text-white bg-[#1b3250] pt-14 pb-8">
      <div className="wrapper grid grid-cols-2 lg:grid-cols-5 gap-12 pb-12 border-b border-[#e4e8ec1a]">
        <div className="col-span-2 flex flex-col gap-6">
          <Image
            loading="lazy"
            src="/logo-white.png"
            alt="Hello Bacsi Logo"
            width={130}
            height={29}
          />
          <p className="text-sm leading-7">
            Hello Bacsi mong muốn trở thành nền tảng thông tin y khoa hàng đầu tại Việt Nam, giúp bạn đưa ra những quyết định đúng đắn liên quan về chăm sóc sức khỏe và hỗ trợ bạn cải thiện chất lượng cuộc sống.
          </p>

          <div className="flex items-center gap-6">
            <p className="text-sm text-[#87909c]">Kết nối với chúng tôi</p>
            <div className="flex items-center gap-6">
              {socials.map(({ id, href, src, alt }) => (
                <Link key={id} href={href} target="_blank">
                  <Image
                    loading="lazy"
                    src={src}
                    alt={alt}
                    width={24}
                    height={24}
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 text-sm leading-6">
          {healthTopics.map((link, idx) => (
            <Link key={idx} href="/">{link}</Link>
          ))}
        </div>

        <div className="flex flex-col gap-4 text-sm leading-6">
          {policies.map((link, idx) => (
            <Link key={idx} href="/">{link}</Link>
          ))}
        </div>

        <div className="flex flex-col gap-4 text-sm leading-6">
          {aboutUs.map((link, idx) => (
            <Link key={idx} href="/">{link}</Link>
          ))}
        </div>
      </div>

      <div className="wrapper flex flex-col xl:flex-row items-center justify-between gap-8 pt-12">
        <div className="w-full xl:w-[60%] flex flex-col gap-4 text-[13px] text-[#9AA2AC] leading-6">
          <p>
            © 2024 Bản quyền các bài viết thuộc tập đoàn Hello Health Group. Các bài viết của Hello Bacsi chỉ có tính chất tham khảo, không thay thế cho việc chẩn đoán hoặc điều trị y khoa.
          </p>
          <p>
            Giấy xác nhận cung cấp dịch vụ mạng xã hội trực tuyến số 529/GP-BTTTT, HN ngày 03/12/2019.
          </p>
        </div>

        <div className="flex-1 flex items-center justify-end gap-8">
          {certificates.map(({ id, src, width, height }) => (
            <Image
              loading="lazy"
              key={id}
              src={src}
              alt="Certificate"
              width={width}
              height={height}
              sizes="(max-width: 640px) 90px, 104px"
            />
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;