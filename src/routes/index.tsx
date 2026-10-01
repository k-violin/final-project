import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, Bot, GraduationCap, LayoutGrid, ArrowRight, Building2, ShieldCheck, Award } from "lucide-react";

import { SiteLayout } from "@/components/site/SiteLayout";
import { ContactButton } from "@/components/site/ContactButton";
import { RevealOnScroll } from "@/components/site/RevealOnScroll";
import { TrustMetricsBar } from "@/components/site/TrustMetricsBar";
import { BUSINESS_CARDS, KEY_PROJECTS } from "@/lib/site";
import { formatBlogDate } from "@/lib/blog-mock";
import { fetchTrustMetrics, fetchLatestPosts } from "@/lib/db";
import heroImage from "@/assets/hero-data-network.jpg";
import project1 from "@/assets/project-neutral-1.jpg";
import project2 from "@/assets/project-neutral-2.jpg";
import serviceDataAnalysis from "@/assets/service-data-analysis.jpg";
import serviceAi from "@/assets/service-ai-solution.jpg";
import servicePlatform from "@/assets/service-platform.jpg";
import serviceEducation from "@/assets/service-education.jpg";

export const Route = createFileRoute("/")({
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData({
        queryKey: ["trust-metrics"],
        queryFn: fetchTrustMetrics,
      }),
      context.queryClient.ensureQueryData({
        queryKey: ["blog-preview"],
        queryFn: () => fetchLatestPosts(3),
      }),
    ]),
  head: () => ({
    meta: [
      { title: "와이즈인컴퍼니 | 데이터 분석과 AI 솔루션" },
      {
        name: "description",
        content:
          "공공기관과 기업의 의사결정을 돕는 데이터 분석부터 AI 솔루션과 마케팅 자동화까지. 와이즈인컴퍼니.",
      },
      { property: "og:title", content: "와이즈인컴퍼니 | 데이터 분석과 AI 솔루션" },
      {
        property: "og:description",
        content: "데이터와 AI로 서비스의 새로운 세계를 엽니다.",
      },
    ],
  }),
  component: Home,
});

const CERTIFICATIONS = [
  { title: "기업부설연구소 · 벤처기업 인증", year: "2012", note: "취득", icon: Building2 },
  { title: "CSAP 클라우드 보안인증", year: "2024", note: "취득", icon: ShieldCheck },
  { title: "혁신조달 제품", year: "2025", note: "취득", icon: Award },
];
const SERVICE_REVEALS = ["from-up", "from-left", "from-right", "from-scale"] as const;
const ICONS = [BarChart3, Bot, LayoutGrid, GraduationCap];
const PROJECT_IMAGES = [project1, project2];
const SERVICE_IMAGES = [
  { src: serviceDataAnalysis, alt: "데이터 분석 대시보드가 표시된 노트북이 놓인 사무 공간" },
  { src: serviceAi, alt: "밝은 사무 공간 위에 표현된 푸른색 네트워크 노드 그래픽" },
  { src: servicePlatform, alt: "금융 자산 화면이 표시된 스마트폰과 계산기, 동전" },
  { src: serviceEducation, alt: "노트북이 놓인 밝은 강의실과 빈 스크린" },
];

