import Image from "next/image";

const DEFAULT_LOGO_PATH = "/images/agmerz-estate-logo.png";

interface BrandLogoProps {
  className?: string;
  priority?: boolean;
  size?: "sm" | "md" | "lg" | "hero";
  framed?: boolean;
  src?: string;
}

const sizeClasses = {
  sm: "w-[108px] sm:w-[120px]",
  md: "w-[140px] sm:w-[160px]",
  lg: "w-[180px] sm:w-[220px] md:w-[240px]",
  hero: "w-[200px] sm:w-[240px] md:w-[280px] lg:w-[300px]",
} as const;

/** Official AGMERZ ESTATE logo asset. */
export function BrandLogo({
  className = "",
  priority = false,
  size = "md",
  framed = false,
  src,
}: BrandLogoProps) {
  const logoPath = src?.trim() || DEFAULT_LOGO_PATH;
  const logo = (
    <div className={`relative aspect-square ${sizeClasses[size]}`}>
      <Image
        src={logoPath}
        alt="AGMERZ ESTATE"
        fill
        priority={priority}
        sizes="(max-width: 768px) 200px, 300px"
        className="object-contain"
      />
    </div>
  );

  if (!framed) {
    return (
      <div className={className} aria-label="AGMERZ ESTATE">
        {logo}
      </div>
    );
  }

  return (
    <div
      className={`inline-flex rounded-3xl border border-border/70 bg-surface p-5 shadow-[0_12px_40px_rgba(17,17,17,0.05)] md:p-6 ${className}`}
      aria-label="AGMERZ ESTATE"
    >
      {logo}
    </div>
  );
}
