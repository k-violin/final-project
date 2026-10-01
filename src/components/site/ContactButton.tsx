import { Link } from "@tanstack/react-router";

import type { InquiryArea } from "@/lib/site";
import { cn } from "@/lib/utils";

export function ContactButton({
  area,
  detail,
  label = "문의하기",
  variant = "primary",
  className,
  onClick,
}: {
  area?: InquiryArea;
  detail?: string;
  label?: string;
  variant?: "primary" | "outline" | "light";
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}) {
  const styles = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border border-primary text-primary hover:bg-primary/5",
    light: "bg-white text-navy hover:bg-white/90",
  } as const;

  return (
    <Link
      to="/support/contact"
      search={{
        ...(area ? { area } : {}),
        ...(detail ? { detail } : {}),
      }}
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center rounded-md px-5 py-2.5 text-sm font-semibold transition-colors",
        styles[variant],
        className,
      )}
    >
      {label}
    </Link>
  );
}
