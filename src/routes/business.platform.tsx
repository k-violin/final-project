import { createFileRoute } from "@tanstack/react-router";

import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { ServiceSections } from "@/components/site/ServiceSections";

import svcRichway from "@/assets/svc-richway.jpg";

export const Route = createFileRoute("/business/platform")({
  head: () => ({
    meta: [
      { title: "플랫폼 서비스 | 와이즈인컴퍼니" },
      {
        name: "description",
        content: "개인 사용자를 위한 금융 데이터 분석·자산관리 지원 플랫폼 Richway(부자플랫폼).",
      },
      { property: "og:title", content: "플랫폼 서비스 | 와이즈인컴퍼니" },
      {
        property: "og:description",
        content: "금융 데이터 분석 및 자산관리를 위한 Richway(부자플랫폼)를 운영합니다.",
      },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Business"
        title="플랫폼 서비스"
        description="금융 데이터 분석 및 자산관리를 위한 Richway(부자플랫폼)를 운영합니다."
      />
      <p className="container-page max-w-3xl pt-12 text-base leading-relaxed text-muted-foreground md:pt-16">
        와이즈인컴퍼니가 자체 운영하는 개인 대상 플랫폼입니다. 외부 가입·결제 버튼은 두지
        않으며, 이용 방법과 안내는 문의를 통해 안내드립니다.
      </p>
      <ServiceSections
        area="platform"
        blocks={[
          {
            title: "Richway (부자플랫폼)",
            image: svcRichway,
            imageAlt: "금융 데이터 화면이 표시된 스마트폰",
            description:
              "개인 사용자를 대상으로 금융 데이터 분석과 자산관리를 지원하는 자체 운영 플랫폼입니다. 자산 현황을 데이터로 살펴보고 관리 판단에 참고할 수 있도록 돕습니다.",
            features: [
              "금융 데이터 기반 자산 현황 파악",
              "개인 자산관리를 돕는 분석 기능",
              "플랫폼 이용 안내 및 문의 대응",
            ],
            uses: [
              "보유 자산과 금융 데이터를 한곳에서 살펴보고 싶을 때",
              "자산관리에 필요한 분석 자료를 참고하고 싶을 때",
            ],
            benefits: [
              "흩어진 금융 정보를 자산 관점에서 정리해 볼 수 있습니다.",
              "이용 방법과 추가 안내는 상담을 통해 확인할 수 있습니다.",
            ],
          },
        ]}
      />
    </SiteLayout>
  );
}
