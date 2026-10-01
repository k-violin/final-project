import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { PinSortFields, VisibilityField } from "@/components/admin/PinSortFields";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  NOTICE_CATEGORIES,
  type Notice,
  type NoticeCategory,
} from "@/lib/notice-mock";
import { parseSortOrderInput } from "@/lib/content-sort";
import { cn } from "@/lib/utils";

type FormValues = {
  category: string;
  title: string;
  content: string;
  writtenDate: string;
  author: string;
  isPinned: boolean;
  sortOrder: string;
  published: boolean;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

export function NoticeForm({
  initial,
  onSave,
}: {
  initial?: Notice;
  onSave: (notice: Notice) => void | Promise<void>;
}) {
  const navigate = useNavigate();
  const [values, setValues] = useState<FormValues>(toValues(initial));
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setValues(toValues(initial));
  }, [initial]);

  function set<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate(): boolean {
    const next: FormErrors = {};
    if (!values.category) next.category = "분류를 선택해 주세요.";
    if (!values.title.trim()) next.title = "제목을 입력해 주세요.";
    if (!values.content.trim()) next.content = "내용을 입력해 주세요.";
    const sort = parseSortOrderInput(values.sortOrder);
    if (sort.error) next.sortOrder = sort.error;
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSave() {
    if (!validate()) {
      toast.error("필수 항목을 확인해 주세요.");
      return;
    }
    if (saving) return;
    setSaving(true);
    const now = new Date().toISOString();
    try {
      await onSave({
        id: initial?.id ?? "",
        category: values.category as NoticeCategory,
        title: values.title.trim(),
        content: values.content.trim(),
        writtenDate: values.writtenDate || null,
        author: values.author.trim() || null,
        isPinned: values.isPinned,
        sortOrder: parseSortOrderInput(values.sortOrder).value,
        published: values.published,
        createdAt: initial?.createdAt ?? now,
        updatedAt: now,
      });
      toast.success("공지사항이 Supabase notice 테이블에 저장되었습니다.");
      void navigate({ to: "/admin/notices" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="grid gap-6">
        <Field label="분류" required error={errors.category}>
          <select
            value={values.category}
            onChange={(e) => set("category", e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="">분류를 선택해 주세요</option>
            {NOTICE_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </Field>

        <Field label="제목" required error={errors.title}>
          <Input
            value={values.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="공지 제목을 입력해 주세요"
          />
        </Field>

        <Field label="내용" required error={errors.content}>
          <Textarea
            rows={16}
            className="min-h-72"
            value={values.content}
            onChange={(e) => set("content", e.target.value)}
            placeholder="공지 내용을 입력해 주세요"
          />
        </Field>

        <div className="grid gap-6 md:grid-cols-2">
          <Field label="작성일">
            <Input
              type="date"
              value={values.writtenDate}
              onChange={(e) => set("writtenDate", e.target.value)}
            />
          </Field>
          <Field label="작성자">
            <Input
              value={values.author}
              onChange={(e) => set("author", e.target.value)}
              placeholder="작성자 이름"
            />
          </Field>
        </div>

        <PinSortFields
          isPinned={values.isPinned}
          sortOrder={values.sortOrder}
          onPinnedChange={(value) => set("isPinned", value)}
          onSortOrderChange={(value) => set("sortOrder", value)}
          sortError={errors.sortOrder}
        />

        <VisibilityField
          published={values.published}
          onChange={(value) => set("published", value)}
          error={errors.published}
        />
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => void navigate({ to: "/admin/notices" })}
          className="rounded-md border border-border px-5 py-2.5 text-sm font-semibold text-navy hover:bg-surface"
        >
          취소
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
          disabled={saving}
        >
          {saving ? "저장 중…" : "저장"}
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-navy">
        {label}
        {required && <span className="ml-1 text-destructive">*</span>}
      </label>
      {children}
      {error && (
        <p role="alert" className={cn("mt-2 text-sm text-destructive")}>
          {error}
        </p>
      )}
    </div>
  );
}

function toValues(notice?: Notice): FormValues {
  return {
    category: notice?.category ?? "",
    title: notice?.title ?? "",
    content: notice?.content ?? "",
    writtenDate: notice?.writtenDate ?? "",
    author: notice?.author ?? "",
    isPinned: notice?.isPinned ?? false,
    sortOrder: notice?.sortOrder == null ? "" : String(notice.sortOrder),
    published: notice?.published ?? true,
  };
}
