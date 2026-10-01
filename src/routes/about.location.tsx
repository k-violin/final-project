import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Phone, Printer, Mail } from "lucide-react";
import type { ReactNode } from "react";

import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { ContactButton } from "@/components/site/ContactButton";
import { fetchSettings } from "@/lib/db";
import { COMPANY_CONTACT } from "@/lib/site";

export const Route = createFileRoute("/about/location")({
  head: () => ({
    meta: [
      { title: "오시는 길 | 와이즈인컴퍼니" },
      { name: "description", content: "와이즈인컴퍼니 방문 안내와 연락처 정보입니다." },
      { property: "og:title", content: "오시는 길 | 와이즈인컴퍼니" },
      { property: "og:description", content: "와이즈인컴퍼니 방문 안내." },
    ],
  }),
  component: Page,
});

function settingOrDefault(settings: Record<string, string> | undefined, key: string, fallback: string) {
  const value = settings?.[key]?.trim();
  return value || fallback;
}

function Page() {
  const { data: settings, isLoading } = useQuery({ queryKey: ["settings"], queryFn: fetchSettings });

  const address = settingOrDefault(settings, "company_address", COMPANY_CONTACT.address);
  const phone = settingOrDefault(settings, "company_phone", COMPANY_CONTACT.phone);
  const fax = settingOrDefault(settings, "company_fax", COMPANY_CONTACT.fax);
  const email = settingOrDefault(settings, "company_email", COMPANY_CONTACT.email);
  const mapQuery = address || COMPANY_CONTACT.mapQuery;
  const customEmbed = settings?.["company_map_embed"]?.trim();
  const embedSrc =
    customEmbed ||
    `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&hl=ko&z=17&output=embed`;

  return (
    <SiteLayout>
      <PageHero
        eyebrow="About Us"
        title="오시는 길"
        description="와이즈인컴퍼니 방문 안내와 연락처입니다. 지도에서 위치를 확인하실 수 있습니다."
      />
      <div className="container-page py-16 md:py-20">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">불러오는 중입니다…</p>
        ) : (
          <div className="grid items-start gap-8 md:grid-cols-2 md:gap-10">
            <div>
              <iframe
                title="와이즈인컴퍼니 구글 지도"
                src={embedSrc}
                className="h-80 w-full rounded-xl border border-border md:h-[26rem]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-semibold text-navy transition-colors hover:border-primary/40 hover:text-primary"
                >
                  구글 지도에서 열기
                </a>
                <a
                  href={`https://map.naver.com/p/search/${encodeURIComponent(mapQuery)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-semibold text-navy transition-colors hover:border-primary/40 hover:text-primary"
                >
                  네이버 지도에서 열기
                </a>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-white p-6 md:p-8">
              <h2 className="text-lg font-bold text-navy">연락처 정보</h2>
              <div className="mt-6 space-y-6">
                <ContactRow icon={<MapPin className="size-5" />} label="주소" value={address}>
                  <p className="mt-1 text-sm text-muted-foreground">{COMPANY_CONTACT.name}</p>
                </ContactRow>
                <ContactRow icon={<Phone className="size-5" />} label="전화" value={phone} href={`tel:${phone}`} />
                <ContactRow icon={<Printer className="size-5" />} label="팩스" value={fax} />
                <ContactRow icon={<Mail className="size-5" />} label="이메일" value={email} href={`mailto:${email}`} />
              </div>

              <div className="mt-8 border-t border-border pt-6">
                <h3 className="text-sm font-semibold text-navy">교통편</h3>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  {COMPANY_CONTACT.transit.map((item) => (
                    <li key={item.label}>
                      <span className="font-semibold text-navy">{item.label}:</span> {item.value}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="mt-10">
          <ContactButton />
        </div>
      </div>
    </SiteLayout>
  );
}

function ContactRow({
  icon,
  label,
  value,
  href,
  children,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  href?: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        {href ? (
          <a href={href} className="text-sm font-semibold text-navy hover:text-primary">
            {value}
          </a>
        ) : (
          <p className="text-sm font-semibold text-navy">{value}</p>
        )}
        {children}
      </div>
    </div>
  );
}
