import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { AdminShell } from "@/components/admin/AdminShell";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useAdminInquiries, useAdminInquiry } from "@/hooks/useAdminInquiries";
import { ADMIN_SESSION_KEY } from "@/lib/admin-auth";
import { INQUIRY_STATUS_LABEL, type InquiryUiStatus } from "@/lib/inquiries.functions";
import { formatDate } from "@/lib/site";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/inquiries/$id")({
  ssr: false,
  component: InquiryDetailPage,
});

function InquiryDetailPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { data: inquiry, isLoading, isError } = useAdminInquiry(id);
  const { saveReply, updateStatus } = useAdminInquiries();
  const [reply, setReply] = useState("");
  const [busy, setBusy] = useState<"reply" | InquiryUiStatus | null>(null);

  useEffect(() => {
    if (inquiry) setReply(inquiry.reply);
  }, [inquiry]);

  return (
    <AdminShell
      title="문의 상세"
      onLogout={() => {
        sessionStorage.removeItem(ADMIN_SESSION_KEY);
        window.location.reload();
      }}
    >
      {isLoading ? (
        <p className="text-sm text-muted-foreground">문의를 불러오는 중입니다…</p>
      ) : isError ? (
        <p className="text-sm text-destructive">문의를 불러오지 못했습니다.</p>
      ) : inquiry ? (
        <div className="max-w-3xl">
          <div className="flex justify-end">
            <Badge
              className={cn(
                inquiry.status === "answered"
                  ? "border-transparent bg-emerald-100 text-emerald-800 hover:bg-emerald-100"
                  : "border-transparent bg-primary/10 text-primary hover:bg-primary/10",
              )}
            >
              {INQUIRY_STATUS_LABEL[inquiry.status]}
            </Badge>
          </div>

          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            <Field label="접수일" value={formatDate(inquiry.createdAt) || "-"} />
            <Field label="문의유형" value={inquiry.inquiryType} />
            <Field label="이름" value={inquiry.name} />
            <Field label="이메일" value={inquiry.email} />
            <Field label="소속" value={inquiry.organization || "-"} />
            <Field label="직급" value={inquiry.position || "-"} />
            <Field label="전화번호" value={inquiry.phone || "-"} className="sm:col-span-2" />
          </dl>

          <div className="mt-6">
            <h3 className="text-sm font-semibold text-navy">문의내용</h3>
            <p className="mt-2 whitespace-pre-wrap rounded-lg border border-border bg-surface p-4 text-sm leading-relaxed text-foreground">
              {inquiry.message}
            </p>
          </div>

          <form
            className="mt-8 rounded-lg border border-border p-5"
            onSubmit={(e) => {
              e.preventDefault();
              if (busy) return;
              const next = reply.trim();
              if (!next) {
                toast.error("답변을 입력해주세요.");
                return;
              }
              setBusy("reply");
              void (async () => {
                try {
                  await saveReply(inquiry.id, next);
                  toast.success("답변이 등록되었습니다.");
                } catch (error) {
                  toast.error(error instanceof Error ? error.message : "답변 등록에 실패했습니다.");
                } finally {
                  setBusy(null);
                }
              })();
            }}
          >
            <h3 className="text-sm font-semibold text-navy">답변 등록</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              문의에 대한 답변을 작성한 뒤 등록합니다. 등록하면 상태가 답변완료로 바뀝니다.
            </p>
            <label htmlFor="inquiry-reply" className="mb-2 mt-4 block text-sm font-semibold text-navy">
              답변
            </label>
            <Textarea
              id="inquiry-reply"
              rows={8}
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="문의에 대한 답변을 작성해 주세요."
            />
            <button
              type="submit"
              disabled={busy !== null}
              className="mt-4 inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
            >
              {busy === "reply" ? "등록 중…" : "답변 등록"}
            </button>
          </form>

          <div className="mt-6 rounded-lg border border-border bg-surface p-5">
            <h3 className="text-sm font-semibold text-navy">처리 상태</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              이 문의의 처리 상태를 접수 또는 답변완료로 변경합니다.
            </p>
            <div className="mt-4 inline-flex overflow-hidden rounded-md border border-border bg-white">
              {(["received", "answered"] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  disabled={busy !== null}
                  onClick={() => {
                    if (status === inquiry.status) return;
                    if (status === "answered" && !inquiry.reply.trim()) {
                      toast.error("먼저 답변을 등록한 뒤 답변완료로 변경해 주세요.");
                      return;
                    }
                    setBusy(status);
                    void (async () => {
                      try {
                        await updateStatus(inquiry.id, status);
                        toast.success("상태가 변경되었습니다.");
                      } catch (error) {
                        toast.error(error instanceof Error ? error.message : "상태 변경에 실패했습니다.");
                      } finally {
                        setBusy(null);
                      }
                    })();
                  }}
                  className={cn(
                    "min-w-24 px-4 py-2 text-sm font-semibold disabled:opacity-60",
                    status === "received" && "border-r border-border",
                    inquiry.status === status
                      ? "bg-primary text-primary-foreground"
                      : "text-navy hover:bg-surface",
                  )}
                >
                  {INQUIRY_STATUS_LABEL[status]}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <Link
              to="/admin/inquiries"
              className="inline-flex items-center justify-center rounded-md border border-border px-5 py-2.5 text-sm font-semibold text-navy hover:bg-surface"
            >
              목록으로
            </Link>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-sm text-muted-foreground">문의를 찾을 수 없습니다.</p>
          <button
            type="button"
            onClick={() => void navigate({ to: "/admin/inquiries" })}
            className="mt-4 rounded-md border border-border px-4 py-2 text-sm font-semibold text-navy"
          >
            목록으로
          </button>
        </div>
      )}
    </AdminShell>
  );
}

function Field({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <dt className="text-xs font-semibold text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm text-navy">{value}</dd>
    </div>
  );
}
