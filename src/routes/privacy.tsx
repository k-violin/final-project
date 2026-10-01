import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";

import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { fetchSettings } from "@/lib/db";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "개인정보처리방침 | 와이즈인컴퍼니" },
      {
        name: "description",
        content:
          "와이즈인컴퍼니가 홈페이지 문의, 플랫폼 서비스, 교육 프로그램 이용 과정에서 처리하는 개인정보의 수집 항목, 이용 목적, 보유 기간 및 정보주체의 권리를 안내합니다.",
      },
      { property: "og:title", content: "개인정보처리방침 | 와이즈인컴퍼니" },
      {
        property: "og:description",
        content: "와이즈인컴퍼니의 개인정보 수집·이용에 관한 안내입니다.",
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
  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: fetchSettings,
  });
  const email = settings?.["company_email"]?.trim();

  return (
    <SiteLayout>
      <PageHero title="개인정보처리방침" />
      <div className="container-page max-w-3xl space-y-10 py-16 md:py-20">
        <p className="text-sm leading-relaxed text-muted-foreground">
          와이즈인컴퍼니(이하 &quot;회사&quot;)는 「개인정보 보호법」 등 관련 법령을
          준수하며, 홈페이지 방문자와 서비스 이용자의 개인정보를 소중히 다루고
          있습니다. 본 방침은 회사가 운영하는 홈페이지와 문의 채널, 플랫폼
          서비스(Richway), 교육 프로그램에서 개인정보를 어떻게 수집·이용하고
          보호하는지 안내합니다.
        </p>

        <Section title="1. 수집하는 개인정보 항목 및 수집 방법">
          <p>회사는 다음과 같은 경우에 개인정보를 수집합니다.</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong>온라인 문의:</strong> 담당자 이름, 이메일 주소(필수),
              회사·기관명, 연락처, 문의 분야·제목·내용(선택) — 홈페이지 문의
              양식을 통해 직접 수집
            </li>
            <li>
              <strong>교육 프로그램 신청:</strong> 국비교육 지원 자격 확인 등
              신청 절차에 필요한 항목은 신청 시점에 별도 안내·동의 후 수집
            </li>
            <li>
              <strong>플랫폼 서비스(Richway):</strong> 회원 가입 및 서비스
              이용에 필요한 항목은 해당 서비스의 가입 절차에서 별도 안내·동의 후
              수집
            </li>
          </ul>
        </Section>

        <Section title="2. 개인정보의 수집·이용 목적">
          <ul className="list-disc space-y-2 pl-5">
            <li>문의 접수에 대한 답변 및 상담 진행</li>
            <li>데이터 분석·AI 솔루션 등 프로젝트 상담 및 계약 이행</li>
            <li>교육 프로그램 신청 접수, 수강 안내, 국비지원 관련 행정 처리</li>
            <li>플랫폼 서비스의 회원 관리와 서비스 제공</li>
            <li>법령상 의무 이행 및 분쟁 대응</li>
          </ul>
        </Section>

        <Section title="3. 개인정보의 보유 및 이용 기간">
          <p>
            원칙적으로 개인정보는 수집·이용 목적이 달성되면 지체 없이
            파기합니다. 다만 문의 이력은 상담 품질 관리를 위해 일정 기간
            보관할 수 있으며, 관련 법령에 따라 보존이 필요한 경우에는 해당 법령이
            정한 기간 동안 보관합니다.
          </p>
          <p className="rounded-lg border border-dashed border-border bg-surface p-4 text-sm text-muted-foreground">
            구체적인 보유 기간은 회사 내부 기준 확정 후 본 방침에 반영될
            예정입니다.
          </p>
        </Section>

        <Section title="4. 개인정보의 제3자 제공 및 처리 위탁">
          <p>
            회사는 원칙적으로 이용자의 동의 없이 개인정보를 제3자에게 제공하지
            않습니다. 국비교육 신청 등 법령상 의무 이행을 위해 관계 기관에
            정보가 제공되어야 하는 경우에는 해당 절차에서 별도로 안내하고
            동의를 받습니다.
          </p>
        </Section>

        <Section title="5. 개인정보의 파기 절차 및 방법">
          <p>
            보유 기간이 경과하거나 처리 목적이 달성된 개인정보는 전자적 파일
            형태는 복구할 수 없는 방법으로, 출력물은 분쇄 또는 소각하여
            파기합니다.
          </p>
        </Section>

        <Section title="6. 정보주체의 권리와 행사 방법">
          <p>
            이용자는 언제든지 자신의 개인정보에 대한 열람, 정정·삭제, 처리 정지를
            요구할 수 있으며, 동의를 철회할 수 있습니다. 권리 행사는
            홈페이지의 문의 채널을 통해 요청하실 수 있으며, 회사는 지체 없이
            필요한 조치를 취합니다.
          </p>
        </Section>

        <Section title="7. 개인정보의 안전성 확보 조치">
          <p>
            회사는 개인정보의 안전한 관리를 위해 접근 권한 관리, 접근 통제,
            관리자 계정 보호 등 기술적·관리적 보호 조치를 적용하고 있습니다.
          </p>
        </Section>

        <Section title="8. 개인정보 보호책임자 및 문의">
          <p>
            개인정보 처리와 관련한 문의, 열람·정정 요청, 침해 신고는 아래
            채널을 통해 접수할 수 있습니다.
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              온라인 문의:{" "}
              <Link
                to="/support/contact"
                className="font-medium text-primary hover:underline"
              >
                Contact Us 페이지
              </Link>
            </li>
            {email ? <li>이메일: {email}</li> : null}
          </ul>
          <p className="rounded-lg border border-dashed border-border bg-surface p-4 text-sm text-muted-foreground">
            개인정보 보호책임자의 성명·연락처는 회사 지정이 확정되는 대로 본
            방침에 반영될 예정입니다.
          </p>
        </Section>

        <Section title="9. 개인정보처리방침의 변경">
          <p>
            본 방침이 변경되는 경우 변경 사항과 시행일을 홈페이지 공지사항을
            통해 사전에 안내합니다.
          </p>
        </Section>
      </div>
    </SiteLayout>
  );
}
