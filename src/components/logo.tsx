
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { CodeXml } from "lucide-react";

type LogoProps = {
  className?: string;
  textClassName?: string;
};

export default function Logo({ className, textClassName }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        "flex items-center gap-2 text-primary hover:text-primary/80 transition-colors",
        className
      )}
    >
      <div className="p-2 bg-primary rounded-lg text-primary-foreground">
        <CodeXml className="h-6 w-6" />
      </div>
      <span
        className={cn(
          "font-headline text-xl font-bold tracking-tight",
          textClassName
        )}
      >
        MTech IT Institute
      </span>
    </Link>
  );
}
