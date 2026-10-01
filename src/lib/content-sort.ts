export function visibilityLabel(published: boolean) {
  return published ? "노출" : "숨김";
}

export type ContentSortMode = "default" | "newest" | "oldest";

export type SortableContent = {
  isPinned: boolean;
  sortOrder: number | null;
  date: string | null;
  createdAt: string;
};

function timestamp(value: string | null, fallback: string) {
  const parsed = Date.parse(value || fallback);
  if (!Number.isNaN(parsed)) return parsed;
  const fallbackParsed = Date.parse(fallback);
  return Number.isNaN(fallbackParsed) ? 0 : fallbackParsed;
}

function compareSortOrder(a: number | null, b: number | null) {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  return a - b;
}

export function compareContent(a: SortableContent, b: SortableContent, mode: ContentSortMode) {
  if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;

  if (mode === "default") {
    const byOrder = compareSortOrder(a.sortOrder, b.sortOrder);
    if (byOrder !== 0) return byOrder;
  }

  const aTime = timestamp(a.date, a.createdAt);
  const bTime = timestamp(b.date, b.createdAt);
  if (aTime !== bTime) return mode === "oldest" ? aTime - bTime : bTime - aTime;

  const aCreated = timestamp(a.createdAt, a.createdAt);
  const bCreated = timestamp(b.createdAt, b.createdAt);
  if (aCreated !== bCreated) return mode === "oldest" ? aCreated - bCreated : bCreated - aCreated;
  return 0;
}

export function sortBoardItems<T extends { isPinned: boolean; sortOrder: number | null; createdAt: string }>(
  items: T[],
  mode: ContentSortMode,
  getDate: (item: T) => string | null,
) {
  return [...items].sort((a, b) =>
    compareContent(
      { isPinned: a.isPinned, sortOrder: a.sortOrder, date: getDate(a), createdAt: a.createdAt },
      { isPinned: b.isPinned, sortOrder: b.sortOrder, date: getDate(b), createdAt: b.createdAt },
      mode,
    ),
  );
}

export function parseSortOrderInput(raw: string): { value: number | null; error?: string } {
  const trimmed = raw.trim();
  if (!trimmed) return { value: null };
  if (!/^-?\d+$/.test(trimmed)) {
    return { value: null, error: "노출 순서는 정수로 입력해 주세요." };
  }
  const value = Number(trimmed);
  if (!Number.isSafeInteger(value)) {
    return { value: null, error: "노출 순서는 정수로 입력해 주세요." };
  }
  return { value };
}

export function mapPinSort(row: { is_pinned?: boolean | null; sort_order?: number | null }) {
  return {
    isPinned: row.is_pinned === true,
    sortOrder: typeof row.sort_order === "number" ? row.sort_order : null,
  };
}
