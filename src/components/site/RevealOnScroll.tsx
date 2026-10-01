import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

import { cn } from "@/lib/utils";

export type RevealEffect =
  | "from-up"
  | "from-left"
  | "from-right"
  | "from-scale"
  | "from-fade"
  | "from-down"
  | "from-blur"
  | "from-flip"
  | "from-rotate"
  | "from-zoom"
  | "from-clip"
  | "from-swing";

export const PAGE_REVEALS: RevealEffect[] = [
  "from-up",
  "from-left",
  "from-right",
  "from-scale",
  "from-blur",
  "from-flip",
  "from-rotate",
  "from-zoom",
  "from-clip",
  "from-swing",
];

export function RevealOnScroll({
  as: Tag = "div",
  effect = "from-up",
  delay = 0,
  className,
  children,
  ...rest
}: {
  as?: ElementType;
  effect?: RevealEffect;
  delay?: number;
  className?: string;
  children: ReactNode;
} & Record<string, unknown>) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let done = false;
    const show = () => {
      if (done) return;
      done = true;
      setShown(true);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        show();
        observer.disconnect();
      },
      { threshold: 0.05, rootMargin: "0px 0px -40px 0px" },
    );
    observer.observe(el);

    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 40 && rect.bottom > 40) {
      show();
      observer.disconnect();
    }

    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      {...rest}
      data-reveal={effect}
      data-inview={shown ? "true" : "false"}
      style={{
        transitionDelay: delay ? `${delay}ms` : undefined,
        animationDelay: delay ? `${delay}ms` : undefined,
      }}
      className={cn(className, shown && "is-inview")}
    >
      {children}
    </Tag>
  );
}
