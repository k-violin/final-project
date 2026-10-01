export const ADMIN_PRESS_QUERY_KEY = ["admin-press"] as const;
export const PUBLIC_PRESS_QUERY_KEY = ["public-press"] as const;

export type PressRelease = {
  id: string;
  title: string;
  source: string;
  articleUrl: string;
  publishedDate: string | null;
  isPinned: boolean;
  sortOrder: number | null;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PressRow = {
  id: string;
  title: string;
  source: string;
  article_url: string;
  published_date: string | null;
  is_pinned?: boolean | null;
  sort_order?: number | null;
  published?: boolean | null;
  created_at: string;
  updated_at: string;
};

export function mapPressRow(row: PressRow): PressRelease {
  return {
    id: row.id,
    title: row.title,
    source: row.source,
    articleUrl: row.article_url,
    publishedDate: row.published_date,
    isPinned: row.is_pinned === true,
    sortOrder: typeof row.sort_order === "number" ? row.sort_order : null,
    published: row.published !== false,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function isHttpUrl(value: string) {
  try {
    const url = new URL(value.trim());
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function formatPressDate(value?: string | null) {
  if (!value) return "";
  const ymd = value.slice(0, 10);
  if (/^\d{4}-\d{2}-\d{2}$/.test(ymd)) {
    const [year, month, day] = ymd.split("-");
    return `${year}. ${month}. ${day}`;
  }
  return "";
}
