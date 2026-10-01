import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";

import { AdminShell } from "@/components/admin/AdminShell";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAdminPortfolioItems } from "@/hooks/usePortfolioItems";
import { ADMIN_SESSION_KEY } from "@/lib/admin-auth";
import { sortBoardItems } from "@/lib/content-sort";
import { PORTFOLIO_CATEGORIES, formatPortfolioDate, portfolioPublishedLabel } from "@/lib/portfolio";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/portfolio/")({
  ssr: false,
  component: PortfolioManagePage,
});

function PortfolioManagePage() {
  const { items, remove, isLoading, isError, errorMessage } = useAdminPortfolioItems();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sortBoardItems(
      items.filter((item) => {
        const matchesQuery = !q || item.title.toLowerCase().includes(q);
        const matchesCategory = !category || item.category === category;
        return matchesQuery && matchesCategory;
      }),
      "default",
      (item) => item.writtenDate,
    );
  }, [items, query, category]);

  const target = items.find((item) => item.id === deleteId);

  return (
    <AdminShell
      title="포트폴리오 관리"
      onLogout={() => {
        sessionStorage.removeItem(ADMIN_SESSION_KEY);
        window.location.reload();
      }}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-lg font-bold text-navy">포트폴리오 관리</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            항목을 작성·수정·삭제할 수 있습니다. 저장 시 Supabase portfolio 테이블에 반영됩니다.
          </p>
        </div>
        <Link
          to="/admin/portfolio/new"
          className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          새 항목 작성
        </Link>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-[1fr_200px]">
        <div>
          <label htmlFor="portfolio-search" className="mb-2 block text-sm font-semibold text-navy">
            제목 검색
          </label>
          <Input
            id="portfolio-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="제목으로 검색"
          />
        </div>
        <div>
          <label htmlFor="portfolio-category" className="mb-2 block text-sm font-semibold text-navy">
            분류
          </label>
          <select
            id="portfolio-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="">전체</option>
            {PORTFOLIO_CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isError && (
        <p role="alert" className="mt-4 text-sm text-destructive">
          {errorMessage ?? "포트폴리오 항목을 불러오지 못했습니다."}
        </p>
      )}
      {isLoading && <p className="mt-4 text-sm text-muted-foreground">목록을 불러오는 중입니다…</p>}

      <div className="mt-6 overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-surface text-navy">
            <tr>
              <th className="px-4 py-3 font-semibold">이미지</th>
              <th className="px-4 py-3 font-semibold">제목</th>
              <th className="px-4 py-3 font-semibold">분류</th>
              <th className="px-4 py-3 font-semibold">작성일</th>
              <th className="px-4 py-3 font-semibold">상단 고정</th>
              <th className="px-4 py-3 font-semibold">노출 순서</th>
              <th className="px-4 py-3 font-semibold">작성자</th>
              <th className="px-4 py-3 font-semibold">노출여부</th>
              <th className="px-4 py-3 font-semibold">관리</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-10 text-center text-muted-foreground">
                  해당하는 항목이 없습니다.
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr key={item.id} className="border-t border-border">
                  <td className="px-4 py-3">
                    <img src={item.imagePath} alt="" className="size-14 rounded object-cover" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-navy">{item.title}</span>
                      {item.isPinned ? <Badge>상단 고정</Badge> : null}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{item.category}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatPortfolioDate(item.writtenDate) || formatPortfolioDate(item.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{item.isPinned ? "예" : "아니오"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{item.sortOrder ?? "-"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{item.author || "-"}</td>
                  <td className="px-4 py-3">
                    <Badge variant={item.published ? "default" : "secondary"}>
                      {portfolioPublishedLabel(item.published)}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        to="/admin/portfolio/$id"
                        params={{ id: item.id }}
                        className="rounded-md border border-border px-3 py-1.5 text-xs font-semibold text-navy hover:bg-surface"
                      >
                        수정
                      </Link>
                      <button
                        type="button"
                        onClick={() => setDeleteId(item.id)}
                        className="rounded-md border border-destructive/30 px-3 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/5"
                      >
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <AlertDialog open={Boolean(deleteId)} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>이 포트폴리오 항목을 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              {target ? `「${target.title}」 항목이 Supabase portfolio 테이블에서 삭제됩니다.` : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (!deleteId) return;
                void (async () => {
                  try {
                    await remove(deleteId);
                    toast.success("항목이 삭제되었습니다.");
                    setDeleteId(null);
                  } catch (error) {
                    toast.error(error instanceof Error ? error.message : "삭제에 실패했습니다.");
                  }
                })();
              }}
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminShell>
  );
}
