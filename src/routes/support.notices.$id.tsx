import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteLayout, PageHero, EmptyState, SafeText } from "@/components/site/SiteLayout";
import { Badge } from "@/components/ui/badge";
import { usePublishedNotice } from "@/hooks/useAdminNotices";
import { formatNoticeDate } from "@/lib/notice-mock";

export const Route = createFileRoute("/support/notices/$id")({
  head: () => ({
    meta: [
      { title: "공지사항 | 와이즈인컴퍼니" },
      { name: "description", content: "와이즈인컴퍼니의 공지사항과 안내를 확인하세요." },
      { property: "og:title", content: "공지사항 | 와이즈인컴퍼니" },
    ],
  }),
  component: Page,
});

function Page() {
  const { id } = Route.useParams();
  const { data: notice, isLoading, isError } = usePublishedNotice(id);

  return (
    <SiteLayout>
      <PageHero eyebrow="Support" title="공지사항" />
      <div className="container-page py-16 md:py-20">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">공지를 불러오는 중입니다…</p>
        ) : isError ? (
          <EmptyState title="공지사항을 불러오지 못했습니다." description="잠시 후 다시 시도해 주세요." />
        ) : !notice ? (
          <EmptyState title="공지를 찾을 수 없습니다." description="공개된 공지만 확인할 수 있습니다." />
        ) : (
          <article className="mx-auto max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-primary">{notice.category}</span>
              {notice.isPinned ? <Badge>상단 고정</Badge> : null}
              <span className="text-xs font-semibold text-muted-foreground">
                {formatNoticeDate(notice.writtenDate) || "-"}
              </span>
              {notice.author ? (
                <span className="text-xs text-muted-foreground">{notice.author}</span>
              ) : null}
            </div>
            <h1 className="mt-3 text-2xl font-bold leading-snug text-navy md:text-3xl">{notice.title}</h1>
            <SafeText text={notice.content} className="mt-8 text-base text-foreground" />
          </article>
        )}
        <div className="mx-auto mt-10 max-w-3xl">
          <Link
            to="/support/notices"
            className="inline-flex rounded-md border border-border px-5 py-2.5 text-sm font-semibold text-navy hover:bg-surface"
          >
            목록으로
          </Link>
        </div>
      </div>
    </SiteLayout>
  );
}
