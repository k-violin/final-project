import { createFileRoute } from "@tanstack/react-router";

import { AdminShell } from "@/components/admin/AdminShell";
import { PortfolioItemForm } from "@/components/admin/PortfolioItemForm";
import { useAdminPortfolioItems } from "@/hooks/usePortfolioItems";
import { ADMIN_SESSION_KEY } from "@/lib/admin-auth";

export const Route = createFileRoute("/admin/portfolio/new")({
  ssr: false,
  component: Page,
});

function Page() {
  const { save } = useAdminPortfolioItems();

  return (
    <AdminShell
      title="새 항목 작성"
      onLogout={() => {
        sessionStorage.removeItem(ADMIN_SESSION_KEY);
        window.location.reload();
      }}
    >
      <PortfolioItemForm onSave={save} />
    </AdminShell>
  );
}
