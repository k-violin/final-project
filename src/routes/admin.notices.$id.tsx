import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { AdminShell } from "@/components/admin/AdminShell";
import { NoticeForm } from "@/components/admin/NoticeForm";
import { useAdminNotice, useAdminNotices } from "@/hooks/useAdminNotices";
import { ADMIN_SESSION_KEY } from "@/lib/admin-auth";

export const Route = createFileRoute("/admin/notices/$id")({
  ssr: false,
  component: Page,
});

function Page() {
  const { id } = Route.useParams();
  const { save } = useAdminNotices();
  const { data: notice, isLoading, isError } = useAdminNotice(id);
  const navigate = useNavigate();

  return (
    <AdminShell
      title="공지 수정"
      onLogout={() => {
        sessionStorage.removeItem(ADMIN_SESSION_KEY);
        window.location.reload();
      }}
    >
      {isLoading ? (
        <p className="text-sm text-muted-foreground">공지를 불러오는 중입니다…</p>
      ) : isError ? (
        <p className="text-sm text-destructive">공지를 불러오지 못했습니다.</p>
      ) : notice ? (
        <NoticeForm initial={notice} onSave={save} />
      ) : (
        <div>
          <p className="text-sm text-muted-foreground">공지를 찾을 수 없습니다.</p>
          <button
            type="button"
            onClick={() => void navigate({ to: "/admin/notices" })}
            className="mt-4 rounded-md border border-border px-4 py-2 text-sm font-semibold text-navy"
          >
            목록으로
          </button>
        </div>
      )}
    </AdminShell>
  );
}
