import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteLayout, PageHero } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/support/")({
  head: () => ({
    meta: [
      { title: "Support | 와이즈인컴퍼니" },
      {
        name: "description",
        content: "문의하기, 자주 묻는 질문, 공지사항 등 와이즈인컴퍼니 고객 지원 안내입니다.",
      },
      { property: "og:title", content: "Support | 와이즈인컴퍼니" },
      { property: "og:description", content: "와이즈인컴퍼니 고객 지원 안내." },
    ],
  }),
  component: Page,
});

const LINKS = [
  { to: "/support/contact", title: "Contact Us", desc: "과제와 필요한 서비스를 남겨 주시면 상담을 통해 방향을 함께 찾습니다." },
  { to: "/support/faq", title: "FAQ", desc: "데이터 분석, AI 솔루션, 플랫폼, 국비교육, 상담에 관한 자주 묻는 질문입니다." },
  { to: "/support/notices", title: "공지사항", desc: "회사 소식과 운영 안내를 확인하실 수 있습니다." },
] as const;

function Page() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Support"
        title="고객 지원"
        description="문의하기, 자주 묻는 질문, 공지사항을 확인하실 수 있습니다."
      />
      <div className="container-page grid gap-6 py-16 md:grid-cols-3 md:py-20">
        {LINKS.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="rounded-xl border border-border bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <h2 className="text-lg font-bold text-navy">{link.title}</h2>
            <p className="mt-3 text-sm text-muted-foreground">{link.desc}</p>
          </Link>
        ))}
      </div>
    </SiteLayout>
  );
}
