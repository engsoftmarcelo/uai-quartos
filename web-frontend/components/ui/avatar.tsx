import Image from "next/image";
import { cn } from "@/lib/utils";

export interface AvatarProps {
  alt: string;
  className?: string;
  fallback: string;
  size?: "sm" | "md" | "lg";
  src?: string;
}

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-base",
} as const;

export function Avatar({
  alt,
  className,
  fallback,
  size = "md",
  src,
}: AvatarProps) {
  return (
    <span
      className={cn(
        "relative inline-grid shrink-0 place-items-center overflow-hidden rounded-full bg-brand-soft font-bold text-brand-strong",
        sizeClasses[size],
        className,
      )}
    >
      {src ? (
        <Image alt={alt} className="object-cover" fill sizes="56px" src={src} />
      ) : (
        fallback.slice(0, 2).toUpperCase()
      )}
    </span>
  );
}
