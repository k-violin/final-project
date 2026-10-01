import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { ContactButton } from "@/components/site/ContactButton";
import { RevealOnScroll, type RevealEffect } from "@/components/site/RevealOnScroll";
import { BUSINESS_CARDS } from "@/lib/site";

export const Route = createFileRoute("/business/")({
  head: () => ({
    meta: [
      { title: "Business | 와이즈인컴퍼니" },
      {
        name: "description",
        content:
          "와이즈인컴퍼니의 데이터 분석, AI 솔루션, 플랫폼 서비스, 국비교육 프로그램을 소개합니다.",
      },
      { property: "og:title", content: "Business | 와이즈인컴퍼니" },
      {
        property: "og:description",
        content: "데이터 분석과 AI 솔루션을 중심으로 한 와이즈인컴퍼니의 사업 영역입니다.",
      },
    ],
  }),
  component: BusinessIndex,
});

function BusinessIndex() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Business"
        title="사업 영역"
        description="데이터 분석과 AI 솔루션을 중심으로, 플랫폼 서비스와 국비교육 프로그램을 함께 운영합니다."
      />
      <p className="container-page max-w-3xl pt-12 text-base leading-relaxed text-muted-foreground">
        공공기관과 기업의 의사결정을 돕기 위해 분석부터 자동화, 교육까지 한 흐름으로
        제공합니다. 각 소개 페이지에서 서비스 구성과 활용 방향을 확인하실 수 있으며, 과제에
        맞는 진행 방식은 문의 상담으로 안내드립니다.
      </p>
      <div className="container-page grid gap-6 py-12 md:grid-cols-2 md:py-16">
        {BUSINESS_CARDS.map((card, i) => (
          <RevealOnScroll
            key={card.title}
            effect={(["from-left", "from-right", "from-up", "from-scale"] as RevealEffect[])[i]!}
            delay={i * 90}
            className="flex flex-col rounded-xl border border-border bg-white p-7"
          >
            <h2 className="text-lg font-bold text-navy">
              <Link to={card.to} className="hover:text-primary">
                {card.title}
              </Link>
            </h2>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
              {card.description}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to={card.to}
                className="inline-flex items-center rounded-md border border-border px-4 py-2 text-sm font-semibold text-navy hover:bg-surface"
              >
                자세히 보기
              </Link>
              <ContactButton area={card.area} />
            </div>
          </RevealOnScroll>
        ))}
      </div>
    </SiteLayout>
  );
}
