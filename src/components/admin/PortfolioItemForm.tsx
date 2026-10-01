import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PortfolioDetailView } from "@/components/portfolio/PortfolioDetailView";
import { PinSortFields, VisibilityField } from "@/components/admin/PinSortFields";
import {
  PORTFOLIO_CATEGORIES,
  type PortfolioCategory,
  type PortfolioItem,
} from "@/lib/portfolio";
import { parseSortOrderInput } from "@/lib/content-sort";
import { cn } from "@/lib/utils";

type FormValues = {
  title: string;
  content: string;
  imagePath: string;
  category: string;
  writtenDate: string;
  author: string;
  published: boolean;
  isPinned: boolean;
  sortOrder: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

const IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export function PortfolioItemForm({
  initial,
  onSave,
}: {
  initial?: PortfolioItem;
  onSave: (item: PortfolioItem) => void | Promise<void>;
}) {
  const navigate = useNavigate();
  const [values, setValues] = useState<FormValues>(toValues(initial));
  const [errors, setErrors] = useState<FormErrors>({});
  const [previewOpen, setPreviewOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setValues(toValues(initial));
  }, [initial]);

  const previewItem = useMemo(
    () =>
      ({
        id: initial?.id ?? "preview",
        title: values.title.trim() || "제목 없음",
        content: values.content.trim() || "내용 없음",
        imagePath: values.imagePath,
        category: (PORTFOLIO_CATEGORIES.includes(values.category as PortfolioCategory)
          ? values.category
          : "공공") as PortfolioCategory,
        writtenDate: values.writtenDate || null,
        author: values.author.trim() || null,
        published: values.published,
        isPinned: values.isPinned,
        sortOrder: parseSortOrderInput(values.sortOrder).value,
        createdAt: initial?.createdAt ?? new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }) satisfies PortfolioItem,
    [initial, values],
  );

  function set<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate(): boolean {
    const next: FormErrors = {};
    if (!values.title.trim()) next.title = "제목을 입력해 주세요.";
    if (!values.content.trim()) next.content = "내용을 입력해 주세요.";
    if (!values.imagePath) next.imagePath = "대표 이미지를 선택해 주세요.";
    if (!values.category) next.category = "분류를 선택해 주세요.";
    if (typeof values.published !== "boolean") next.published = "노출여부를 선택해 주세요.";
    const sort = parseSortOrderInput(values.sortOrder);
    if (sort.error) next.sortOrder = sort.error;
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleImage(file: File | undefined) {
    if (!file) return;
    if (!IMAGE_TYPES.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        imagePath: "JPG, PNG, WEBP 형식의 이미지만 선택할 수 있습니다.",
      }));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      set("imagePath", String(reader.result ?? ""));
    };
    reader.readAsDataURL(file);
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
        content: values.content.trim(),
        imagePath: values.imagePath,
        category: values.category as PortfolioCategory,
        writtenDate: values.writtenDate || null,
        author: values.author.trim() || null,
        published: values.published,
        isPinned: values.isPinned,
        sortOrder: parseSortOrderInput(values.sortOrder).value,
        createdAt: initial?.createdAt ?? now,
        updatedAt: now,
      });
      toast.success("항목이 Supabase portfolio 테이블에 저장되었습니다.");
      void navigate({ to: "/admin/portfolio" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  }

  function handlePreview() {
    if (!validate()) {
      toast.error("미리보기를 위해 필수 항목을 먼저 입력해 주세요.");
      return;
    }
    setPreviewOpen(true);
  }

  return (
    <div>
      <div className="grid gap-6">
        <Field label="제목" required error={errors.title}>
          <Input
            value={values.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="프로젝트 제목을 입력해 주세요"
          />
        </Field>

        <Field label="내용" required error={errors.content}>
          <Textarea
            rows={16}
            className="min-h-72"
            value={values.content}
            onChange={(e) => set("content", e.target.value)}
            placeholder="본문을 입력해 주세요"
          />
        </Field>

        <Field label="이미지" required error={errors.imagePath}>
          <Input
            type="file"
            accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
            onChange={(e) => handleImage(e.target.files?.[0])}
          />
          {values.imagePath ? (
            <img
              src={values.imagePath}
              alt="대표 이미지 미리보기"
              className="mt-4 h-48 w-full rounded-lg object-cover md:h-64"
            />
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">선택한 이미지가 여기에 미리보기로 표시됩니다.</p>
          )}
          <p className="mt-2 text-sm text-muted-foreground">
            저장하면 이미지가 portfolio-images 저장소에 올라가고, portfolio 테이블에는 이미지 주소가 저장됩니다.
          </p>
        </Field>

        <Field label="분류" required error={errors.category}>
          <select
            value={values.category}
            onChange={(e) => set("category", e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="">분류를 선택해 주세요</option>
            {PORTFOLIO_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </Field>

        <VisibilityField
          published={values.published}
          onChange={(value) => set("published", value)}
          error={errors.published}
        />

        <PinSortFields
          isPinned={values.isPinned}
          sortOrder={values.sortOrder}
          onPinnedChange={(value) => set("isPinned", value)}
          onSortOrderChange={(value) => set("sortOrder", value)}
          sortError={errors.sortOrder}
        />

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
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => void navigate({ to: "/admin/portfolio" })}
          className="rounded-md border border-border px-5 py-2.5 text-sm font-semibold text-navy hover:bg-surface"
        >
          취소
        </button>
        <button
          type="button"
          onClick={handlePreview}
          className="rounded-md border border-primary px-5 py-2.5 text-sm font-semibold text-primary hover:bg-primary/5"
        >
          미리보기
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

      {previewOpen && (
        <div className="fixed inset-0 z-[80] overflow-y-auto bg-white">
          <div className="border-b border-border bg-navy">
            <div className="container-page flex items-center justify-between py-4">
              <p className="text-sm font-semibold text-white">게시 미리보기</p>
              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
                className="rounded-md border border-white/30 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
              >
                닫기
              </button>
            </div>
          </div>
          <div className="container-page py-12 md:py-16">
            <PortfolioDetailView item={previewItem} />
          </div>
        </div>
      )}
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

function toValues(item?: PortfolioItem): FormValues {
  return {
    title: item?.title ?? "",
    content: item?.content ?? "",
    imagePath: item?.imagePath ?? "",
    category: item?.category ?? "",
    writtenDate: item?.writtenDate ?? "",
    author: item?.author ?? "",
    published: item?.published ?? true,
    isPinned: item?.isPinned ?? false,
    sortOrder: item?.sortOrder == null ? "" : String(item.sortOrder),
  };
}
