import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { ADMIN_SESSION_KEY } from "@/lib/admin-auth";
import { INQUIRY_AREAS } from "@/lib/site";

export const INQUIRY_TYPES = ["의뢰문의", "제휴문의", "교육문의", "구축문의", "기타"] as const;
export type InquiryType = (typeof INQUIRY_TYPES)[number];

export const INQUIRY_UI_STATUSES = ["received", "answered"] as const;
export type InquiryUiStatus = (typeof INQUIRY_UI_STATUSES)[number];

export const INQUIRY_STATUS_LABEL: Record<InquiryUiStatus, string> = {
  received: "접수",
  answered: "답변완료",
};

export function isPhoneNumber(value: string) {
  const trimmed = value.trim();
  if (!/^[+\d][\d\s\-().]{7,24}$/.test(trimmed)) return false;
  const digits = trimmed.replace(/\D/g, "");
  return digits.length >= 9 && digits.length <= 15;
}

export function inquiryTypeLabel(value: string) {
  if ((INQUIRY_TYPES as readonly string[]).includes(value)) return value;
  return INQUIRY_AREAS.find((area) => area.value === value)?.label ?? value;
}

export function mapInquiryStatus(status: string): InquiryUiStatus {
  return status === "done" ? "answered" : "received";
}

export type AdminInquiry = {
  id: string;
  name: string;
  email: string;
  organization: string | null;
  position: string | null;
  phone: string | null;
  inquiryType: string;
  message: string;
  reply: string;
  status: InquiryUiStatus;
  createdAt: string;
  updatedAt: string;
};

type InquiryRow = {
  id: string;
  area: string;
  organization: string | null;
  position: string | null;
  contact_name: string;
  email: string;
  phone: string | null;
  message: string;
  admin_note: string | null;
  status: string;
  created_at: string;
  updated_at: string;
};

export function mapInquiryRow(row: InquiryRow): AdminInquiry {
  return {
    id: row.id,
    name: row.contact_name,
    email: row.email,
    organization: row.organization,
    position: row.position,
    phone: row.phone,
    inquiryType: inquiryTypeLabel(row.area),
    message: row.message,
    reply: row.admin_note?.trim() ?? "",
    status: mapInquiryStatus(row.status),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

const inquiryTypes = INQUIRY_TYPES as unknown as [InquiryType, ...InquiryType[]];

const inquirySchema = z.object({
  inquiryType: z.enum(inquiryTypes),
  organization: z.string().trim().max(200).optional(),
  position: z.string().trim().max(100).optional(),
  contact_name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  phone: z
    .string()
    .trim()
    .min(1)
    .max(50)
    .refine(isPhoneNumber, "올바른 전화번호 형식으로 입력해주세요."),
  message: z.string().trim().min(1).max(5000),
  privacy_agreed: z.literal(true),
});

export type InquiryInput = z.infer<typeof inquirySchema>;

async function requireAdmin() {
  const { getCookie } = await import("@tanstack/react-start/server");
  if (getCookie(ADMIN_SESSION_KEY) !== "ok") {
    throw new Error("관리자 로그인이 필요합니다. 다시 로그인해 주세요.");
  }
}

function dbErrorMessage(message: string) {
  if (message.includes("Could not find the table") || message.includes("schema cache")) {
    return "Supabase에 inquiries 테이블이 없습니다. SQL Editor에서 테이블 생성 SQL을 먼저 실행해 주세요.";
  }
  if (message.includes("SUPABASE_SERVICE_ROLE_KEY") || message.includes("Missing Supabase")) {
    return "서버에 SUPABASE_SERVICE_ROLE_KEY(또는 SUPABASE_SECRET_KEY)가 없습니다. .env.local에 비밀 키를 추가한 뒤 개발 서버를 다시 시작해 주세요.";
  }
  return message;
}

export const submitInquiry = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => inquirySchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("inquiries").insert({
      area: data.inquiryType,
      service_detail: null,
      organization: data.organization || null,
      position: data.position || null,
      contact_name: data.contact_name,
      email: data.email,
      phone: data.phone,
      subject: data.inquiryType,
      message: data.message,
      privacy_agreed: true,
      status: "new",
      admin_note: null,
    });
    if (error) throw new Error(dbErrorMessage(error.message));
    return { ok: true as const };
  });

export const listAdminInquiries = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(dbErrorMessage(error.message));
  return (data ?? []).map((row) => mapInquiryRow(row as InquiryRow));
});

export const getAdminInquiry = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("inquiries")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(dbErrorMessage(error.message));
    return row ? mapInquiryRow(row as InquiryRow) : null;
  });

export const saveAdminInquiryReply = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        reply: z.string().trim().min(1, "답변을 입력해주세요.").max(5000),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("inquiries")
      .update({
        admin_note: data.reply,
        status: "done",
      })
      .eq("id", data.id)
      .select("*")
      .single();
    if (error) throw new Error(dbErrorMessage(error.message));
    return mapInquiryRow(row as InquiryRow);
  });

export const updateAdminInquiryStatus = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        status: z.enum(INQUIRY_UI_STATUSES),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("inquiries")
      .update({
        status: data.status === "answered" ? "done" : "new",
      })
      .eq("id", data.id)
      .select("*")
      .single();
    if (error) throw new Error(dbErrorMessage(error.message));
    return mapInquiryRow(row as InquiryRow);
  });
