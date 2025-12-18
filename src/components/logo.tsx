
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  textClassName?: string;
};

export default function Logo({ className, textClassName }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        "flex items-center gap-3 text-primary hover:text-primary/80 transition-colors",
        className
      )}
    >
      <Image
        src="https://res.cloudinary.com/dqycipmr0/image/upload/v1766033775/EP_uehxrf.png"
        alt="Education Pixel Logo"
        width={40}
        height={40}
        className="rounded-md"
      />
      <span
        className={cn(
          "font-headline text-xl font-bold tracking-tight text-primary",
          textClassName
        )}
      >
        Education Pixel
      </span>
    </Link>
  );
}
