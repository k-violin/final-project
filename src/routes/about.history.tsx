import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { SiteLayout, PageHero, EmptyState } from "@/components/site/SiteLayout";
import { RevealOnScroll } from "@/components/site/RevealOnScroll";
import { fetchHistory } from "@/lib/db";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/about/history")({
  head: () => ({
    meta: [
      { title: "회사연혁 | 와이즈인컴퍼니" },
      { name: "description", content: "2003년 설립 이후 와이즈인컴퍼니가 걸어온 길입니다." },
      { property: "og:title", content: "회사연혁 | 와이즈인컴퍼니" },
      { property: "og:description", content: "2003년 설립부터 이어진 회사 연혁." },
    ],
  }),
  component: Page,
});

type YearBlock = { year: number; lines: string[] };

const DEFAULT_HISTORY: YearBlock[] = [
  {
    year: 2026,
    lines: [
      "와이즈온(WiseON) 1,400개 공공기관 도입",
      "국내최초 통계분석 국비과정 승인 / 바이브코딩 교육 런칭",
      "소상공인을 위한 마케팅자동화 솔루션 출시",
    ],
  },
  {
    year: 2025,
    lines: [
      "와이즈온(WiseON) 혁신제품 선정",
      "내일배움교육 훈련기관 승인",
      "리치웨이(rich-way) 부자 플랫폼 사업 런칭",
    ],
  },
  {
    year: 2024,
    lines: ["와이즈온(WiseON) CSAP인증, 디지털몰, 조달제품 등록"],
  },
  {
    year: 2023,
    lines: ["공공 SaaS, 와이즈온(WiseON) 선정 (120개 기업 중 4위)"],
  },
];

function groupHistory(
  rows: { year: number; title: string; description?: string | null }[],
): YearBlock[] {
  const map = new Map<number, string[]>();
  for (const row of rows) {
    const lines = map.get(row.year) ?? [];
    const text = [row.title, row.description].filter(Boolean).join(" — ");
    if (text) lines.push(text);
    map.set(row.year, lines);
  }
  return [...map.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([year, lines]) => ({ year, lines }));
}

function Timeline({ blocks }: { blocks: YearBlock[] }) {
  return (
    <div className="relative">
      <div
        className="absolute bottom-2 left-3 top-2 w-px bg-border md:left-1/2 md:-translate-x-1/2"
        aria-hidden="true"
      />
      <ol>
        {blocks.map((block, index) => {
          const onLeft = index % 2 === 0;
          return (
            <li key={block.year} className="relative grid pb-12 last:pb-0 md:grid-cols-2 md:gap-x-16">
              <span
                className="absolute left-3 top-2 size-2.5 -translate-x-1/2 rounded-full bg-primary md:left-1/2"
                aria-hidden="true"
              />
              <RevealOnScroll
                effect={onLeft ? "from-left" : "from-right"}
                delay={index * 80}
                className={cn(
                  "pl-8 md:pl-0",
                  onLeft ? "md:col-start-1 md:pr-4 md:text-right" : "md:col-start-2 md:pl-4 md:text-left",
                )}
              >
                <p className="text-2xl font-bold text-primary">{block.year}</p>
                <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-navy md:text-[0.95rem]">
                  {block.lines.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </RevealOnScroll>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function Page() {
  const { data, isLoading, isError } = useQuery({ queryKey: ["history"], queryFn: fetchHistory });
  const cms = data ?? [];
  const blocks = cms.length > 0 ? groupHistory(cms) : DEFAULT_HISTORY;

  return (
    <SiteLayout>
      <PageHero
        eyebrow="About Us"
        title="회사연혁"
        description="2003년 설립 이후 와이즈인컴퍼니가 걸어온 길입니다."
      />
      <div className="container-page max-w-4xl py-16 md:py-20">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">불러오는 중입니다…</p>
        ) : isError ? (
          <EmptyState title="연혁을 불러오지 못했습니다." description="잠시 후 다시 시도해 주세요." />
        ) : (
          <Timeline blocks={blocks} />
        )}
      </div>
    </SiteLayout>
  );
}
