export const PORTFOLIO_CATEGORIES = ["공공", "기업", "교육"] as const;
export type PortfolioCategory = (typeof PORTFOLIO_CATEGORIES)[number];

export type PortfolioItem = {
  id: string;
  title: string;
  content: string;
  imagePath: string;
  category: PortfolioCategory;
  writtenDate: string | null;
  author: string | null;
  published: boolean;
  isPinned: boolean;
  sortOrder: number | null;
  createdAt: string;
  updatedAt: string;
};

export function portfolioPublishedLabel(published: boolean) {
  return published ? "노출" : "숨김";
}

export function formatPortfolioDate(value?: string | null) {
  if (!value) return "";
  const ymd = value.slice(0, 10);
  if (/^\d{4}-\d{2}-\d{2}$/.test(ymd)) {
    const [year, month, day] = ymd.split("-");
    return `${year}. ${month}. ${day}`;
  }
  return "";
}
