import { createFileRoute } from "@tanstack/react-router";

import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { ContactButton } from "@/components/site/ContactButton";
import { SLOGAN } from "@/lib/site";

export const Route = createFileRoute("/about/")({
  head: () => ({
    meta: [
      { title: "회사개요 | 와이즈인컴퍼니" },
      {
        name: "description",
        content:
          "2003년 설립. 데이터와 AI 기술로 공공기관과 기업의 의사결정을 지원하는 전문 기업입니다.",
      },
      { property: "og:title", content: "회사개요 | 와이즈인컴퍼니" },
      {
        property: "og:description",
        content: "와이즈인컴퍼니는 데이터와 AI로 공공기관과 기업의 의사결정을 지원합니다.",
      },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <SiteLayout>
      <PageHero eyebrow="About Us" title="회사개요" description={SLOGAN} />
      <div className="container-page py-16 md:py-20">
        <img
          src="/company.jpg"
          alt="와이즈인컴퍼니 사옥이 있는 도심 빌딩 전경"
          width={1600}
          height={900}
          className="mb-14 h-72 w-full rounded-xl object-cover object-center md:mb-16 md:h-[26rem]"
        />

        <div className="w-full max-w-4xl space-y-6 text-[1.05rem] leading-[1.85] text-foreground/80 md:text-lg md:leading-[1.9]">
          <p className="font-bold text-navy">
            와이즈인컴퍼니는 2003년 설립 이래, 데이터와 AI 기술을 통해 공공기관과 기업의
            의사결정을 지원하는 전문 기업입니다.
          </p>
          <p>
            23년간 축적된 리서치 및 데이터 분석 경험을 바탕으로, 국내 최초 통계분석 온라인
            사업을 시작하여 현재는 1,400개 이상의 공공기관에 조사분석 AI 솔루션을 제공하고
            있습니다.
          </p>
          <p>
            우리는 설문조사부터 빅데이터 분석, AI 솔루션 개발까지 데이터의 전 과정을 아우르는
            전문 역량을 보유하고 있으며, 특히 공공기관을 위한 조사분석 자동화 플랫폼
            ‘와이즈온(WiseON)’을 통해 디지털 전환을 선도하고 있습니다.
          </p>
          <p>
            기업부설연구소와 벤처기업 인증을 보유한 혁신 기업으로, CSAP 클라우드 보안인증과
            혁신조달 제품 선정을 통해 공공기관의 신뢰를 받고 있습니다.
          </p>
          <p>
            또한 국비지원 교육 프로그램을 통해 데이터 분야 전문 인재를 양성하고,
            리치웨이(RichWay) 부자 플랫폼을 통해 개인 금융 관리 서비스도 제공하며, 데이터와
            AI로 세상을 이롭게 하는 비전을 실현해가고 있습니다.
          </p>
        </div>

        <div className="mt-10 flex justify-center">
          <ContactButton />
        </div>
      </div>
    </SiteLayout>
  );
}
