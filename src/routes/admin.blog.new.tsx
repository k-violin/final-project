import { createFileRoute } from "@tanstack/react-router";

import { AdminShell } from "@/components/admin/AdminShell";
import { BlogPostForm } from "@/components/admin/BlogPostForm";
import { useAdminBlogPosts } from "@/hooks/useBlogPosts";
import { ADMIN_SESSION_KEY } from "@/lib/admin-auth";

export const Route = createFileRoute("/admin/blog/new")({
  ssr: false,
  component: Page,
});

function Page() {
  const { save } = useAdminBlogPosts();

  return (
    <AdminShell
      title="새 글 작성"
      onLogout={() => {
        sessionStorage.removeItem(ADMIN_SESSION_KEY);
        window.location.reload();
      }}
    >
      <BlogPostForm onSave={save} />
    </AdminShell>
  );
}
