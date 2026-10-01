export const COMPANY_NAME_KO = "와이즈인컴퍼니";
export const COMPANY_NAME_EN = "WiseIN Company";
export const SLOGAN = "데이터와 AI로 여는 서비스 세계";

export const COMPANY_CONTACT = {
  name: COMPANY_NAME_KO,
  address: "서울시 강남구 역삼로309 기성빌딩3층",
  mapQuery: "서울특별시 강남구 역삼로 309 기성빌딩",
  phone: "02-558-5144",
  fax: "02-558-5146",
  email: "wic@wiseinc.co.kr",
  transit: [
    { label: "지하철", value: "2호선 역삼역 3번 출구 도보 5분" },
    { label: "버스", value: "간선 146, 740, 지선 3412, 6411" },
    { label: "주차", value: "기성빌딩 지하 주차장 이용 가능" },
  ],
} as const;

export type InquiryArea = "data-analysis" | "ai-solution" | "platform" | "education" | "etc";

export const INQUIRY_AREAS: { value: InquiryArea; label: string }[] = [
  { value: "data-analysis", label: "데이터 분석" },
  { value: "ai-solution", label: "AI 솔루션" },
  { value: "platform", label: "플랫폼 서비스" },
  { value: "education", label: "국비교육 프로그램" },
  { value: "etc", label: "기타" },
];

export function areaLabel(value: string): string {
  return INQUIRY_AREAS.find((a) => a.value === value)?.label ?? "기타";
}

export type NavItem = {
  label: string;
  to: string;
  children?: { label: string; sub?: string; to: string }[];
};

export const NAV: NavItem[] = [
  { label: "Home", to: "/" },
  {
    label: "Business",
    to: "/business",
    children: [
      { label: "데이터 분석", sub: "Data Analysis", to: "/business/data-analysis" },
      { label: "AI 솔루션", sub: "AI Solutions", to: "/business/ai-solutions" },
      { label: "플랫폼 서비스", sub: "Platform Service", to: "/business/platform" },
      { label: "국비교육 프로그램", sub: "Education Program", to: "/business/education" },
    ],
  },
  { label: "Portfolio", to: "/portfolio" },
  { label: "Blog", to: "/blog" },
  {
    label: "About Us",
    to: "/about",
    children: [
      { label: "회사소개", sub: "Company Overview", to: "/about" },
      { label: "미션/비전", sub: "Mission & Vision", to: "/about/vision" },
      { label: "연혁", sub: "History", to: "/about/history" },
      { label: "언론보도", sub: "Press", to: "/about/press" },
      { label: "오시는 길", sub: "Location", to: "/about/location" },
    ],
  },
  {
    label: "Support",
    to: "/support",
    children: [
      { label: "Contact Us", sub: "문의하기", to: "/support/contact" },
      { label: "FAQ", sub: "자주 묻는 질문", to: "/support/faq" },
      { label: "공지사항", sub: "Notices", to: "/support/notices" },
    ],
  },
];

export const BUSINESS_CARDS = [
  {
    area: "data-analysis" as InquiryArea,
    title: "데이터 분석",
    to: "/business/data-analysis",
    description:
      "공공 데이터 분석과 기업 데이터 전략, 리서치·컨설팅으로 데이터 기반 의사결정을 지원합니다.",
    featured: true,
  },
  {
    area: "ai-solution" as InquiryArea,
    title: "AI 솔루션",
    to: "/business/ai-solutions",
    description: "조사분석 자동화와 AI 기반 마케팅 자동화로 반복 업무의 효율을 높입니다.",
    featured: true,
  },
  {
    area: "platform" as InquiryArea,
    title: "플랫폼 서비스",
    to: "/business/platform",
    description: "금융 데이터 분석 및 자산관리를 위한 Richway(부자플랫폼)를 운영합니다.",
    featured: false,
  },
  {
    area: "education" as InquiryArea,
    title: "국비교육 프로그램",
    to: "/business/education",
    description:
      "실제 프로젝트 경험을 바탕으로 자체 제작한 커리큘럼으로 데이터·AI 실무 교육을 제공합니다.",
    featured: false,
  },
];

export const KEY_PROJECTS = [
  {
    client: "한국청소년활동진흥원",
    year: 2024,
    title: "설문의 타당성과 난이도 검증을 위한 연구 지원",
    image: "/portfolio-1.jpg",
    imageAlt: "한국청소년활동진흥원 프로젝트 수행 장면",
  },
  {
    client: "제일기획",
    year: 2024,
    title: "대규모 내부직원 만족도 데이터 분석",
    image: "/portfolio-2.png",
    imageAlt: "내부직원 만족도 조사 결과를 함께 살펴보는 회의 장면",
  },
];

export function portfolioCover(row: {
  title?: string | null;
  client_name?: string | null;
  cover_image_url?: string | null;
}) {
  if (row.cover_image_url) return { src: row.cover_image_url, alt: "" };
  const match = KEY_PROJECTS.find(
    (p) => p.client === row.client_name || p.title === row.title,
  );
  if (!match?.image) return null;
  return { src: match.image, alt: match.imageAlt };
}

export function formatDate(value?: string | null): string {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getFullYear()}. ${String(d.getMonth() + 1).padStart(2, "0")}. ${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}
