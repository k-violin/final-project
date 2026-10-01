import { useQuery } from "@tanstack/react-query";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { EmptyState, SafeText } from "./SiteLayout";
import { ContactButton } from "./ContactButton";
import { RevealOnScroll, type RevealEffect } from "./RevealOnScroll";
import {
  fetchCategories,
  fetchPublishedList,
  fetchPublishedBySlug,
  PAGE_SIZE,
  type PortfolioItem,
  type BlogPost,
} from "@/lib/db";
import { formatDate, portfolioCover } from "@/lib/site";
import { cn } from "@/lib/utils";

export type CollectionSearch = {
  cat?: string | undefined;
  q?: string | undefined;
  page?: number | undefined;
  item?: string | undefined;
};

type Row = PortfolioItem & Partial<BlogPost>;

const CARD_REVEALS: RevealEffect[] = ["from-up", "from-left", "from-right", "from-scale", "from-blur", "from-flip"];

export function CollectionView({
  kind,
  search,
  setSearch,
}: {
  kind: "portfolio" | "blog";
  search: CollectionSearch;
  setSearch: (next: CollectionSearch) => void;
}) {
  const table = kind === "portfolio" ? "portfolio_items" : "blog_posts";
  const page = search.page && search.page > 0 ? search.page : 1;

  const { data: categories } = useQuery({
    queryKey: ["categories", kind],
    queryFn: () => fetchCategories(kind),
  });

  const activeCategory = (categories ?? []).find((c) => c.slug === search.cat);

  const list = useQuery({
    queryKey: [table, activeCategory?.id ?? null, search.q ?? "", page],
    queryFn: () =>
      fetchPublishedList(table, {
        categoryId: activeCategory?.id,
        q: search.q,
        page,
      }),
    enabled: !search.cat || Boolean(activeCategory),
  });

  const detail = useQuery({
    queryKey: [table, "detail", search.item],
    queryFn: () => fetchPublishedBySlug(table, search.item!),
    enabled: Boolean(search.item),
  });

  const rows = (list.data?.rows ?? []) as Row[];
  const total = list.data?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const detailRow = detail.data as Row | null | undefined;
  const detailCover =
    kind === "portfolio" && detailRow
      ? portfolioCover(detailRow)
      : detailRow?.cover_image_url
        ? { src: detailRow.cover_image_url, alt: "" }
        : null;

  const categoryName = (id: string | null) =>
    (categories ?? []).find((c) => c.id === id)?.name ?? "";

  return (
    <div className="container-page py-14 md:py-20">
      {/* 카테고리 탭 */}
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="카테고리">
        <button
          type="button"
          role="tab"
          aria-selected={!search.cat}
          onClick={() => setSearch({ ...search, cat: undefined, page: 1 })}
          className={cn(
            "rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
            !search.cat
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border text-muted-foreground hover:bg-surface",
          )}
        >
          전체
        </button>
        {(categories ?? []).map((c) => (
          <button
            key={c.id}
            type="button"
            role="tab"
            aria-selected={search.cat === c.slug}
            onClick={() => setSearch({ ...search, cat: c.slug, page: 1 })}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
              search.cat === c.slug
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:bg-surface",
            )}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* 검색 */}
      <form
        className="mt-6 flex max-w-md gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          const value = new FormData(e.currentTarget).get("q");
          setSearch({ ...search, q: String(value ?? "").trim() || undefined, page: 1 });
        }}
      >
        <label htmlFor="collection-search" className="sr-only">
          제목 또는 요약 검색
        </label>
        <Input
          id="collection-search"
          name="q"
          defaultValue={search.q ?? ""}
          placeholder="제목 또는 요약 검색"
        />
        <button
          type="submit"
          className="shrink-0 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          검색
        </button>
      </form>

      {/* 목록 */}
      <div className="mt-10">
        {list.isLoading ? (
          <p className="text-sm text-muted-foreground">불러오는 중입니다…</p>
        ) : list.isError ? (
          <EmptyState
            title="목록을 불러오지 못했습니다."
            description="잠시 후 다시 시도해 주세요."
          />
        ) : rows.length === 0 ? (
          <EmptyState
            title={
              search.q
                ? "검색 결과가 없습니다."
                : kind === "portfolio"
                  ? "게시된 프로젝트가 없습니다."
                  : "게시된 글이 없습니다."
            }
            description={
              search.q
                ? "다른 검색어로 다시 시도해 주세요."
                : kind === "portfolio"
                  ? "관리자가 프로젝트를 게시하면 이 목록에 표시됩니다. 홈페이지의 주요 프로젝트에서 공개 사례를 먼저 확인하실 수 있습니다."
                  : "관리자가 글을 게시하면 이 목록에 표시됩니다."
            }
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rows.map((row, i) => {
              const meta = [
                row.client_name ?? categoryName(row.category_id),
                row.project_year ? String(row.project_year) : formatDate(row.published_at),
              ].filter(Boolean);
              const excerpt = (row.summary ?? row.body ?? "")
                .replace(/<[^>]*>/g, " ")
                .replace(/\s+/g, " ")
                .trim();
              const chips = [
                categoryName(row.category_id),
                row.client_name ?? "",
                row.project_year ? `${row.project_year}년` : "",
              ].filter(Boolean);
              const cover =
                kind === "portfolio"
                  ? portfolioCover(row)
                  : row.cover_image_url
                    ? { src: row.cover_image_url, alt: "" }
                    : null;
              return (
                <RevealOnScroll
                  key={row.id}
                  as="article"
                  effect={CARD_REVEALS[i % CARD_REVEALS.length]!}
                  delay={(i % 3) * 90}
                  className="group flex flex-col overflow-hidden rounded-xl border border-border bg-white transition-shadow hover:shadow-md"
                >
                  {cover && (
                    <img
                      src={cover.src}
                      alt={cover.alt}
                      loading="lazy"
                      className="h-44 w-full object-cover"
                    />
                  )}
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-xs font-semibold text-primary">{meta.join(" · ")}</p>
                      <span aria-hidden="true" className="text-primary/60">
                        ↗
                      </span>
                    </div>
                    <h2 className="mt-2 text-base font-bold leading-snug text-navy">
                      <button
                        type="button"
                        className="text-left hover:text-primary hover:underline"
                        onClick={() => setSearch({ ...search, item: row.slug })}
                      >
                        {row.title}
                      </button>
                    </h2>
                    {excerpt && (
                      <p className="mt-4 line-clamp-4 flex-1 text-sm leading-6 text-muted-foreground">
                        {excerpt}
                      </p>
                    )}
                    {chips.length > 0 && (
                      <ul className="mt-5 flex flex-wrap gap-2">
                        {chips.map((chip) => (
                          <li
                            key={chip}
                            className="rounded-full bg-surface px-3 py-1 text-xs text-muted-foreground"
                          >
                            {chip}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </RevealOnScroll>
              );
            })}
          </div>
        )}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <nav className="mt-10 flex justify-center gap-2" aria-label="페이지 이동">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              type="button"
              aria-current={p === page ? "page" : undefined}
              onClick={() => setSearch({ ...search, page: p })}
              className={cn(
                "size-10 rounded-md border text-sm font-semibold",
                p === page
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:bg-surface",
              )}
            >
              {p}
            </button>
          ))}
        </nav>
      )}

      {/* 상세 패널 */}
      <Dialog
        open={Boolean(search.item)}
        onOpenChange={(open) => {
          if (!open) setSearch({ ...search, item: undefined });
        }}
      >
        <DialogContent className="max-h-[85vh] max-w-3xl overflow-y-auto">
          {detail.isLoading ? (
            <p className="text-sm text-muted-foreground">불러오는 중입니다…</p>
          ) : !detailRow ? (
            <>
              <DialogHeader>
                <DialogTitle>내용을 찾을 수 없습니다.</DialogTitle>
                <DialogDescription>삭제되었거나 게시가 중단된 게시물입니다.</DialogDescription>
              </DialogHeader>
            </>
          ) : (
            <>
              {detailCover && (
                <img
                  src={detailCover.src}
                  alt={detailCover.alt}
                  className="-mt-1 w-full rounded-lg object-cover"
                />
              )}

              <DialogHeader>
                <DialogDescription className="text-xs font-semibold text-primary">
                  {[categoryName(detailRow.category_id), formatDate(detailRow.published_at)]
                    .filter(Boolean)
                    .join(" · ")}
                </DialogDescription>
                <DialogTitle className="text-xl leading-snug text-navy">
                  {detailRow.title}
                </DialogTitle>
              </DialogHeader>

              {kind === "portfolio" && (
                <dl className="grid gap-3 rounded-lg bg-surface p-5 text-sm sm:grid-cols-2">
                  {detailRow.client_name && (
                    <div>
                      <dt className="font-semibold text-navy">고객사</dt>
                      <dd className="text-muted-foreground">{detailRow.client_name}</dd>
                    </div>
                  )}
                  {detailRow.project_year && (
                    <div>
                      <dt className="font-semibold text-navy">프로젝트 연도</dt>
                      <dd className="text-muted-foreground">{detailRow.project_year}</dd>
                    </div>
                  )}
                </dl>
              )}

              {detailRow.summary && (
                <p className="text-sm leading-relaxed text-foreground">{detailRow.summary}</p>
              )}

              {kind === "portfolio" &&
                (
                  [
                    ["고객 과제", detailRow.challenge],
                    ["수행 내용", detailRow.work_done],
                    ["결과 및 적용", detailRow.outcome],
                  ] as const
                ).map(([label, value]) =>
                  value ? (
                    <section key={label}>
                      <h3 className="text-base font-bold text-navy">{label}</h3>
                      <SafeText text={value} className="mt-2 text-sm text-muted-foreground" />
                    </section>
                  ) : null,
                )}

              <SafeText text={detailRow.body} className="text-sm text-muted-foreground" />

              <div className="pt-2">
                <ContactButton />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
