import type { ContentSortMode } from "@/lib/content-sort";

export function BoardSortSelect({
  value,
  onChange,
  id = "board-sort",
}: {
  value: ContentSortMode;
  onChange: (value: ContentSortMode) => void;
  id?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="sr-only">
        정렬
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value as ContentSortMode)}
        className="flex h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      >
        <option value="default">기본순</option>
        <option value="newest">최신순</option>
        <option value="oldest">오래된순</option>
      </select>
    </div>
  );
}
