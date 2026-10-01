import { Link } from "@tanstack/react-router";

import logo from "@/assets/logo.png";
import logoLight from "@/assets/logo-light.png";

export function Logo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const src = tone === "light" ? logoLight : logo;

  return (
    <Link
      to="/"
      className="inline-flex shrink-0 items-center"
      aria-label="와이즈인컴퍼니 홈으로 이동"
    >
      <img
        src={src}
        alt="와이즈인컴퍼니 WiseIN Company"
        width={230}
        height={47}
        className="h-8 w-auto sm:h-9 md:h-10"
      />
    </Link>
  );
}
