import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { AdminShell } from "@/components/admin/AdminShell";
import { BlogPostForm } from "@/components/admin/BlogPostForm";
import { useAdminBlogPost, useAdminBlogPosts } from "@/hooks/useBlogPosts";
import { ADMIN_SESSION_KEY } from "@/lib/admin-auth";

export const Route = createFileRoute("/admin/blog/$id")({
  ssr: false,
  component: Page,
});

function Page() {
  const { id } = Route.useParams();
  const { save } = useAdminBlogPosts();
  const { data: post, isLoading, isError } = useAdminBlogPost(id);
  const navigate = useNavigate();

  return (
    <AdminShell
      title="글 수정"
      onLogout={() => {
        sessionStorage.removeItem(ADMIN_SESSION_KEY);
        window.location.reload();
      }}
    >
      {isLoading ? (
        <p className="text-sm text-muted-foreground">글을 불러오는 중입니다…</p>
      ) : isError ? (
        <p className="text-sm text-destructive">글을 불러오지 못했습니다.</p>
      ) : post ? (
        <BlogPostForm initial={post} onSave={save} />
      ) : (
        <div>
          <p className="text-sm text-muted-foreground">글을 찾을 수 없습니다.</p>
          <button
            type="button"
            onClick={() => void navigate({ to: "/admin/blog" })}
            className="mt-4 rounded-md border border-border px-4 py-2 text-sm font-semibold text-navy"
          >
            목록으로
          </button>
        </div>
      )}
    </AdminShell>
  );
}
