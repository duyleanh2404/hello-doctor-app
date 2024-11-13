import Image from "next/image";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      {children}
      <aside className="hidden xl:block fixed bottom-0 left-5">
        <Image
          loading="lazy"
          src="/auth/aside-left.svg"
          alt="Aside Left"
          width={320}
          height={260}
        />
      </aside>
      <aside className="hidden xl:block fixed bottom-0 right-5">
        <Image
          loading="lazy"
          src="/auth/aside-right.svg"
          alt="Aside Right"
          width={320}
          height={260}
        />
      </aside>
    </div>
  );
};