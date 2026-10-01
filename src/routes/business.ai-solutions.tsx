import { createFileRoute } from "@tanstack/react-router";

import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { ServiceSections } from "@/components/site/ServiceSections";

import svcSurvey from "@/assets/svc-survey-saas.jpg";
import svcMarketing from "@/assets/svc-marketing-ai.jpg";

export const Route = createFileRoute("/business/ai-solutions")({
  head: () => ({
    meta: [
      { title: "AI 솔루션 | 와이즈인컴퍼니" },
      {
        name: "description",
        content: "조사분석 자동화(공공 SaaS)와 AI 기반 마케팅 자동화 솔루션을 제공합니다.",
      },
      { property: "og:title", content: "AI 솔루션 | 와이즈인컴퍼니" },
      {
        property: "og:description",
        content: "조사분석 자동화와 AI 기반 마케팅 자동화로 반복 업무의 효율을 높입니다.",
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
        title="AI 솔루션"
        description="조사분석 자동화와 AI 기반 마케팅 자동화로 반복 업무의 효율을 높입니다."
      />
      <p className="container-page max-w-3xl pt-12 text-base leading-relaxed text-muted-foreground md:pt-16">
        반복되는 조사·집계와 마케팅 업무에 AI를 붙여, 사람이 판단해야 할 일에 시간을 남기도록
        지원합니다. 인증·보안 등급이나 성과 수치를 단정하지 않으며, 도입 범위는 상담으로
        안내합니다.
      </p>
      <ServiceSections
        area="ai-solution"
        blocks={[
          {
            title: "조사분석 자동화 (공공 SaaS)",
            image: svcSurvey,
            imageAlt: "조사분석 자동화 화면이 표시된 노트북",
            description:
              "공공 부문의 조사·분석 업무 흐름을 자동화하고 효율화하도록 지원하는 SaaS 형태의 솔루션입니다. 반복 집계와 리포트 작업을 줄여 조사 본연의 해석에 집중할 수 있게 돕습니다.",
            features: [
              "조사·분석 업무 흐름 자동화",
              "반복 집계·리포트 작업 효율화",
              "공공 업무 환경에 맞춘 SaaS 운영 지원",
            ],
            uses: [
              "정기 조사·집계를 반복 수행해야 할 때",
              "조사 결과를 빠르게 정리해 공유해야 할 때",
              "공공 업무 환경에서 조사 프로세스를 표준화하고 싶을 때",
            ],
            benefits: [
              "반복 작업에 쓰이던 시간을 분석과 의사결정으로 옮길 수 있습니다.",
              "조사 처리 과정을 일정한 흐름으로 운영할 수 있습니다.",
            ],
          },
          {
            title: "AI 기반 마케팅 자동화 솔루션",
            image: svcMarketing,
            imageAlt: "마케팅 자동화 워크플로 화면을 보는 담당자",
            description:
              "마케팅 콘텐츠 제작과 업무 흐름을 효율화하도록 지원하는 AI 기반 솔루션입니다. 캠페인 준비와 반복 업무에 AI를 연결하는 과정을 함께 설계합니다.",
            features: [
              "마케팅 콘텐츠 제작 지원",
              "캠페인·업무 흐름 자동화",
              "반복 업무에 AI를 붙이는 과정 설계",
            ],
            uses: [
              "콘텐츠 제작 부담을 줄이면서 메시지 품질을 유지하고 싶을 때",
              "반복되는 캠페인 준비 절차를 자동화하고 싶을 때",
              "마케팅 업무에 AI를 어디에 붙일지 방향을 잡고 싶을 때",
            ],
            benefits: [
              "반복 제작·운영 업무의 속도를 높일 수 있습니다.",
              "AI를 도입하더라도 실제 업무 흐름에 맞춰 적용 지점을 정할 수 있습니다.",
            ],
          },
        ]}
      />
    </SiteLayout>
  );
}
