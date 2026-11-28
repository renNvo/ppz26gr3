import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  size?: "sm" | "md";
}

export function BrandLogo({ className, size = "md" }: BrandLogoProps) {
  const iconDimensions = size === "sm" ? "h-7 w-7" : "h-8 w-8";
  const textSize = size === "sm" ? "text-lg" : "text-xl";

  return (
    <span className={cn("inline-flex items-center gap-2.5 select-none", className)}>
      <span
        className={cn(
          "inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs",
          iconDimensions
        )}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
        >
          <rect x="4" y="6" width="13" height="14" rx="2" />
          <path d="M8 6V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-1" />
        </svg>
      </span>
      <span className={cn("font-semibold tracking-tight text-foreground", textSize)}>
        Memora
      </span>
    </span>
  );
}
