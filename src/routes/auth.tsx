import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "로그인 | 와이즈인컴퍼니" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: Page,
});

function Page() {
  const navigate = useNavigate();
  useEffect(() => {
    void navigate({ to: "/admin", replace: true });
  }, [navigate]);
  return <p className="p-10 text-sm text-muted-foreground">관리자 페이지로 이동합니다…</p>;
}
