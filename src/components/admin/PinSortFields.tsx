import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function PinSortFields({
  isPinned,
  sortOrder,
  onPinnedChange,
  onSortOrderChange,
  sortError,
}: {
  isPinned: boolean;
  sortOrder: string;
  onPinnedChange: (value: boolean) => void;
  onSortOrderChange: (value: string) => void;
  sortError?: string;
}) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <p className="mb-2 text-sm font-semibold text-navy">상단 고정</p>
        <label className="flex items-center gap-2 text-sm text-navy">
          <input
            type="checkbox"
            checked={isPinned}
            onChange={(e) => onPinnedChange(e.target.checked)}
            className="size-4 accent-primary"
          />
          이 콘텐츠를 상단에 고정
        </label>
      </div>
      <div>
        <label className="mb-2 block text-sm font-semibold text-navy">노출 순서</label>
        <Input
          type="number"
          inputMode="numeric"
          value={sortOrder}
          onChange={(e) => onSortOrderChange(e.target.value)}
          placeholder="1, 2, 3…"
        />
        {sortError ? (
          <p role="alert" className={cn("mt-2 text-sm text-destructive")}>
            {sortError}
          </p>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">
            숫자가 작을수록 먼저 표시됩니다. 비워 두면 날짜순입니다.
          </p>
        )}
      </div>
    </div>
  );
}

export function VisibilityField({
  published,
  onChange,
  error,
}: {
  published: boolean;
  onChange: (value: boolean) => void;
  error?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-navy">
        노출여부
        <span className="ml-1 text-destructive">*</span>
      </label>
      <select
        value={published ? "true" : "false"}
        onChange={(e) => onChange(e.target.value === "true")}
        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      >
        <option value="true">노출</option>
        <option value="false">숨김</option>
      </select>
      {error ? (
        <p role="alert" className={cn("mt-2 text-sm text-destructive")}>
          {error}
        </p>
      ) : (
        <p className="mt-2 text-sm text-muted-foreground">
          숨김은 관리자만 볼 수 있고, 홈페이지에는 나타나지 않습니다.
        </p>
      )}
    </div>
  );
}
