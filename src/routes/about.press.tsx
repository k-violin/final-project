import { useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { SiteLayout, PageHero, EmptyState } from "@/components/site/SiteLayout";
import { BoardSortSelect } from "@/components/site/BoardSortSelect";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { type ContentSortMode, sortBoardItems } from "@/lib/content-sort";
import { fetchPress } from "@/lib/db";
import { formatPressDate, PUBLIC_PRESS_QUERY_KEY } from "@/lib/press-mock";

type PressSearch = { page?: number | undefined };

const PER_PAGE = 10;

export const Route = createFileRoute("/about/press")({
  validateSearch: (search: Record<string, unknown>): PressSearch => ({
    page: Number(search["page"]) > 1 ? Number(search["page"]) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "언론보도 | 와이즈인컴퍼니" },
      { name: "description", content: "와이즈인컴퍼니 관련 언론보도와 보도자료를 확인하실 수 있습니다." },
      { property: "og:title", content: "언론보도 | 와이즈인컴퍼니" },
      { property: "og:description", content: "와이즈인컴퍼니 언론보도 게시판." },
    ],
  }),
  component: Page,
});

function Page() {
  const { page = 1 } = Route.useSearch();
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [sort, setSort] = useState<ContentSortMode>("default");
  const { data, isLoading, isError } = useQuery({
    queryKey: PUBLIC_PRESS_QUERY_KEY,
    queryFn: fetchPress,
  });

  const rows = useMemo(() => {
    const list = data ?? [];
    const k = keyword.trim().toLowerCase();
    const filtered = !k
      ? list
      : list.filter((r) => r.title.toLowerCase().includes(k) || r.source.toLowerCase().includes(k));
    return sortBoardItems(filtered, sort, (item) => item.publishedDate);
  }, [data, keyword, sort]);

  const totalPages = Math.max(1, Math.ceil(rows.length / PER_PAGE));
  const current = Math.min(page, totalPages);
  const pageRows = rows.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  return (
    <SiteLayout>
      <PageHero
        eyebrow="About Us"
        title="언론보도"
        description="와이즈인컴퍼니의 소식과 보도 내용을 전해드립니다. 제목을 누르면 해당 기사로 이동합니다."
      />
      <div className="container-page py-16 md:py-20">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">불러오는 중입니다…</p>
        ) : isError ? (
          <EmptyState title="언론보도를 불러오지 못했습니다." description="잠시 후 다시 시도해 주세요." />
        ) : (
          <>
            <div className="mb-6 flex flex-col items-end gap-3 sm:flex-row sm:justify-end">
              <BoardSortSelect
                value={sort}
                onChange={(value) => {
                  setSort(value);
                  if (page > 1) void navigate({ to: "/about/press", search: {} });
                }}
                id="press-sort"
              />
              <label htmlFor="press-search" className="sr-only">
                언론보도 검색
              </label>
              <Input
                id="press-search"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="제목·출처 검색"
                className="max-w-xs"
              />
            </div>

            {pageRows.length === 0 ? (
              <EmptyState
                title={keyword ? "검색 결과가 없습니다." : "등록된 언론보도가 없습니다."}
                description={
                  keyword
                    ? "다른 검색어로 다시 시도해 주세요."
                    : "관리자가 언론보도를 등록하면 이 목록에 표시됩니다."
                }
              />
            ) : (
              <>
                <div className="overflow-hidden rounded-xl border border-border">
                  <table className="w-full text-left text-sm">
                    <caption className="sr-only">언론보도 목록</caption>
                    <thead className="bg-surface text-xs text-muted-foreground">
                      <tr>
                        <th scope="col" className="hidden w-20 px-4 py-3 text-center md:table-cell">
                          번호
                        </th>
                        <th scope="col" className="px-4 py-3">
                          제목
                        </th>
                        <th scope="col" className="hidden w-40 px-4 py-3 md:table-cell">
                          출처
                        </th>
                        <th scope="col" className="w-32 px-4 py-3">
                          날짜
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {pageRows.map((row, idx) => (
                        <tr key={row.id} className="border-t border-border hover:bg-surface/60">
                          <td className="hidden px-4 py-4 text-center text-muted-foreground md:table-cell">
                            {rows.length - ((current - 1) * PER_PAGE + idx)}
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex flex-wrap items-center gap-2">
                              {row.isPinned ? <Badge>상단 고정</Badge> : null}
                              <a
                                href={row.articleUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-semibold text-navy hover:text-primary hover:underline"
                              >
                                {row.title}
                              </a>
                            </div>
                          </td>
                          <td className="hidden px-4 py-4 text-muted-foreground md:table-cell">
                            {row.source}
                          </td>
                          <td className="px-4 py-4 text-muted-foreground">
                            {formatPressDate(row.publishedDate) || "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {totalPages > 1 && (
                  <nav className="mt-8 flex justify-center gap-2" aria-label="페이지 이동">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <Link
                        key={p}
                        to="/about/press"
                        search={p > 1 ? { page: p } : {}}
                        aria-current={p === current ? "page" : undefined}
                        className={
                          p === current
                            ? "rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground"
                            : "rounded-md border border-border px-3 py-1.5 text-sm font-semibold text-navy hover:bg-surface"
                        }
                      >
                        {p}
                      </Link>
                    ))}
                  </nav>
                )}
              </>
            )}
          </>
        )}
      </div>
    </SiteLayout>
  );
}
