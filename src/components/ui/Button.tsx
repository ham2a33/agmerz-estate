import type { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";

interface ButtonBaseProps {
  variant?: "primary" | "secondary" | "dark" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  className?: string;
}

type ButtonProps = ButtonBaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type LinkButtonProps = ButtonBaseProps & {
  href: string;
  onClick?: () => void;
};

const variantClasses: Record<NonNullable<ButtonBaseProps["variant"]>, string> = {
  primary: "bg-accent text-accent-foreground hover:bg-accent/90",
  secondary: "border border-border bg-surface text-foreground hover:bg-surface-muted",
  dark: "bg-foreground text-surface hover:bg-foreground/90",
  outline: "border border-border bg-surface text-foreground hover:border-foreground/20 hover:bg-surface-muted",
  ghost: "text-foreground hover:bg-surface-muted",
};

const sizeClasses: Record<NonNullable<ButtonBaseProps["size"]>, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-3.5 text-base",
};

function getClasses(variant: ButtonBaseProps["variant"], size: ButtonBaseProps["size"], className: string) {
  return `inline-flex items-center justify-center gap-2 rounded-2xl font-medium transition-all duration-300 disabled:opacity-50 ${variantClasses[variant ?? "primary"]} ${sizeClasses[size ?? "md"]} ${className}`;
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button className={getClasses(variant, size, className)} {...props}>
      {children}
    </button>
  );
}

export function LinkButton({
  variant = "primary",
  size = "md",
  className = "",
  href,
  children,
  onClick,
}: LinkButtonProps) {
  return (
    <Link href={href} onClick={onClick} className={getClasses(variant, size, className)}>
      {children}
    </Link>
  );
}
