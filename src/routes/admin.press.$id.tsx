import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { AdminShell } from "@/components/admin/AdminShell";
import { PressForm } from "@/components/admin/PressForm";
import { useAdminPress, useAdminPressItem } from "@/hooks/useAdminPress";
import { ADMIN_SESSION_KEY } from "@/lib/admin-auth";

export const Route = createFileRoute("/admin/press/$id")({
  ssr: false,
  component: Page,
});

function Page() {
  const { id } = Route.useParams();
  const { save } = useAdminPress();
  const { data: item, isLoading, isError } = useAdminPressItem(id);
  const navigate = useNavigate();

  return (
    <AdminShell
      title="언론보도 수정"
      onLogout={() => {
        sessionStorage.removeItem(ADMIN_SESSION_KEY);
        window.location.reload();
      }}
    >
      {isLoading ? (
        <p className="text-sm text-muted-foreground">언론보도를 불러오는 중입니다…</p>
      ) : isError ? (
        <p className="text-sm text-destructive">언론보도를 불러오지 못했습니다.</p>
      ) : item ? (
        <PressForm initial={item} onSave={save} />
      ) : (
        <div>
          <p className="text-sm text-muted-foreground">언론보도를 찾을 수 없습니다.</p>
          <button
            type="button"
            onClick={() => void navigate({ to: "/admin/press" })}
            className="mt-4 rounded-md border border-border px-4 py-2 text-sm font-semibold text-navy"
          >
            목록으로
          </button>
        </div>
      )}
    </AdminShell>
  );
}
