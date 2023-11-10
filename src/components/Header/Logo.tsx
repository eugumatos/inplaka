import Image from "next/image";

export function Logo() {
  return (
    <Image
      alt="Logo"
      src="/logo_horizontal.png"
      width={160}
      height={32}
      style={{ opacity: 10 }}
    />
  );
}
