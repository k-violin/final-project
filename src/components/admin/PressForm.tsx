import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { PinSortFields, VisibilityField } from "@/components/admin/PinSortFields";
import { Input } from "@/components/ui/input";
import { isHttpUrl, type PressRelease } from "@/lib/press-mock";
import { parseSortOrderInput } from "@/lib/content-sort";
import { cn } from "@/lib/utils";

type FormValues = {
  title: string;
  source: string;
  articleUrl: string;
  publishedDate: string;
  isPinned: boolean;
  sortOrder: string;
  published: boolean;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

export function PressForm({
  initial,
  onSave,
}: {
  initial?: PressRelease;
  onSave: (item: PressRelease) => void | Promise<void>;
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
    if (!values.title.trim()) next.title = "제목을 입력해 주세요.";
    if (!values.source.trim()) next.source = "출처를 입력해 주세요.";
    if (!values.articleUrl.trim()) {
      next.articleUrl = "링크주소를 입력해 주세요.";
    } else if (!isHttpUrl(values.articleUrl)) {
      next.articleUrl = "http:// 또는 https://로 시작하는 올바른 URL을 입력해 주세요.";
    }
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
        title: values.title.trim(),
        source: values.source.trim(),
        articleUrl: values.articleUrl.trim(),
        publishedDate: values.publishedDate || null,
        isPinned: values.isPinned,
        sortOrder: parseSortOrderInput(values.sortOrder).value,
        published: values.published,
        createdAt: initial?.createdAt ?? now,
        updatedAt: now,
      });
      toast.success("언론보도가 Supabase press 테이블에 저장되었습니다.");
      void navigate({ to: "/admin/press" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="grid gap-6">
        <Field label="제목" required error={errors.title}>
          <Input
            value={values.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="기사 제목을 입력해 주세요"
          />
        </Field>

        <Field label="출처" required error={errors.source}>
          <Input
            value={values.source}
            onChange={(e) => set("source", e.target.value)}
            placeholder="언론사 또는 매체명을 입력해 주세요"
          />
        </Field>

        <Field label="링크주소" required error={errors.articleUrl}>
          <Input
            type="url"
            value={values.articleUrl}
            onChange={(e) => set("articleUrl", e.target.value)}
            placeholder="https://example.com/article"
          />
        </Field>

        <Field label="날짜">
          <Input
            type="date"
            value={values.publishedDate}
            onChange={(e) => set("publishedDate", e.target.value)}
          />
        </Field>

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
          onClick={() => void navigate({ to: "/admin/press" })}
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

function toValues(item?: PressRelease): FormValues {
  return {
    title: item?.title ?? "",
    source: item?.source ?? "",
    articleUrl: item?.articleUrl ?? "",
    publishedDate: item?.publishedDate ?? "",
    isPinned: item?.isPinned ?? false,
    sortOrder: item?.sortOrder == null ? "" : String(item.sortOrder),
    published: item?.published ?? true,
  };
}
