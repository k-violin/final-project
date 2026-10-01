import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";

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
import { useAdminNotices } from "@/hooks/useAdminNotices";
import { ADMIN_SESSION_KEY } from "@/lib/admin-auth";
import { sortBoardItems, visibilityLabel } from "@/lib/content-sort";
import { NOTICE_CATEGORIES, formatNoticeDate } from "@/lib/notice-mock";

export const Route = createFileRoute("/admin/notices/")({
  ssr: false,
  component: NoticeManagePage,
});

function NoticeManagePage() {
  const { notices, remove, isLoading, isError, errorMessage } = useAdminNotices();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sortBoardItems(
      notices.filter((notice) => {
        const matchesQuery = !q || notice.title.toLowerCase().includes(q);
        const matchesCategory = !category || notice.category === category;
        return matchesQuery && matchesCategory;
      }),
      "default",
      (notice) => notice.writtenDate,
    );
  }, [notices, query, category]);

  const target = notices.find((notice) => notice.id === deleteId);

  return (
    <AdminShell
      title="공지사항 관리"
      onLogout={() => {
        sessionStorage.removeItem(ADMIN_SESSION_KEY);
        window.location.reload();
      }}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-lg font-bold text-navy">공지사항 관리</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            공지를 작성·수정·삭제할 수 있습니다. 저장 시 Supabase notice 테이블에 반영됩니다.
          </p>
        </div>
        <Link
          to="/admin/notices/new"
          className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          새 공지 작성
        </Link>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-[1fr_200px]">
        <div>
          <label htmlFor="notice-search" className="mb-2 block text-sm font-semibold text-navy">
            제목 검색
          </label>
          <Input
            id="notice-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="제목으로 검색"
          />
        </div>
        <div>
          <label htmlFor="notice-category" className="mb-2 block text-sm font-semibold text-navy">
            분류
          </label>
          <select
            id="notice-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="">전체</option>
            {NOTICE_CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isError && (
        <p role="alert" className="mt-4 text-sm text-destructive">
          {errorMessage ?? "공지사항을 불러오지 못했습니다."}
        </p>
      )}
      {isLoading && <p className="mt-4 text-sm text-muted-foreground">목록을 불러오는 중입니다…</p>}

      <div className="mt-6 overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-surface text-navy">
            <tr>
              <th className="px-4 py-3 font-semibold">분류</th>
              <th className="px-4 py-3 font-semibold">제목</th>
              <th className="px-4 py-3 font-semibold">작성일</th>
              <th className="px-4 py-3 font-semibold">상단 고정</th>
              <th className="px-4 py-3 font-semibold">노출 순서</th>
              <th className="px-4 py-3 font-semibold">노출여부</th>
              <th className="px-4 py-3 font-semibold">작성자</th>
              <th className="px-4 py-3 font-semibold">관리</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-muted-foreground">
                  해당하는 공지가 없습니다.
                </td>
              </tr>
            ) : (
              filtered.map((notice) => (
                <tr key={notice.id} className="border-t border-border">
                  <td className="px-4 py-3 text-muted-foreground">{notice.category}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-navy">{notice.title}</span>
                      {notice.isPinned ? <Badge>상단 고정</Badge> : null}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatNoticeDate(notice.writtenDate) || formatNoticeDate(notice.createdAt) || "-"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{notice.isPinned ? "예" : "아니오"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{notice.sortOrder ?? "-"}</td>
                  <td className="px-4 py-3">
                    <Badge variant={notice.published ? "default" : "secondary"}>
                      {visibilityLabel(notice.published)}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{notice.author || "-"}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        to="/admin/notices/$id"
                        params={{ id: notice.id }}
                        className="rounded-md border border-border px-3 py-1.5 text-xs font-semibold text-navy hover:bg-surface"
                      >
                        수정
                      </Link>
                      <button
                        type="button"
                        onClick={() => setDeleteId(notice.id)}
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
            <AlertDialogTitle>이 공지사항을 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              {target ? `「${target.title}」 공지가 Supabase notice 테이블에서 삭제됩니다.` : ""}
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
                    toast.success("공지사항이 삭제되었습니다.");
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
