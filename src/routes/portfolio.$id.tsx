import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteLayout, PageHero, EmptyState } from "@/components/site/SiteLayout";
import { PortfolioDetailView } from "@/components/portfolio/PortfolioDetailView";
import { usePublishedPortfolioItem } from "@/hooks/usePortfolioItems";

export const Route = createFileRoute("/portfolio/$id")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "포트폴리오 | 와이즈인컴퍼니" },
      { name: "description", content: "와이즈인컴퍼니 프로젝트 사례" },
    ],
  }),
  component: Page,
});

function Page() {
  const { id } = Route.useParams();
  const { data: item, isLoading } = usePublishedPortfolioItem(id);

  return (
    <SiteLayout>
      <PageHero eyebrow="Portfolio" title="프로젝트" />
      <div className="container-page py-14 md:py-20">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">항목을 불러오는 중입니다…</p>
        ) : !item ? (
          <EmptyState title="항목을 찾을 수 없습니다." description="공개된 프로젝트만 확인할 수 있습니다." />
        ) : (
          <PortfolioDetailView item={item} />
        )}
        <div className="mt-10">
          <Link
            to="/portfolio"
            className="inline-flex rounded-md border border-border px-5 py-2 text-sm font-semibold text-navy hover:bg-surface"
          >
            목록으로
          </Link>
        </div>
      </div>
    </SiteLayout>
  );
}
