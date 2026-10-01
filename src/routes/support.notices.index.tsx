import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { SiteLayout, PageHero, EmptyState } from "@/components/site/SiteLayout";
import { BoardSortSelect } from "@/components/site/BoardSortSelect";
import { Badge } from "@/components/ui/badge";
import { PUBLIC_NOTICE_QUERY_KEY } from "@/hooks/useAdminNotices";
import { type ContentSortMode, sortBoardItems } from "@/lib/content-sort";
import { fetchNotices } from "@/lib/db";
import { formatNoticeDate } from "@/lib/notice-mock";

export const Route = createFileRoute("/support/notices/")({
  head: () => ({
    meta: [
      { title: "공지사항 | 와이즈인컴퍼니" },
      { name: "description", content: "와이즈인컴퍼니의 공지사항과 안내를 확인하세요." },
      { property: "og:title", content: "공지사항 | 와이즈인컴퍼니" },
      { property: "og:description", content: "와이즈인컴퍼니 공지사항." },
    ],
  }),
  component: Page,
});

function Page() {
  const { data, isLoading, isError } = useQuery({ queryKey: PUBLIC_NOTICE_QUERY_KEY, queryFn: fetchNotices });
  const [sort, setSort] = useState<ContentSortMode>("default");
  const notices = useMemo(
    () => sortBoardItems(data ?? [], sort, (notice) => notice.writtenDate),
    [data, sort],
  );

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Support"
        title="공지사항"
        description="회사 소식과 운영 안내를 전합니다. 관리자가 등록한 공지가 이 목록에 표시됩니다."
      />
      <div className="container-page py-16 md:py-20">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">불러오는 중입니다…</p>
        ) : isError ? (
          <EmptyState title="공지사항을 불러오지 못했습니다." description="잠시 후 다시 시도해 주세요." />
        ) : notices.length === 0 ? (
          <EmptyState
            title="등록된 공지사항이 없습니다."
            description="새로운 안내는 관리자가 게시하면 이 목록에 표시됩니다."
          />
        ) : (
          <>
            <div className="mb-6 flex justify-end">
              <BoardSortSelect value={sort} onChange={setSort} id="notice-sort" />
            </div>
            <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-white">
              {notices.map((notice, index) => (
                <li key={notice.id}>
                  <Link
                    to="/support/notices/$id"
                    params={{ id: notice.id }}
                    className="flex items-center gap-3 px-5 py-4 transition-colors hover:bg-surface"
                  >
                    <span className="w-8 shrink-0 text-sm font-semibold tabular-nums text-muted-foreground">
                      {index + 1}
                    </span>
                    {notice.isPinned ? <Badge>상단 고정</Badge> : null}
                    <span className="min-w-0 flex-1 truncate text-base font-semibold text-navy">
                      {notice.title}
                    </span>
                    <span className="shrink-0 text-sm text-muted-foreground">
                      {formatNoticeDate(notice.writtenDate) || formatNoticeDate(notice.createdAt) || "-"}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </SiteLayout>
  );
}
