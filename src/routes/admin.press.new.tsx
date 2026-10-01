import { createFileRoute } from "@tanstack/react-router";

import { AdminShell } from "@/components/admin/AdminShell";
import { PressForm } from "@/components/admin/PressForm";
import { useAdminPress } from "@/hooks/useAdminPress";
import { ADMIN_SESSION_KEY } from "@/lib/admin-auth";

export const Route = createFileRoute("/admin/press/new")({
  ssr: false,
  component: Page,
});

function Page() {
  const { save } = useAdminPress();

  return (
    <AdminShell
      title="새 언론보도 작성"
      onLogout={() => {
        sessionStorage.removeItem(ADMIN_SESSION_KEY);
        window.location.reload();
      }}
    >
      <PressForm onSave={save} />
    </AdminShell>
  );
}
