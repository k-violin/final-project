import { createFileRoute } from "@tanstack/react-router";

import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { ServiceSections } from "@/components/site/ServiceSections";

import svcPublicData from "@/assets/svc-public-data.jpg";
import svcStrategy from "@/assets/svc-data-strategy.jpg";
import svcResearch from "@/assets/svc-research.jpg";

export const Route = createFileRoute("/business/data-analysis")({
  head: () => ({
    meta: [
      { title: "데이터 분석 | 와이즈인컴퍼니" },
      {
        name: "description",
        content:
          "공공 데이터 분석, 기업 데이터 전략 수립, 리서치 & 컨설팅으로 데이터 기반 의사결정을 지원합니다.",
      },
      { property: "og:title", content: "데이터 분석 | 와이즈인컴퍼니" },
      {
        property: "og:description",
        content: "공공 데이터 분석과 기업 데이터 전략, 리서치·컨설팅 서비스를 제공합니다.",
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
        title="데이터 분석"
        description="공공 데이터 분석과 기업 데이터 전략, 리서치·컨설팅으로 데이터 기반 의사결정을 지원합니다."
      />
      <ServiceSections
        area="data-analysis"
        blocks={[
          {
            title: "공공 데이터 분석",
            image: svcPublicData,
            imageAlt: "공공 데이터 대시보드를 분석하는 모습",
            description:
              "공공 부문에서 수집된 데이터를 분석해 근거 기반 의사결정을 지원합니다. 사업 목적과 자료 특성에 맞춰 분석 방향을 함께 정리하고, 내부 공유와 보고에 쓰일 결과물을 구성합니다.",
            features: [
              "공공 자료 수집·정제와 분석 설계",
              "사업 목적에 맞춘 지표 정의와 해석",
              "의사결정용 보고서·대시보드 정리",
            ],
            uses: [
              "공공 사업의 현황을 데이터로 파악하고 성과를 점검할 때",
              "정책·사업 판단에 필요한 근거 자료를 준비할 때",
              "여러 출처의 자료를 한 기준으로 맞춰 해석할 때",
            ],
            benefits: [
              "의사결정에 바로 제시할 수 있는 분석 결과와 보고서를 확보할 수 있습니다.",
              "자료의 의미와 한계를 함께 정리해 내부 공유가 쉬워집니다.",
            ],
          },
          {
            title: "기업 데이터 전략 수립",
            image: svcStrategy,
            imageAlt: "데이터 전략 워크숍 화이트보드 논의 장면",
            description:
              "보유한 데이터를 실제 업무에서 어떻게 활용할지 방향을 함께 정리합니다. 현황 진단부터 활용 과제 도출, 우선순위 정리까지 지원합니다.",
            features: [
              "데이터 현황 진단과 활용 과제 도출",
              "업무 흐름에 맞는 데이터 활용 방향 설계",
              "우선순위와 실행 로드맵 정리",
            ],
            uses: [
              "데이터가 곳곳에 있으나 업무에 잘 연결되지 않을 때",
              "부서별로 다른 데이터 활용 방식을 하나의 방향으로 맞출 때",
              "먼저 추진할 데이터 과제를 정해야 할 때",
            ],
            benefits: [
              "당장 손댈 과제와 중기 과제를 구분해 실행 순서를 잡을 수 있습니다.",
              "분석 자체보다 업무에 데이터가 쓰이는 길을 명확히 할 수 있습니다.",
            ],
          },
          {
            title: "리서치 & 컨설팅",
            image: svcResearch,
            imageAlt: "리서치 보고서와 분석 차트 자료",
            description:
              "리서치 설계와 분석, 결과 해석을 통해 의사결정에 필요한 근거를 제공합니다. 설문 타당성 검토, 조직 만족도 분석과 같이 조사 기반 과제에도 대응합니다.",
            features: [
              "조사 설계와 문항·표본 구성",
              "수집 데이터 분석과 결과 해석",
              "의사결정용 리서치 리포트 작성",
            ],
            uses: [
              "설문·조사의 문항과 난이도를 검증해야 할 때",
              "대규모 내부 만족도·인식 조사 결과를 해석해야 할 때",
              "조사 결과를 의사결정용 보고서로 정리해야 할 때",
            ],
            benefits: [
              "조사 설계부터 해석까지 한 흐름으로 근거를 만들 수 있습니다.",
              "숫자만 나열하지 않고, 판단에 필요한 의미를 함께 전달합니다.",
            ],
          },
        ]}
      />
    </SiteLayout>
  );
}
