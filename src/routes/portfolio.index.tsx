import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { SiteLayout, PageHero, EmptyState } from "@/components/site/SiteLayout";
import { BoardSortSelect } from "@/components/site/BoardSortSelect";
import { PortfolioCard } from "@/components/portfolio/PortfolioCard";
import { TrustMetricsBar } from "@/components/site/TrustMetricsBar";
import { usePublishedPortfolioItems } from "@/hooks/usePortfolioItems";
import { type ContentSortMode, sortBoardItems } from "@/lib/content-sort";
import { fetchTrustMetrics } from "@/lib/db";

export const Route = createFileRoute("/portfolio/")({
  ssr: false,
  loader: ({ context }) =>
    context.queryClient.ensureQueryData({
      queryKey: ["trust-metrics"],
      queryFn: fetchTrustMetrics,
    }),
  head: () => ({
    meta: [
      { title: "Portfolio | 와이즈인컴퍼니" },
      {
        name: "description",
        content: "와이즈인컴퍼니가 수행한 데이터 분석과 AI 솔루션 프로젝트 사례입니다.",
      },
      { property: "og:title", content: "Portfolio | 와이즈인컴퍼니" },
      { property: "og:description", content: "와이즈인컴퍼니의 프로젝트 사례." },
    ],
  }),
  component: Page,
});

function Page() {
  const { data: items = [], isLoading } = usePublishedPortfolioItems();
  const [sort, setSort] = useState<ContentSortMode>("default");
  const sorted = useMemo(
    () => sortBoardItems(items, sort, (item) => item.writtenDate),
    [items, sort],
  );

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Portfolio"
        title="프로젝트"
        description="공공기관과 기업과 함께한 데이터 분석·AI 프로젝트를 소개합니다. 공개 가능한 범위의 사례만 게시됩니다."
      />
      <TrustMetricsBar />
      <div className="container-page py-14 md:py-20">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">프로젝트를 불러오는 중입니다…</p>
        ) : items.length === 0 ? (
          <EmptyState
            title="게시된 프로젝트가 없습니다."
            description="관리자가 항목을 공개하면 이 목록에 표시됩니다."
          />
        ) : (
          <>
            <div className="mb-6 flex justify-end">
              <BoardSortSelect value={sort} onChange={setSort} id="portfolio-sort" />
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {sorted.map((item) => (
                <PortfolioCard key={item.id} item={item} />
              ))}
            </div>
          </>
        )}
      </div>
    </SiteLayout>
  );
}
