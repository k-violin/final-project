import { createFileRoute } from "@tanstack/react-router";

import { AdminShell } from "@/components/admin/AdminShell";
import { NoticeForm } from "@/components/admin/NoticeForm";
import { useAdminNotices } from "@/hooks/useAdminNotices";
import { ADMIN_SESSION_KEY } from "@/lib/admin-auth";

export const Route = createFileRoute("/admin/notices/new")({
  ssr: false,
  component: Page,
});

function Page() {
  const { save } = useAdminNotices();

  return (
    <AdminShell
      title="새 공지 작성"
      onLogout={() => {
        sessionStorage.removeItem(ADMIN_SESSION_KEY);
        window.location.reload();
      }}
    >
      <NoticeForm onSave={save} />
    </AdminShell>
  );
}
