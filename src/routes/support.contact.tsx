import { useState, type FormEvent, type ReactNode } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";

import { SiteLayout, PageHero, SafeText } from "@/components/site/SiteLayout";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { INQUIRY_AREAS, type InquiryArea } from "@/lib/site";
import { fetchSettings } from "@/lib/db";
import { INQUIRY_TYPES, isPhoneNumber, submitInquiry } from "@/lib/inquiries.functions";

type ContactSearch = { area?: InquiryArea | undefined; detail?: string | undefined };

const AREA_VALUES = INQUIRY_AREAS.map((a) => a.value);

export const Route = createFileRoute("/support/contact")({
  validateSearch: (search: Record<string, unknown>): ContactSearch => ({
    area: AREA_VALUES.includes(search["area"] as InquiryArea)
      ? (search["area"] as InquiryArea)
      : undefined,
    detail: typeof search["detail"] === "string" ? search["detail"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Contact Us | 와이즈인컴퍼니" },
      {
        name: "description",
        content: "데이터 분석, AI 솔루션, 플랫폼, 국비교육에 관한 문의를 남겨주세요.",
      },
      { property: "og:title", content: "Contact Us | 와이즈인컴퍼니" },
      { property: "og:description", content: "와이즈인컴퍼니에 문의를 남겨주세요." },
    ],
  }),
  component: Page,
});

type Values = {
  contact_name: string;
  email: string;
  organization: string;
  position: string;
  phone: string;
  inquiryType: string;
  message: string;
  privacy_agreed: boolean;
};

const EMPTY_VALUES: Values = {
  contact_name: "",
  email: "",
  organization: "",
  position: "",
  phone: "",
  inquiryType: "",
  message: "",
  privacy_agreed: false,
};

