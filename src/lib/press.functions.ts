import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { ADMIN_SESSION_KEY } from "@/lib/admin-auth";
import { isHttpUrl, mapPressRow } from "@/lib/press-mock";

const saveSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().trim().min(1),
  source: z.string().trim().min(1),
  articleUrl: z
    .string()
    .trim()
    .min(1)
    .refine((value) => isHttpUrl(value), "http:// 또는 https:// URL이 필요합니다."),
  publishedDate: z.string().trim().nullable(),
  isPinned: z.boolean(),
  sortOrder: z.number().int().nullable(),
  published: z.boolean(),
});

async function requireAdmin() {
  const { getCookie } = await import("@tanstack/react-start/server");
  if (getCookie(ADMIN_SESSION_KEY) !== "ok") {
    throw new Error("관리자 로그인이 필요합니다. 다시 로그인해 주세요.");
  }
}

function dbErrorMessage(message: string) {
  if (message.includes("Could not find the table") || message.includes("schema cache")) {
    return "Supabase에 press 테이블이 없습니다. SQL Editor에서 테이블 생성 SQL을 먼저 실행해 주세요.";
  }
  if (message.includes("SUPABASE_SERVICE_ROLE_KEY") || message.includes("Missing Supabase")) {
    return "서버에 SUPABASE_SERVICE_ROLE_KEY(또는 SUPABASE_SECRET_KEY)가 없습니다. .env.local에 비밀 키를 추가한 뒤 개발 서버를 다시 시작해 주세요.";
  }
  return message;
}

export const listAdminPress = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("press")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(dbErrorMessage(error.message));
  return (data ?? []).map(mapPressRow);
});

export const getAdminPress = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin.from("press").select("*").eq("id", data.id).maybeSingle();
    if (error) throw new Error(dbErrorMessage(error.message));
    return row ? mapPressRow(row) : null;
  });

export const saveAdminPress = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => saveSchema.parse(data))
  .handler(async ({ data }) => {
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const payload = {
      title: data.title,
      source: data.source,
      article_url: data.articleUrl,
      published_date: data.publishedDate || null,
      is_pinned: data.isPinned,
      sort_order: data.sortOrder,
      published: Boolean(data.published),
    };

    if (data.id) {
      const { data: row, error } = await supabaseAdmin
        .from("press")
        .update(payload)
        .eq("id", data.id)
        .select("*")
        .single();
      if (error) throw new Error(dbErrorMessage(error.message));
      return mapPressRow(row);
    }

    const { data: row, error } = await supabaseAdmin.from("press").insert(payload).select("*").single();
    if (error) throw new Error(dbErrorMessage(error.message));
    return mapPressRow(row);
  });

export const deleteAdminPress = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("press").delete().eq("id", data.id);
    if (error) throw new Error(dbErrorMessage(error.message));
    return { ok: true as const };
  });
