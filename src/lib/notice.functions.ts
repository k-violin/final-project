import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { ADMIN_SESSION_KEY } from "@/lib/admin-auth";
import {
  NOTICE_CATEGORIES,
  type Notice,
  type NoticeCategory,
} from "@/lib/notice-mock";

const categories = NOTICE_CATEGORIES as unknown as [NoticeCategory, ...NoticeCategory[]];

const saveSchema = z.object({
  id: z.string().uuid().optional(),
  category: z.enum(categories),
  title: z.string().trim().min(1),
  content: z.string().trim().min(1),
  writtenDate: z.string().trim().nullable(),
  author: z.string().trim().nullable(),
  isPinned: z.boolean(),
  sortOrder: z.number().int().nullable(),
  published: z.boolean(),
});

type NoticeRow = {
  id: string;
  category: string;
  title: string;
  content: string;
  written_date: string | null;
  author: string | null;
  is_pinned?: boolean | null;
  sort_order?: number | null;
  published?: boolean | null;
  created_at: string;
  updated_at: string;
};

export function mapNoticeRow(row: NoticeRow): Notice {
  return {
    id: row.id,
    category: (NOTICE_CATEGORIES.includes(row.category as NoticeCategory)
      ? row.category
      : "기타") as NoticeCategory,
    title: row.title,
    content: row.content,
    writtenDate: row.written_date,
    author: row.author,
    isPinned: row.is_pinned === true,
    sortOrder: typeof row.sort_order === "number" ? row.sort_order : null,
    published: row.published !== false,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function requireAdmin() {
  const { getCookie } = await import("@tanstack/react-start/server");
  if (getCookie(ADMIN_SESSION_KEY) !== "ok") {
    throw new Error("관리자 로그인이 필요합니다. 다시 로그인해 주세요.");
  }
}

function dbErrorMessage(message: string) {
  if (message.includes("Could not find the table") || message.includes("schema cache")) {
    return "Supabase에 notice 테이블이 없습니다. SQL Editor에서 테이블 생성 SQL을 먼저 실행해 주세요.";
  }
  if (message.includes("SUPABASE_SERVICE_ROLE_KEY") || message.includes("Missing Supabase")) {
    return "서버에 SUPABASE_SERVICE_ROLE_KEY(또는 SUPABASE_SECRET_KEY)가 없습니다. .env.local에 비밀 키를 추가한 뒤 개발 서버를 다시 시작해 주세요.";
  }
  return message;
}

export const listAdminNotices = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("notice")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(dbErrorMessage(error.message));
  return (data ?? []).map(mapNoticeRow);
});

export const getAdminNotice = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin.from("notice").select("*").eq("id", data.id).maybeSingle();
    if (error) throw new Error(dbErrorMessage(error.message));
    return row ? mapNoticeRow(row) : null;
  });

export const saveAdminNotice = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => saveSchema.parse(data))
  .handler(async ({ data }) => {
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const payload = {
      category: data.category,
      title: data.title,
      content: data.content,
      written_date: data.writtenDate || null,
      author: data.author || null,
      is_pinned: data.isPinned,
      sort_order: data.sortOrder,
      published: data.published,
    };

    if (data.id) {
      const { data: row, error } = await supabaseAdmin
        .from("notice")
        .update(payload)
        .eq("id", data.id)
        .select("*")
        .single();
      if (error) throw new Error(dbErrorMessage(error.message));
      return mapNoticeRow(row);
    }

    const { data: row, error } = await supabaseAdmin.from("notice").insert(payload).select("*").single();
    if (error) throw new Error(dbErrorMessage(error.message));
    return mapNoticeRow(row);
  });

export const deleteAdminNotice = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("notice").delete().eq("id", data.id);
    if (error) throw new Error(dbErrorMessage(error.message));
    return { ok: true as const };
  });