function Page() {
  const navigate = useNavigate();
  const { data: settings } = useQuery({ queryKey: ["settings"], queryFn: fetchSettings });
  const send = useServerFn(submitInquiry);

  const [values, setValues] = useState<Values>(EMPTY_VALUES);
  const [errors, setErrors] = useState<Partial<Record<keyof Values, string>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  const set = <K extends keyof Values>(key: K, value: Values[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  function closeSuccessDialog() {
    setValues(EMPTY_VALUES);
    setErrors({});
    setStatus("idle");
    void navigate({ to: "/support/contact" });
  }

  function validate(): boolean {
    const next: Partial<Record<keyof Values, string>> = {};
    if (!values.contact_name.trim()) next.contact_name = "이름을 입력해주세요.";
    if (!values.email.trim()) next.email = "올바른 이메일 주소를 입력해주세요.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
      next.email = "올바른 이메일 주소를 입력해주세요.";
    }
    if (!values.phone.trim()) next.phone = "전화번호를 입력해주세요.";
    else if (!isPhoneNumber(values.phone)) next.phone = "올바른 전화번호 형식으로 입력해주세요.";
    if (!values.inquiryType) next.inquiryType = "문의 유형을 선택해주세요.";
    if (!values.message.trim()) next.message = "문의 내용을 입력해주세요.";
    if (!values.privacy_agreed) next.privacy_agreed = "개인정보 수집·이용에 동의해 주세요.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (status === "sending") return;
    if (!validate()) return;
    setStatus("sending");
    try {
      await send({
        data: {
          inquiryType: values.inquiryType as (typeof INQUIRY_TYPES)[number],
          organization: values.organization.trim() || undefined,
          position: values.position.trim() || undefined,
          contact_name: values.contact_name.trim(),
          email: values.email.trim(),
          phone: values.phone.trim(),
          message: values.message.trim(),
          privacy_agreed: true,
        },
      });
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Support"
        title="Contact Us"
        description="필요한 서비스와 고민을 남겨주시면 상담을 통해 함께 방향을 찾겠습니다."
      />
      <div className="container-page py-16 md:py-20">
        <div className="mx-auto w-full max-w-3xl">
          <p className="mb-10 text-sm leading-relaxed text-muted-foreground">
            데이터 분석, AI 솔루션, 플랫폼 서비스, 국비교육 프로그램에 관한 과제를 남겨 주세요.
            비용·일정·교육 자격 등 상세 안내는 과제와 시점에 따라 달라질 수 있어 상담으로
            안내드립니다.
          </p>
          <form className="grid grid-cols-1 gap-6 md:grid-cols-2" onSubmit={onSubmit} noValidate>
            <Field label="이름" htmlFor="contact_name" required error={errors.contact_name}>
              <Input
                id="contact_name"
                type="text"
                value={values.contact_name}
                aria-invalid={Boolean(errors.contact_name)}
                onChange={(e) => set("contact_name", e.target.value)}
                autoComplete="name"
              />
            </Field>

            <Field label="이메일" htmlFor="email" required error={errors.email}>
              <Input
                id="email"
                type="email"
                value={values.email}
                aria-invalid={Boolean(errors.email)}
                onChange={(e) => set("email", e.target.value)}
                autoComplete="email"
              />
            </Field>

            <Field label="소속" htmlFor="organization">
              <Input
                id="organization"
                type="text"
                value={values.organization}
                onChange={(e) => set("organization", e.target.value)}
                autoComplete="organization"
              />
            </Field>

            <Field label="직급" htmlFor="position">
              <Input
                id="position"
                type="text"
                value={values.position}
                onChange={(e) => set("position", e.target.value)}
              />
            </Field>

            <Field label="전화번호" htmlFor="phone" required error={errors.phone}>
              <Input
                id="phone"
                type="tel"
                inputMode="tel"
                value={values.phone}
                aria-invalid={Boolean(errors.phone)}
                onChange={(e) => set("phone", e.target.value)}
                placeholder="010-1234-5678"
                autoComplete="tel"
              />
            </Field>

            <Field label="문의유형" htmlFor="inquiryType" required error={errors.inquiryType}>
              <select
                id="inquiryType"
                value={values.inquiryType}
                onChange={(e) => set("inquiryType", e.target.value)}
                aria-invalid={Boolean(errors.inquiryType)}
                className="h-10 w-full rounded-md border border-input bg-white px-3 text-sm"
              >
                <option value="">선택해 주세요</option>
                {INQUIRY_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </Field>

            <Field
              label="문의내용"
              htmlFor="message"
              required
              error={errors.message}
              className="md:col-span-2"
            >
              <Textarea
                id="message"
                rows={7}
                value={values.message}
                aria-invalid={Boolean(errors.message)}
                onChange={(e) => set("message", e.target.value)}
              />
            </Field>

            <div className="rounded-lg border border-border bg-surface p-5 md:col-span-2">
              <SafeText
                text={
                  settings?.["privacy_notice"]?.trim() ||
                  "문의 접수 시 이름, 이메일, 전화번호, 문의 유형·내용 등을 수집하며, 상담 목적 외로 이용하지 않습니다. 보유 기간과 권리 안내는 개인정보처리방침에서 확인하실 수 있습니다."
                }
                className="text-xs text-muted-foreground"
              />
              <div className="mt-4 flex items-start gap-3">
                <Checkbox
                  id="privacy"
                  checked={values.privacy_agreed}
                  onCheckedChange={(checked) => set("privacy_agreed", checked === true)}
                />
                <label htmlFor="privacy" className="text-sm text-foreground">
                  개인정보 수집·이용에 동의합니다. <span className="text-destructive">*</span>
                </label>
              </div>
              {errors.privacy_agreed && (
                <p className="mt-2 text-sm text-destructive">{errors.privacy_agreed}</p>
              )}
            </div>

            {status === "error" && (
              <p
                role="alert"
                className="rounded-md bg-destructive/10 p-4 text-sm text-destructive md:col-span-2"
              >
                문의 전송에 실패했습니다. 입력하신 내용은 그대로 유지되니 잠시 후 다시 시도해 주세요.
              </p>
            )}

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={status === "sending"}
                className="inline-flex items-center justify-center rounded-md bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
              >
                {status === "sending" ? "전송 중…" : "문의하기"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <AlertDialog
        open={status === "done"}
        onOpenChange={(open) => {
          if (!open) closeSuccessDialog();
        }}
      >
        <AlertDialogContent className="max-w-lg text-center sm:text-center">
          <AlertDialogHeader className="sm:text-center">
            <AlertDialogTitle className="text-navy">문의가 접수되었습니다.</AlertDialogTitle>
            <AlertDialogDescription className="leading-relaxed">
              <span className="block">확인 후 곧 24시간 이내에 연락드리겠습니다.</span>
              <span className="block">좋은 제안과 의견 항상 감사합니다.</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center">
            <AlertDialogAction>확인</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SiteLayout>
  );
}

function Field({
  label,
  htmlFor,
  required,
  error,
  className,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string | undefined;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-2 block text-sm font-semibold text-navy">
        {label}
        {required && <span className="ml-1 text-destructive">*</span>}
      </label>
      {children}
      {error && (
        <p className="mt-2 text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
