import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { FileText, FolderKanban, Megaphone, Newspaper, MessageSquare } from "lucide-react";

import { AdminShell } from "@/components/admin/AdminShell";
import { ADMIN_SESSION_KEY } from "@/lib/admin-auth";

type AdminTab = "home";

export const Route = createFileRoute("/admin/")({
  ssr: false,
  validateSearch: (search: Record<string, unknown>): { tab?: AdminTab | "portfolio" | "notices" | "press" | "inquiries" } => ({
    tab:
      search["tab"] === "portfolio" ||
      search["tab"] === "notices" ||
      search["tab"] === "press" ||
      search["tab"] === "inquiries" ||
      search["tab"] === "home"
        ? (search["tab"] as AdminTab | "portfolio" | "notices" | "press" | "inquiries")
        : "home",
  }),
  component: AdminHome,
});

const TITLES: Record<AdminTab, string> = {
  home: "대시보드",
};

function AdminHome() {
  const { tab = "home" } = Route.useSearch();
  const navigate = useNavigate();

  useEffect(() => {
    if (tab === "portfolio") {
      void navigate({ to: "/admin/portfolio", replace: true });
    }
    if (tab === "notices") {
      void navigate({ to: "/admin/notices", replace: true });
    }
    if (tab === "press") {
      void navigate({ to: "/admin/press", replace: true });
    }
    if (tab === "inquiries") {
      void navigate({ to: "/admin/inquiries", replace: true });
    }
  }, [tab, navigate]);

  if (tab === "portfolio") {
    return <p className="p-10 text-sm text-muted-foreground">포트폴리오 관리로 이동합니다…</p>;
  }
  if (tab === "notices") {
    return <p className="p-10 text-sm text-muted-foreground">공지사항 관리로 이동합니다…</p>;
  }
  if (tab === "press") {
    return <p className="p-10 text-sm text-muted-foreground">언론보도 관리로 이동합니다…</p>;
  }
  if (tab === "inquiries") {
    return <p className="p-10 text-sm text-muted-foreground">문의사항으로 이동합니다…</p>;
  }

  return (
    <AdminShell
      title={TITLES[tab]}
      onLogout={() => {
        sessionStorage.removeItem(ADMIN_SESSION_KEY);
        void navigate({ to: "/admin" });
        window.location.reload();
      }}
    >
      <DashboardHome />
    </AdminShell>
  );
}

function DashboardHome() {
  const navigate = useNavigate();
  return (
    <div>
      <h2 className="text-lg font-bold text-navy">콘텐츠 관리</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        블로그, 포트폴리오, 공지사항, 언론보도는 이 화면에서 항목을 작성·수정할 수 있습니다. 홈페이지에서 접수된 문의는 문의사항에서 확인합니다.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <button
          type="button"
          onClick={() => void navigate({ to: "/admin/blog" })}
          className="rounded-xl border border-border p-5 text-left transition-colors hover:border-primary/40 hover:bg-surface"
        >
          <FileText className="size-6 text-primary" aria-hidden="true" />
          <p className="mt-3 text-base font-bold text-navy">블로그 관리</p>
          <p className="mt-1 text-sm text-muted-foreground">글 목록을 보고 새 글을 작성합니다.</p>
        </button>
        <button
          type="button"
          onClick={() => void navigate({ to: "/admin/portfolio" })}
          className="rounded-xl border border-border p-5 text-left transition-colors hover:border-primary/40 hover:bg-surface"
        >
          <FolderKanban className="size-6 text-primary" aria-hidden="true" />
          <p className="mt-3 text-base font-bold text-navy">포트폴리오 관리</p>
          <p className="mt-1 text-sm text-muted-foreground">프로젝트 사례를 등록하고 사이트에 공개합니다.</p>
        </button>
        <button
          type="button"
          onClick={() => void navigate({ to: "/admin/notices" })}
          className="rounded-xl border border-border p-5 text-left transition-colors hover:border-primary/40 hover:bg-surface"
        >
          <Megaphone className="size-6 text-primary" aria-hidden="true" />
          <p className="mt-3 text-base font-bold text-navy">공지사항 관리</p>
          <p className="mt-1 text-sm text-muted-foreground">공지사항을 작성하고 목록에서 수정·삭제합니다.</p>
        </button>
        <button
          type="button"
          onClick={() => void navigate({ to: "/admin/press" })}
          className="rounded-xl border border-border p-5 text-left transition-colors hover:border-primary/40 hover:bg-surface"
        >
          <Newspaper className="size-6 text-primary" aria-hidden="true" />
          <p className="mt-3 text-base font-bold text-navy">언론보도 관리</p>
          <p className="mt-1 text-sm text-muted-foreground">기사 제목·출처·링크를 등록하고 홈페이지에 공개합니다.</p>
        </button>
        <button
          type="button"
          onClick={() => void navigate({ to: "/admin/inquiries" })}
          className="rounded-xl border border-border p-5 text-left transition-colors hover:border-primary/40 hover:bg-surface"
        >
          <MessageSquare className="size-6 text-primary" aria-hidden="true" />
          <p className="mt-3 text-base font-bold text-navy">문의사항</p>
          <p className="mt-1 text-sm text-muted-foreground">홈페이지에서 접수된 문의를 확인하고 답변을 등록합니다.</p>
        </button>
      </div>
    </div>
  );
}
