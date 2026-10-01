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
import { useAdminBlogPosts } from "@/hooks/useBlogPosts";
import { ADMIN_SESSION_KEY } from "@/lib/admin-auth";
import { BLOG_CATEGORIES, blogPublishedLabel, formatBlogDate } from "@/lib/blog-mock";
import { sortBoardItems } from "@/lib/content-sort";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/blog/")({
  ssr: false,
  component: BlogManagePage,
});

function BlogManagePage() {
  const { posts, remove, isLoading, isError, errorMessage } = useAdminBlogPosts();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sortBoardItems(
      posts.filter((post) => {
        const matchesQuery = !q || post.title.toLowerCase().includes(q);
        const matchesCategory = !category || post.category === category;
        return matchesQuery && matchesCategory;
      }),
      "default",
      (post) => post.writtenDate,
    );
  }, [posts, query, category]);

  const target = posts.find((post) => post.id === deleteId);

  return (
    <AdminShell
      title="블로그 관리"
      onLogout={() => {
        sessionStorage.removeItem(ADMIN_SESSION_KEY);
        window.location.reload();
      }}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-lg font-bold text-navy">블로그 관리</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            글을 작성·수정·삭제할 수 있습니다. 저장 시 Supabase blog 테이블에 반영됩니다.
          </p>
        </div>
        <Link
          to="/admin/blog/new"
          className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          새 글 작성
        </Link>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-[1fr_200px]">
        <div>
          <label htmlFor="blog-search" className="mb-2 block text-sm font-semibold text-navy">
            제목 검색
          </label>
          <Input
            id="blog-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="제목으로 검색"
          />
        </div>
        <div>
          <label htmlFor="blog-category" className="mb-2 block text-sm font-semibold text-navy">
            카테고리
          </label>
          <select
            id="blog-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="">전체</option>
            {BLOG_CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isError && (
        <p role="alert" className="mt-4 text-sm text-destructive">
          {errorMessage ?? "블로그 글을 불러오지 못했습니다."}
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
                  해당하는 글이 없습니다.
                </td>
              </tr>
            ) : (
              filtered.map((post) => (
                <tr key={post.id} className="border-t border-border">
                  <td className="px-4 py-3">
                    <img src={post.imagePath} alt="" className="size-14 rounded object-cover" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-navy">{post.title}</span>
                      {post.isPinned ? <Badge>상단 고정</Badge> : null}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{post.category}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatBlogDate(post.writtenDate) || formatBlogDate(post.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{post.isPinned ? "예" : "아니오"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{post.sortOrder ?? "-"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{post.author || "-"}</td>
                  <td className="px-4 py-3">
                    <Badge variant={post.published ? "default" : "secondary"}>
                      {blogPublishedLabel(post.published)}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        to="/admin/blog/$id"
                        params={{ id: post.id }}
                        className="rounded-md border border-border px-3 py-1.5 text-xs font-semibold text-navy hover:bg-surface"
                      >
                        수정
                      </Link>
                      <button
                        type="button"
                        onClick={() => setDeleteId(post.id)}
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
            <AlertDialogTitle>이 블로그 글을 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              {target ? `「${target.title}」 글이 Supabase blog 테이블에서 삭제됩니다.` : ""}
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
                    toast.success("글이 삭제되었습니다.");
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
