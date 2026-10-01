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
import { useAdminPress } from "@/hooks/useAdminPress";
import { ADMIN_SESSION_KEY } from "@/lib/admin-auth";
import { sortBoardItems, visibilityLabel } from "@/lib/content-sort";
import { formatPressDate } from "@/lib/press-mock";

export const Route = createFileRoute("/admin/press/")({
  ssr: false,
  component: PressManagePage,
});

function PressManagePage() {
  const { items, remove, isLoading, isError, errorMessage } = useAdminPress();
  const [query, setQuery] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sortBoardItems(
      items.filter(
        (item) =>
          !q ||
          item.title.toLowerCase().includes(q) ||
          item.source.toLowerCase().includes(q),
      ),
      "default",
      (item) => item.publishedDate,
    );
  }, [items, query]);

  const target = items.find((item) => item.id === deleteId);

  return (
    <AdminShell
      title="언론보도 관리"
      onLogout={() => {
        sessionStorage.removeItem(ADMIN_SESSION_KEY);
        window.location.reload();
      }}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-lg font-bold text-navy">언론보도 관리</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            제목·출처·링크주소를 등록합니다. 저장 시 Supabase press 테이블에 반영됩니다.
          </p>
        </div>
        <Link
          to="/admin/press/new"
          className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          새 언론보도 작성
        </Link>
      </div>

      <div className="mt-6">
        <label htmlFor="press-search" className="mb-2 block text-sm font-semibold text-navy">
          제목·출처 검색
        </label>
        <Input
          id="press-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="제목 또는 출처로 검색"
        />
      </div>

      {isError && (
        <p role="alert" className="mt-4 text-sm text-destructive">
          {errorMessage ?? "언론보도를 불러오지 못했습니다."}
        </p>
      )}
      {isLoading && <p className="mt-4 text-sm text-muted-foreground">목록을 불러오는 중입니다…</p>}

      <div className="mt-6 overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-surface text-navy">
            <tr>
              <th className="px-4 py-3 font-semibold">제목</th>
              <th className="px-4 py-3 font-semibold">출처</th>
              <th className="px-4 py-3 font-semibold">날짜</th>
              <th className="px-4 py-3 font-semibold">상단 고정</th>
              <th className="px-4 py-3 font-semibold">노출 순서</th>
              <th className="px-4 py-3 font-semibold">노출여부</th>
              <th className="px-4 py-3 font-semibold">링크</th>
              <th className="px-4 py-3 font-semibold">관리</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-muted-foreground">
                  해당하는 언론보도가 없습니다.
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr key={item.id} className="border-t border-border">
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-navy">{item.title}</span>
                      {item.isPinned ? <Badge>상단 고정</Badge> : null}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{item.source}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatPressDate(item.publishedDate) || "-"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{item.isPinned ? "예" : "아니오"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{item.sortOrder ?? "-"}</td>
                  <td className="px-4 py-3">
                    <Badge variant={item.published ? "default" : "secondary"}>
                      {visibilityLabel(item.published)}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={item.articleUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-primary hover:underline"
                    >
                      원문 보기
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        to="/admin/press/$id"
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
            <AlertDialogTitle>이 언론보도를 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              {target ? `「${target.title}」 항목이 Supabase press 테이블에서 삭제됩니다.` : ""}
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
                    toast.success("언론보도가 삭제되었습니다.");
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
