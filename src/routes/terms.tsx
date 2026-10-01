import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";

import { SiteLayout, PageHero } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "이용약관 | 와이즈인컴퍼니" },
      {
        name: "description",
        content:
          "와이즈인컴퍼니 홈페이지 이용에 관한 약관입니다. 서비스의 내용, 지식재산권, 면책 사항 등을 안내합니다.",
      },
      { property: "og:title", content: "이용약관 | 와이즈인컴퍼니" },
      {
        property: "og:description",
        content: "와이즈인컴퍼니 홈페이지 이용에 관한 약관입니다.",
      },
    ],
  }),
  component: Page,
});

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-border pt-8">
      <h2 className="text-lg font-semibold text-navy">{title}</h2>
      <div className="mt-4 space-y-3 text-sm leading-relaxed text-foreground/85">
        {children}
      </div>
    </section>
  );
}

function Page() {
  return (
    <SiteLayout>
      <PageHero title="이용약관" />
      <div className="container-page max-w-3xl space-y-10 py-16 md:py-20">
        <p className="text-sm leading-relaxed text-muted-foreground">
          본 약관은 와이즈인컴퍼니(이하 &quot;회사&quot;)가 운영하는 홈페이지의
          이용 조건과 회사 및 이용자의 권리·의무를 안내합니다. 홈페이지를
          이용하는 경우 본 약관에 동의한 것으로 봅니다.
        </p>

        <Section title="제1조 (목적)">
          <p>
            본 약관은 회사가 제공하는 홈페이지 서비스(회사 소개, 사업 안내,
            포트폴리오·블로그 콘텐츠, 문의 접수 등)의 이용과 관련하여 회사와
            이용자 간의 권리, 의무 및 책임 사항을 정하는 것을 목적으로 합니다.
          </p>
        </Section>

        <Section title="제2조 (서비스의 내용)">
          <p>회사는 홈페이지를 통해 다음과 같은 서비스를 제공합니다.</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              회사 및 사업 안내(데이터 분석, AI 솔루션, 플랫폼 서비스, 국비교육
              프로그램)
            </li>
            <li>포트폴리오·블로그·보도자료·공지사항 등 콘텐츠 제공</li>
            <li>온라인 문의 접수 및 상담 안내</li>
          </ul>
          <p>
            플랫폼 서비스(Richway) 등 회사가 별도로 운영하는 서비스에는 해당
            서비스의 이용약관이 적용됩니다.
          </p>
        </Section>

        <Section title="제3조 (서비스의 제공 및 변경)">
          <p>
            회사는 홈페이지의 콘텐츠와 서비스 구성을 사업 상황에 따라 변경할 수
            있으며, 중요한 변경 사항은 홈페이지 공지사항을 통해 안내합니다.
            시스템 점검, 장애 등의 사유로 서비스 제공이 일시 중단될 수
            있습니다.
          </p>
        </Section>

        <Section title="제4조 (이용자의 의무)">
          <p>이용자는 다음 행위를 하여서는 안 됩니다.</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>문의 양식에 타인의 정보 또는 허위 정보를 등록하는 행위</li>
            <li>홈페이지의 콘텐츠를 무단으로 복제·배포·영리 목적으로 이용하는 행위</li>
            <li>서비스의 정상적인 운영을 방해하는 행위</li>
            <li>법령 또는 공서양속에 반하는 행위</li>
          </ul>
        </Section>

        <Section title="제5조 (지식재산권)">
          <p>
            홈페이지에 게시된 텍스트, 이미지, 자료 등 콘텐츠에 대한
            지식재산권은 회사 또는 정당한 권리자에게 귀속됩니다. 이용자는
            회사의 사전 동의 없이 이를 복제, 전송, 출판, 배포할 수 없습니다.
          </p>
        </Section>

        <Section title="제6조 (면책 사항)">
          <p>
            홈페이지에 게시된 사업 안내·사례 등의 정보는 일반적인 안내를 위한
            것으로, 개별 프로젝트의 범위·결과·일정은 상담과 계약을 통해 별도로
            확정됩니다. 회사는 천재지변, 통신 장애 등 불가항력으로 인한 서비스
            중단에 대해 책임을 지지 않습니다.
          </p>
        </Section>

        <Section title="제7조 (개인정보 보호)">
          <p>
            이용자의 개인정보는 회사의{" "}
            <Link
              to="/privacy"
              className="font-medium text-primary hover:underline"
            >
              개인정보처리방침
            </Link>
            에 따라 보호됩니다.
          </p>
        </Section>

        <Section title="제8조 (약관의 변경 및 문의)">
          <p>
            본 약관이 변경되는 경우 변경 내용과 시행일을 홈페이지 공지사항을
            통해 사전에 안내합니다. 약관과 관련한 문의는{" "}
            <Link
              to="/support/contact"
              className="font-medium text-primary hover:underline"
            >
              Contact Us 페이지
            </Link>
            를 이용해 주세요.
          </p>
        </Section>
      </div>
    </SiteLayout>
  );
}
