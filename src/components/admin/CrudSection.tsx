import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { adminList, adminSave, adminDelete, uploadImage, type AdminTable } from "@/lib/admin";
import { formatDate } from "@/lib/site";

export type FieldDef = {
  name: string;
  label: string;
  type: "text" | "textarea" | "number" | "boolean" | "date" | "image" | "select";
  required?: boolean;
  options?: { value: string; label: string }[];
};

type Row = Record<string, unknown>;

export function CrudSection({
  table,
  title,
  fields,
  orderBy = "created_at",
  titleField = "title",
}: {
  table: AdminTable;
  title: string;
  fields: FieldDef[];
  orderBy?: string;
  titleField?: string;
}) {
  const qc = useQueryClient();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin", table],
    queryFn: () => adminList(table, orderBy),
  });

  const [editing, setEditing] = useState<Row | null>(null);
  const [values, setValues] = useState<Row>({});
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Row | null>(null);

  function startNew() {
    setEditing({});
    setValues(Object.fromEntries(fields.map((f) => [f.name, f.type === "boolean" ? false : ""])));
  }

  function startEdit(row: Row) {
    setEditing(row);
    setValues(Object.fromEntries(fields.map((f) => [f.name, row[f.name] ?? ""])));
  }

  async function save() {
    for (const field of fields) {
      if (field.required && !String(values[field.name] ?? "").trim()) {
        toast.error(`${field.label}을(를) 입력해 주세요.`);
        return;
      }
    }
    setSaving(true);
    try {
      const payload: Row = {};
      for (const field of fields) {
        const raw = values[field.name];
        if (field.type === "number") payload[field.name] = raw === "" ? null : Number(raw);
        else if (field.type === "boolean") payload[field.name] = Boolean(raw);
        else payload[field.name] = raw === "" ? null : raw;
      }
      await adminSave(table, payload, editing?.["id"] as string | undefined);
      await qc.invalidateQueries({ queryKey: ["admin", table] });
      toast.success("저장되었습니다.");
      setEditing(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      await adminDelete(table, deleteTarget["id"] as string);
      await qc.invalidateQueries({ queryKey: ["admin", table] });
      toast.success("삭제되었습니다.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "삭제에 실패했습니다.");
    } finally {
      setDeleteTarget(null);
    }
  }

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-navy">{title}</h2>
        <button
          type="button"
          onClick={startNew}
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          새로 만들기
        </button>
      </div>

      <div className="mt-5 overflow-x-auto rounded-lg border border-border">
        {isLoading ? (
          <p className="p-6 text-sm text-muted-foreground">불러오는 중입니다…</p>
        ) : isError ? (
          <p className="p-6 text-sm text-destructive">목록을 불러오지 못했습니다.</p>
        ) : (data ?? []).length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground">등록된 항목이 없습니다.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-surface text-left">
              <tr>
                <th className="p-3 font-semibold text-navy">제목</th>
                <th className="p-3 font-semibold text-navy">상태</th>
                <th className="p-3 font-semibold text-navy">수정일</th>
                <th className="p-3 font-semibold text-navy">관리</th>
              </tr>
            </thead>
            <tbody>
              {(data ?? []).map((row) => (
                <tr key={String(row["id"])} className="border-t border-border">
                  <td className="p-3 text-foreground">{String(row[titleField] ?? "")}</td>
                  <td className="p-3 text-muted-foreground">
                    {"published" in row ? (row["published"] ? "게시" : "초안") : "-"}
                  </td>
                  <td className="p-3 text-muted-foreground">
                    {formatDate(row["updated_at"] as string)}
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(row)}
                        className="rounded border border-border px-3 py-1 text-xs font-semibold hover:bg-surface"
                      >
                        수정
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(row)}
                        className="rounded border border-destructive px-3 py-1 text-xs font-semibold text-destructive hover:bg-destructive/5"
                      >
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {editing && (
        <div className="mt-6 rounded-lg border border-border p-6">
          <h3 className="text-base font-bold text-navy">
            {editing["id"] ? "항목 수정" : "새 항목"}
          </h3>
          <div className="mt-5 grid gap-5">
            {fields.map((field) => (
              <FieldInput
                key={field.name}
                field={field}
                value={values[field.name]}
                onChange={(value) => setValues((prev) => ({ ...prev, [field.name]: value }))}
              />
            ))}
          </div>
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="rounded-md bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
            >
              {saving ? "저장 중…" : "저장"}
            </button>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="rounded-md border border-border px-5 py-2 text-sm font-semibold hover:bg-surface"
            >
              취소
            </button>
          </div>
        </div>
      )}

      <AlertDialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              삭제한 항목은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>삭제</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  const id = `field-${field.name}`;

  if (field.type === "boolean") {
    return (
      <div className="flex items-center gap-3">
        <Checkbox
          id={id}
          checked={Boolean(value)}
          onCheckedChange={(checked) => onChange(checked === true)}
        />
        <label htmlFor={id} className="text-sm font-semibold text-navy">
          {field.label}
        </label>
      </div>
    );
  }

  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-navy">
        {field.label}
        {field.required && <span className="ml-1 text-destructive">*</span>}
      </label>
      {field.type === "textarea" ? (
        <Textarea id={id} rows={6} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} />
      ) : field.type === "select" ? (
        <select
          id={id}
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-full rounded-md border border-input bg-white px-3 text-sm"
        >
          <option value="">선택 안 함</option>
          {(field.options ?? []).map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : field.type === "image" ? (
        <ImageField id={id} value={String(value ?? "")} onChange={onChange} />
      ) : (
        <Input
          id={id}
          type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}

function ImageField({
  id,
  value,
  onChange,
}: {
  id: string;
  value: string;
  onChange: (value: unknown) => void;
}) {
  const [uploading, setUploading] = useState(false);

  return (
    <div>
      <input
        id={id}
        type="file"
        accept="image/*"
        className="block text-sm"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          setUploading(true);
          try {
            const url = await uploadImage(file);
            onChange(url);
            toast.success("이미지가 업로드되었습니다.");
          } catch (error) {
            toast.error(error instanceof Error ? error.message : "업로드에 실패했습니다.");
          } finally {
            setUploading(false);
          }
        }}
      />
      {uploading && <p className="mt-2 text-xs text-muted-foreground">업로드 중입니다…</p>}
      {value && (
        <img src={value} alt="업로드된 대표 이미지 미리보기" className="mt-3 h-32 rounded border border-border object-cover" />
      )}
    </div>
  );
}
