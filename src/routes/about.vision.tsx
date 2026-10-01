import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { ContactButton } from "@/components/site/ContactButton";
import { SLOGAN } from "@/lib/site";
import { fetchSettings } from "@/lib/db";
import logo from "@/assets/logo.png";

export const Route = createFileRoute("/about/vision")({
  head: () => ({
    meta: [
      { title: "비전과 미션 | 와이즈인컴퍼니" },
      {
        name: "description",
        content: "데이터와 AI로 여는 서비스 세계. 와이즈인컴퍼니의 비전과 미션입니다.",
      },
      { property: "og:title", content: "비전과 미션 | 와이즈인컴퍼니" },
      { property: "og:description", content: "데이터와 AI로 여는 서비스 세계." },
    ],
  }),
  component: Page,
});

const FALLBACK_VISION =
  "데이터와 AI로 여는 서비스 세계. 공공기관과 기업이 데이터를 근거로 더 나은 결정을 내리도록 돕습니다.";
const FALLBACK_MISSION =
  "와이즈온(WiseON)으로 공공기관의 조사분석 업무를 자동화하고, 23년 리서치 경험을 바탕으로 데이터 인사이트를 제공합니다. 기업부설연구소와 국비교육을 통해 기술을 연구하고 전문 인재를 양성합니다.";

function Page() {
  const { data: settings } = useQuery({ queryKey: ["settings"], queryFn: fetchSettings });
  const vision = settings?.["vision_draft"]?.trim() || FALLBACK_VISION;
  const mission = settings?.["mission_draft"]?.trim() || FALLBACK_MISSION;

  return (
    <SiteLayout>
      <PageHero eyebrow="About Us" title="비전과 미션" description={SLOGAN} />
      <section className="container-page py-16 md:py-24">
        <img
          src="/vision.png"
          alt="MISSION과 VISION이 적힌 퍼즐 조각"
          width={1600}
          height={900}
          className="mb-14 h-72 w-full rounded-xl object-cover object-center md:mb-16 md:h-[26rem]"
        />

        <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div className="relative mx-auto aspect-square w-full max-w-[22rem] md:max-w-[24rem]">
            <div className="absolute left-[12%] top-[2%] z-10 flex size-[82%] items-center justify-center rounded-full bg-white p-9 shadow-md ring-1 ring-border md:p-11">
              <img
                src={logo}
                alt="와이즈인컴퍼니 WiseIN Company"
                width={460}
                height={94}
                className="h-auto w-full object-contain"
              />
            </div>
            <div
              className="absolute bottom-[4%] left-0 z-20 size-[60%] rounded-full bg-gradient-to-br from-primary/20 to-cyan/15"
              aria-hidden="true"
            />
          </div>

          <div>
            <h2 className="text-3xl font-bold text-navy md:text-4xl">Vision</h2>
            <p className="mt-4 max-w-xl whitespace-pre-wrap text-base leading-relaxed text-muted-foreground md:text-lg">
              {vision}
            </p>

            <h2 className="mt-10 text-3xl font-bold text-navy md:text-4xl">Mission</h2>
            <p className="mt-4 max-w-xl whitespace-pre-wrap text-base leading-relaxed text-muted-foreground md:text-lg">
              {mission}
            </p>
          </div>
        </div>

        <div className="mt-14 flex justify-center">
          <ContactButton />
        </div>
      </section>
    </SiteLayout>
  );
}
