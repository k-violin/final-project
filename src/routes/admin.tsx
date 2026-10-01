import { useEffect, useState } from "react";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";

import { Logo } from "@/components/site/Logo";
import { Input } from "@/components/ui/input";
import { ADMIN_SESSION_KEY, loginAdmin } from "@/lib/admin-auth";

export const Route = createFileRoute("/admin")({
  ssr: false,
  validateSearch: (search: Record<string, unknown>): { tab?: string } => ({
    tab: typeof search["tab"] === "string" ? search["tab"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "관리자 | 와이즈인컴퍼니" },
      { name: "robots", content: "noindex, nofollow" },
      { name: "description", content: "와이즈인컴퍼니 관리자 페이지입니다." },
    ],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    setAuthed(sessionStorage.getItem(ADMIN_SESSION_KEY) === "ok");
    setReady(true);
  }, []);

  if (!ready) {
    return <p className="p-10 text-sm text-muted-foreground">불러오는 중입니다…</p>;
  }

  if (!authed) {
    return <AdminLogin onSuccess={() => setAuthed(true)} />;
  }

  return <Outlet />;
}

function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const signIn = useServerFn(loginAdmin);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const result = await signIn({ data: { username, password } });
      if (!result.ok) {
        setError("아이디 또는 비밀번호가 올바르지 않습니다.");
        return;
      }
      sessionStorage.setItem(ADMIN_SESSION_KEY, "ok");
      onSuccess();
    } catch {
      setError("로그인에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4">
      <div className="w-full max-w-sm rounded-xl border border-border bg-white p-8">
        <Logo />
        <h1 className="mt-6 text-xl font-bold text-navy">관리자 로그인</h1>
        <p className="mt-2 text-sm text-muted-foreground">아이디와 비밀번호를 입력해 주세요.</p>
        <form className="mt-6 space-y-4" onSubmit={onSubmit} noValidate>
          <div>
            <label htmlFor="admin-id" className="mb-2 block text-sm font-semibold text-navy">
              아이디
            </label>
            <Input
              id="admin-id"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="admin-password" className="mb-2 block text-sm font-semibold text-navy">
              비밀번호
            </label>
            <Input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
          >
            {busy ? "로그인 중…" : "로그인"}
          </button>
        </form>
      </div>
    </div>
  );
}
