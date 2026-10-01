import { createFileRoute } from "@tanstack/react-router";

import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { ServiceSections } from "@/components/site/ServiceSections";

import svcTraining from "@/assets/svc-training.jpg";
import svcCurriculum from "@/assets/svc-curriculum.jpg";
import svcEduSupport from "@/assets/service-education.jpg";

export const Route = createFileRoute("/business/education")({
  head: () => ({
    meta: [
      { title: "국비교육 프로그램 | 와이즈인컴퍼니" },
      {
        name: "description",
        content:
          "실제 프로젝트 경험을 바탕으로 자체 제작한 커리큘럼으로 데이터·AI 실무 교육을 제공합니다.",
      },
      { property: "og:title", content: "국비교육 프로그램 | 와이즈인컴퍼니" },
      {
        property: "og:description",
        content: "자체 개발 커리큘럼 기반의 데이터·AI 실무 교육과 내일배움카드 국비지원 안내.",
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
        title="국비교육 프로그램"
        description="실제 프로젝트 경험을 바탕으로 자체 제작한 커리큘럼으로 데이터·AI 실무 교육을 제공합니다."
      />
      <p className="container-page max-w-3xl pt-12 text-base leading-relaxed text-muted-foreground md:pt-16">
        현장 과제를 바탕으로 한 실무 교육을 운영합니다. 과정명, 일정, 수강료, 지원 비율,
        자격 요건은 시점에 따라 달라질 수 있어 이 페이지에 고정하지 않으며, 문의 상담으로
        안내드립니다.
      </p>
      <ServiceSections
        area="education"
        blocks={[
          {
            title: "실전 중심 데이터·AI 교육",
            image: svcTraining,
            imageAlt: "강사가 수강생의 실습을 돕는 교육 현장",
            description:
              "데이터 분석과 AI 프로젝트를 수행하며 쌓은 경험을 교육 과정에 반영해, 실무에서 바로 활용할 수 있는 내용을 다룹니다.",
            features: [
              "실제 프로젝트 경험을 반영한 실습 수업",
              "데이터 분석·AI 실무 과제 수행",
              "강사 피드백 기반 학습 진행",
            ],
            uses: [
              "이론보다 실제 과제 수행 방식으로 데이터·AI를 배우고 싶을 때",
              "분석부터 해석·보고까지 한 흐름으로 연습하고 싶을 때",
            ],
            benefits: [
              "현장 과제와 가까운 형태로 실무 감각을 익힐 수 있습니다.",
              "강사 피드백을 통해 부족한 지점을 보완할 수 있습니다.",
            ],
          },
          {
            title: "자체 개발 커리큘럼",
            image: svcCurriculum,
            imageAlt: "자체 제작 커리큘럼 자료와 노트",
            description:
              "외부 교재를 그대로 사용하지 않고, 실제 프로젝트를 기반으로 자체 제작한 커리큘럼으로 운영합니다.",
            features: [
              "실제 프로젝트를 바탕으로 한 자체 교재·과정 구성",
              "현장 이슈를 반영한 학습 모듈 운영",
              "과정 목적에 맞춘 커리큘럼 조정",
            ],
            uses: [
              "실제 프로젝트에서 나온 문제를 학습 소재로 다루고 싶을 때",
              "과정 목적에 맞게 학습 구성을 조율해야 할 때",
            ],
            benefits: [
              "현장과 동떨어진 예제가 아니라 수행 경험에 기반한 내용을 배울 수 있습니다.",
              "과정 목적에 따라 학습 구성을 조정할 수 있습니다.",
            ],
          },
          {
            title: "내일배움카드 국비지원 안내",
            image: svcEduSupport,
            imageAlt: "데이터·AI 교육 과정 안내 이미지",
            description:
              "내일배움카드를 활용한 국비지원 교육을 운영합니다. 과정 구성과 신청 방법은 문의를 통해 안내드립니다.",
            features: [
              "내일배움카드 국비지원 과정 운영",
              "과정 구성·일정·신청 방법 안내",
              "수강 전 상담 지원",
            ],
            uses: [
              "내일배움카드로 데이터·AI 교육을 알아보고 싶을 때",
              "수강 전 과정 구성과 신청 절차를 확인하고 싶을 때",
            ],
            benefits: [
              "국비지원 활용 가능 여부와 신청 절차를 상담으로 확인할 수 있습니다.",
              "현재 운영 중인 과정 안내는 시점에 맞게 제공됩니다.",
            ],
          },
        ]}
      />
    </SiteLayout>
  );
}
