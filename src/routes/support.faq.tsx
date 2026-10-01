import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { SiteLayout, PageHero, SafeText } from "@/components/site/SiteLayout";
import { ContactButton } from "@/components/site/ContactButton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { fetchFaqs } from "@/lib/db";
import { DEFAULT_FAQS } from "@/lib/faqs";

export const Route = createFileRoute("/support/faq")({
  head: () => ({
    meta: [
      { title: "FAQ | 와이즈인컴퍼니" },
      {
        name: "description",
        content:
          "데이터 분석, AI 솔루션, 플랫폼 서비스, 국비교육, 프로젝트 상담에 관한 자주 묻는 질문입니다.",
      },
      { property: "og:title", content: "FAQ | 와이즈인컴퍼니" },
      { property: "og:description", content: "와이즈인컴퍼니에 자주 묻는 질문과 답변." },
    ],
  }),
  component: Page,
});

function Page() {
  const { data, isLoading, isError } = useQuery({ queryKey: ["faqs"], queryFn: fetchFaqs });
  const faqs =
    !isError && (data ?? []).length > 0
      ? (data ?? []).map((faq) => ({
          id: faq.id,
          question: faq.question,
          answer: faq.answer,
        }))
      : DEFAULT_FAQS;

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Support"
        title="자주 묻는 질문"
        description="서비스 이용과 상담 전에 자주 묻는 내용을 모았습니다. 질문을 선택하면 답변이 펼쳐집니다."
      />
      <div className="container-page py-16 md:py-20">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">불러오는 중입니다…</p>
        ) : (
          <Accordion type="single" collapsible className="w-full rounded-xl border border-border bg-white px-5 md:px-8">
            {faqs.map((faq, index) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger className="text-left text-base font-semibold text-navy">
                  <span className="flex min-w-0 flex-1 items-center gap-3 pr-3">
                    <span className="w-8 shrink-0 text-sm font-semibold tabular-nums text-muted-foreground">
                      {index + 1}
                    </span>
                    <span>{faq.question}</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <SafeText text={faq.answer} className="text-sm leading-relaxed text-muted-foreground" />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}

        <p className="mt-8 text-sm text-muted-foreground">
          원하는 답이 없다면{" "}
          <Link to="/support/contact" className="font-semibold text-primary hover:underline">
            문의하기
          </Link>
          로 과제를 남겨 주세요. 담당자가 확인 후 연락드립니다.
        </p>

        <div className="mt-6">
          <ContactButton />
        </div>
      </div>
    </SiteLayout>
  );
}