function Home() {
  const { data: posts } = useQuery({ queryKey: ["blog-preview"], queryFn: () => fetchLatestPosts(3) });

  return (
    <SiteLayout>
      {/* 히어로 */}
      <section
        data-reveal-skip
        className="relative isolate flex min-h-[calc(100svh-4rem)] items-center overflow-hidden bg-navy md:min-h-[calc(100svh-5rem)]"
      >
        <img
          src={heroImage}
          alt=""
          width={1920}
          height={1088}
          fetchPriority="high"
          className="hero-kenburns absolute inset-0 size-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-navy/50 md:bg-navy/25" aria-hidden="true" />
        <div
          className="absolute inset-0 bg-gradient-to-r from-navy via-navy/88 to-navy/40 md:via-navy/80 md:to-transparent"
          aria-hidden="true"
        />
        <div
          className="hero-orb pointer-events-none absolute -left-24 top-10 size-72 rounded-full bg-cyan/30 blur-3xl md:size-[26rem]"
          aria-hidden="true"
        />
        <div
          className="hero-orb-delayed pointer-events-none absolute -right-10 bottom-0 size-80 rounded-full bg-primary/35 blur-3xl md:size-[30rem]"
          aria-hidden="true"
        />
        <div
          className="hero-drift pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-cyan/10 to-transparent"
          aria-hidden="true"
        />

        <div className="container-page relative py-16 md:py-20">
          <div className="max-w-2xl">
            <h1 className="hero-copy text-3xl font-bold leading-snug text-white sm:text-4xl md:text-5xl md:leading-tight">
              데이터와 AI로
              <br />
              서비스의 새로운 세계를 엽니다.
            </h1>
            <p className="hero-copy hero-copy-2 mt-6 text-base leading-relaxed text-white/85 md:text-lg">
              공공기관과 기업의 의사결정을 돕는 데이터 분석부터
              <br className="hidden sm:block" /> AI 솔루션과 마케팅 자동화까지.
            </p>
            <div className="hero-copy hero-copy-3 mt-9">
              <ContactButton className="px-7 py-3 text-base" />
            </div>
          </div>
        </div>
      </section>

      <TrustMetricsBar />

      {/* 사업 개요 */}
      <section className="bg-surface">
        <div className="container-page py-16 md:py-24">
          <h2 className="text-2xl font-bold text-navy md:text-3xl">
            데이터에서 실행까지, WiseIN의 서비스
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground">
            공공기관과 기업의 의사결정을 돕기 위해 분석으로 방향을 잡고, 자동화로 실행하며,
            교육으로 역량을 이어 갑니다.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {BUSINESS_CARDS.map((card, i) => {
              const Icon = ICONS[i]!;
              const image = SERVICE_IMAGES[i]!;
              return (
                <RevealOnScroll
                  key={card.title}
                  as="article"
                  effect={SERVICE_REVEALS[i]!}
                  delay={i * 110}
                  className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <Link
                    to={card.to}
                    className="block shrink-0 overflow-hidden bg-surface"
                    tabIndex={-1}
                    aria-hidden="true"
                  >
                    <img
                      src={image.src}
                      alt=""
                      width={1024}
                      height={640}
                      loading="lazy"
                      className="aspect-[16/10] h-auto w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </Link>
                  <div className="flex flex-1 flex-col p-7">
                    <span className="inline-flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="size-6" aria-hidden="true" />
                    </span>
                    <h3 className="mt-5 text-lg font-bold text-navy">
                      <Link to={card.to} className="hover:text-primary">
                        {card.title}
                      </Link>
                    </h3>
                    <p className="mt-3 line-clamp-3 min-h-[3.75rem] flex-1 text-sm leading-relaxed text-muted-foreground">
                      <Link to={card.to} className="hover:text-foreground">
                        {card.description}
                      </Link>
                    </p>
                    <span className="mt-6">
                      <ContactButton area={card.area} />
                    </span>
                  </div>
                </RevealOnScroll>
              );
            })}
          </div>
        </div>
      </section>

      {/* 주요 프로젝트 */}
      <section className="bg-white">
        <div className="container-page py-16 md:py-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-navy md:text-3xl">주요 프로젝트</h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
                공개 가능한 범위에서 소개하는 최근 수행 과제입니다. 더 많은 사례는 Portfolio에서
                확인할 수 있습니다.
              </p>
            </div>
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
            >
              전체 프로젝트 보기 <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {KEY_PROJECTS.map((p, i) => (
              <RevealOnScroll
                key={p.title}
                as="article"
                effect={i % 2 === 0 ? "from-left" : "from-right"}
                delay={i * 120}
                className="overflow-hidden rounded-xl border border-border bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <img
                  src={p.image || PROJECT_IMAGES[i]}
                  alt={p.imageAlt || ""}
                  loading="lazy"
                  width={1024}
                  height={640}
                  className="h-44 w-full object-cover"
                />
                <div className="p-6">
                  <p className="text-sm font-semibold text-primary">
                    {p.client} · {p.year}
                  </p>
                  <h3 className="mt-2 text-lg font-bold leading-snug text-navy">{p.title}</h3>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface">
        <div className="container-page py-16 md:py-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-navy md:text-3xl">Blog</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                데이터와 AI에 관한 최근 글을 전합니다.
              </p>
            </div>
            <Link
              to="/blog"
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
            >
              Blog 전체 보기 <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
          {(posts ?? []).length === 0 ? (
            <p className="mt-8 text-sm text-muted-foreground">아직 공개된 글이 없습니다.</p>
          ) : (
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {(posts ?? []).map((post, i) => (
                <RevealOnScroll
                  key={post.id}
                  as="article"
                  effect={(["from-up", "from-scale", "from-blur"] as const)[i % 3]!}
                  delay={i * 100}
                  className="overflow-hidden rounded-xl border border-border bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <Link to="/blog/$id" params={{ id: post.id }} tabIndex={-1} aria-hidden="true">
                    <img
                      src={post.imagePath}
                      alt=""
                      className="h-40 w-full object-cover"
                    />
                  </Link>
                  <div className="p-6">
                    <p className="text-xs font-semibold text-primary">
                      {post.category}
                      {formatBlogDate(post.writtenDate) || formatBlogDate(post.createdAt)
                        ? ` · ${formatBlogDate(post.writtenDate) || formatBlogDate(post.createdAt)}`
                        : ""}
                    </p>
                    <h3 className="mt-2 text-base font-bold leading-snug text-navy">
                      <Link to="/blog/$id" params={{ id: post.id }} className="hover:text-primary">
                        {post.title}
                      </Link>
                    </h3>
                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                      {post.content.replace(/\s+/g, " ").trim()}
                    </p>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 인증 내역 */}
      <section className="border-t border-border bg-primary/5" aria-label="와이즈컴퍼니를 신뢰할 수 있는 이유">
        <div className="container-page py-16 md:py-20">
          <h2 className="text-center text-2xl font-bold text-navy md:text-3xl">
            <span className="text-primary">와이즈컴퍼니</span>를 신뢰할 수 있는 이유
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {CERTIFICATIONS.map((item, i) => {
              const Icon = item.icon;
              return (
                <RevealOnScroll
                  key={item.title}
                  effect={SERVICE_REVEALS[i] ?? "from-up"}
                  delay={i * 120}
                  className="rounded-2xl border border-primary/15 bg-white px-6 py-8 text-center shadow-sm"
                >
                  <span className="mx-auto inline-flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="size-8" strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <p className="mt-5 text-lg font-bold leading-snug text-navy md:text-xl">{item.title}</p>
                  <p className="mt-2 text-sm font-medium text-primary">{item.note}</p>
                  <p className="mt-4 text-sm text-muted-foreground">{item.year}년</p>
                </RevealOnScroll>
              );
            })}
          </div>
        </div>
      </section>

      {/* 최종 CTA */}
      <section className="bg-navy">
        <div className="container-page py-16 text-center md:py-20">
          <h2 className="text-2xl font-bold text-white md:text-3xl">
            데이터와 AI로 해결하고 싶은 과제가 있으신가요?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/75">
            필요한 서비스와 고민을 남겨주시면 상담을 통해 함께 방향을 찾겠습니다.
          </p>
          <div className="mt-8">
            <ContactButton className="px-7 py-3 text-base" />
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
