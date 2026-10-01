import { Children, type ReactNode } from "react";

import { Header } from "./Header";
import { Footer } from "./Footer";
import { PAGE_REVEALS, RevealOnScroll } from "./RevealOnScroll";

export function SiteLayout({ children }: { children: ReactNode }) {
  const items = Children.toArray(children);

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-white">
      <Header />
      <main id="main" className="flex-1">
        {items.map((child, index) =>
          index === 0 ? (
            child
          ) : (
            <RevealOnScroll key={`section-reveal-${index}`} effect={PAGE_REVEALS[(index - 1) % PAGE_REVEALS.length]!}>
              {child}
            </RevealOnScroll>
          ),
        )}
      </main>
      <RevealOnScroll effect="from-up">
        <Footer />
      </RevealOnScroll>
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="bg-navy">
      <div className="container-page py-14 md:py-20">
        {eyebrow && (
          <p className="hero-copy text-sm font-semibold uppercase tracking-wider text-cyan">{eyebrow}</p>
        )}
        <h1 className="hero-copy hero-copy-2 mt-2 text-3xl font-bold text-white md:text-4xl">{title}</h1>
        {description && (
          <p className="hero-copy hero-copy-3 mt-4 max-w-2xl text-base leading-relaxed text-white/75">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-surface px-6 py-14 text-center">
      <p className="text-base font-semibold text-navy">{title}</p>
      {description && <p className="mt-2 text-sm text-muted-foreground">{description}</p>}
    </div>
  );
}

/** 관리자가 작성한 본문을 HTML이 아닌 일반 텍스트로 안전하게 표시합니다. */
export function SafeText({ text, className }: { text?: string | null; className?: string }) {
  if (!text) return null;
  return (
    <div className={className}>
      {text.split("\n").map((line, i) => (
        <p key={i} className="mb-3 leading-relaxed whitespace-pre-wrap last:mb-0">
          {line}
        </p>
      ))}
    </div>
  );
}
