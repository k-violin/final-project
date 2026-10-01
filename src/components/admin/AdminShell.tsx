import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  FileText,
  FolderKanban,
  Megaphone,
  Newspaper,
  MessageSquare,
  LayoutDashboard,
} from "lucide-react";

import { Logo } from "@/components/site/Logo";
import { cn } from "@/lib/utils";
import { useServerFn } from "@tanstack/react-start";
import { ADMIN_SESSION_KEY, logoutAdmin } from "@/lib/admin-auth";

type AdminTab = "home";

const SIDE_LINKS: {
  label: string;
  icon: typeof FileText;
  to: "/admin" | "/admin/blog" | "/admin/portfolio" | "/admin/notices" | "/admin/press" | "/admin/inquiries";
  tab?: AdminTab;
}[] = [
  { label: "대시보드", icon: LayoutDashboard, to: "/admin", tab: "home" },
  { label: "블로그 관리", icon: FileText, to: "/admin/blog" },
  { label: "포트폴리오 관리", icon: FolderKanban, to: "/admin/portfolio" },
  { label: "공지사항 관리", icon: Megaphone, to: "/admin/notices" },
  { label: "언론보도 관리", icon: Newspaper, to: "/admin/press" },
  { label: "문의사항", icon: MessageSquare, to: "/admin/inquiries" },
];

export function AdminShell({
  title,
  children,
  onLogout,
}: {
  title: string;
  children: ReactNode;
  onLogout: () => void;
}) {
  const logout = useServerFn(logoutAdmin);
  const { pathname, search } = useRouterState({
    select: (s) => ({ pathname: s.location.pathname, search: s.location.search }),
  });
  const tab = typeof search === "object" && search && "tab" in search ? String(search.tab) : "home";

  return (
    <div className="min-h-screen bg-surface md:flex">
      <aside className="border-b border-border bg-navy text-white md:flex md:w-60 md:flex-col md:border-b-0 md:border-r md:border-white/10">
        <div className="border-b border-white/10 px-5 py-5">
          <p className="text-xs font-semibold tracking-wide text-cyan">ADMIN</p>
          <p className="mt-1 text-base font-bold">와이즈인컴퍼니</p>
        </div>
        <nav className="flex gap-1 overflow-x-auto p-3 md:flex-1 md:flex-col">
          {SIDE_LINKS.map((item) => {
            const Icon = item.icon;
            const active =
              item.to === "/admin"
                ? pathname === "/admin" && (item.tab ?? "home") === (tab || "home")
                : pathname.startsWith(item.to);
            const className = cn(
              "inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-semibold",
              active ? "bg-white/15 text-white" : "text-white/70 hover:bg-white/10 hover:text-white",
            );
            if (item.to !== "/admin") {
              return (
                <Link key={item.label} to={item.to} className={className}>
                  <Icon className="size-4" aria-hidden="true" />
                  {item.label}
                </Link>
              );
            }
            return (
              <Link
                key={item.label}
                to="/admin"
                search={{ tab: item.tab ?? "home" }}
                className={className}
              >
                <Icon className="size-4" aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3">
          <button
            type="button"
            onClick={() => {
              sessionStorage.removeItem(ADMIN_SESSION_KEY);
              void logout().finally(() => onLogout());
            }}
            className="w-full rounded-lg border border-white/20 px-3 py-2 text-sm font-semibold text-white/80 hover:bg-white/10"
          >
            로그아웃
          </button>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="border-b border-border bg-white">
          <div className="flex items-center justify-between px-5 py-4 md:px-8">
            <h1 className="text-lg font-bold text-navy md:text-xl">{title}</h1>
            <Logo />
          </div>
        </header>
        <div className="p-5 md:p-8">
          <div className="rounded-xl border border-border bg-white p-5 md:p-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
