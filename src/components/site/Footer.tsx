import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { Logo } from "./Logo";
import { NAV, SLOGAN } from "@/lib/site";
import { fetchSettings } from "@/lib/db";

export function Footer() {
  const { data: settings } = useQuery({ queryKey: ["settings"], queryFn: fetchSettings });

  const contactRows = [
    { label: "주소", value: settings?.["company_address"] },
    { label: "전화", value: settings?.["company_phone"] },
    { label: "이메일", value: settings?.["company_email"] },
    { label: "사업자등록번호", value: settings?.["business_number"] },
    { label: "대표자", value: settings?.["ceo_name"] },
  ].filter((r) => r.value && r.value.trim().length > 0);

  return (
    <footer className="mt-20 border-t border-border bg-navy text-navy-foreground">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <Logo tone="light" />
          <p className="mt-3 text-sm text-white/70">{SLOGAN}</p>
        </div>

        <nav aria-label="푸터 메뉴">
          <h2 className="text-sm font-semibold text-white">메뉴</h2>
          <ul className="mt-4 space-y-2">
            {NAV.map((item) => (
              <li key={item.label}>
                <Link to={item.to} className="text-sm text-white/70 hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-semibold text-white">문의</h2>
          <Link
            to="/support/contact"
            className="mt-4 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            문의하기
          </Link>
          {contactRows.length > 0 ? (
            <dl className="mt-5 space-y-1 text-sm text-white/70">
              {contactRows.map((row) => (
                <div key={row.label} className="flex gap-2">
                  <dt className="shrink-0">{row.label}</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="mt-5 text-sm text-white/50">회사 연락처 정보는 준비 중입니다.</p>
          )}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-3 py-5 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} WiseIN Company. All rights reserved.</p>
          <div className="flex gap-5">
            <Link to="/privacy" className="font-semibold text-white/80 hover:text-white">
              개인정보처리방침
            </Link>
            <Link to="/terms" className="font-semibold text-white/80 hover:text-white">
              이용약관
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
