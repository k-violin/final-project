import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";

import { AdminShell } from "@/components/admin/AdminShell";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAdminInquiries } from "@/hooks/useAdminInquiries";
import { ADMIN_SESSION_KEY } from "@/lib/admin-auth";
import {
  INQUIRY_STATUS_LABEL,
  INQUIRY_TYPES,
  type InquiryUiStatus,
} from "@/lib/inquiries.functions";
import { formatDate } from "@/lib/site";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/inquiries/")({
  ssr: false,
  component: InquiryManagePage,
});

function InquiryManagePage() {
  const { inquiries, isLoading, isError, errorMessage } = useAdminInquiries();
  const [query, setQuery] = useState("");
  const [inquiryType, setInquiryType] = useState("");
  const [status, setStatus] = useState<"" | InquiryUiStatus>("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return inquiries.filter((item) => {
      const haystack = [item.name, item.email, item.phone, item.inquiryType, item.message]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const matchesQuery = !q || haystack.includes(q);
      const matchesType = !inquiryType || item.inquiryType === inquiryType;
      const matchesStatus = !status || item.status === status;
      return matchesQuery && matchesType && matchesStatus;
    });
  }, [inquiries, query, inquiryType, status]);

  return (
    <AdminShell
      title="문의사항"
      onLogout={() => {
        sessionStorage.removeItem(ADMIN_SESSION_KEY);
        window.location.reload();
      }}
    >
      <div>
        <h2 className="text-lg font-bold text-navy">문의사항</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          홈페이지 문의하기에서 접수된 글을 확인하고, 상세 화면에서 답변을 등록할 수 있습니다.
        </p>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-[1fr_180px_160px]">
        <div>
          <label htmlFor="inquiry-search" className="mb-2 block text-sm font-semibold text-navy">
            검색
          </label>
          <Input
            id="inquiry-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="이름, 이메일, 전화번호, 문의내용"
          />
        </div>
        <div>
          <label htmlFor="inquiry-type" className="mb-2 block text-sm font-semibold text-navy">
            문의유형
          </label>
          <select
            id="inquiry-type"
            value={inquiryType}
            onChange={(e) => setInquiryType(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="">전체</option>
            {INQUIRY_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="inquiry-status" className="mb-2 block text-sm font-semibold text-navy">
            상태
          </label>
          <select
            id="inquiry-status"
            value={status}
            onChange={(e) => setStatus(e.target.value as "" | InquiryUiStatus)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="">전체</option>
            <option value="received">접수</option>
            <option value="answered">답변완료</option>
          </select>
        </div>
      </div>

      {isError && (
        <p role="alert" className="mt-4 text-sm text-destructive">
          {errorMessage ?? "문의사항을 불러오지 못했습니다."}
        </p>
      )}
      {isLoading && <p className="mt-4 text-sm text-muted-foreground">목록을 불러오는 중입니다…</p>}

      <div className="mt-6 overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="bg-surface text-navy">
            <tr>
              <th className="px-4 py-3 font-semibold">접수일</th>
              <th className="px-4 py-3 font-semibold">문의유형</th>
              <th className="px-4 py-3 font-semibold">이름</th>
              <th className="px-4 py-3 font-semibold">이메일</th>
              <th className="px-4 py-3 font-semibold">전화번호</th>
              <th className="px-4 py-3 font-semibold">상태</th>
              <th className="px-4 py-3 font-semibold">관리</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
                  접수된 문의가 없습니다.
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr key={item.id} className="border-t border-border">
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(item.createdAt) || "-"}</td>
                  <td className="px-4 py-3 text-navy">{item.inquiryType}</td>
                  <td className="px-4 py-3 font-medium text-navy">{item.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{item.email}</td>
                  <td className="px-4 py-3 text-muted-foreground">{item.phone || "-"}</td>
                  <td className="px-4 py-3">
                    <Badge
                      className={cn(
                        item.status === "answered"
                          ? "border-transparent bg-emerald-100 text-emerald-800 hover:bg-emerald-100"
                          : "border-transparent bg-primary/10 text-primary hover:bg-primary/10",
                      )}
                    >
                      {INQUIRY_STATUS_LABEL[item.status]}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      to="/admin/inquiries/$id"
                      params={{ id: item.id }}
                      className="rounded-md border border-border px-3 py-1.5 text-xs font-semibold text-navy hover:bg-surface"
                    >
                      상세
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
