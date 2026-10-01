import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { ADMIN_SESSION_KEY } from "@/lib/admin-auth";
import {
  PORTFOLIO_CATEGORIES,
  type PortfolioCategory,
  type PortfolioItem,
} from "@/lib/portfolio";

const categories = PORTFOLIO_CATEGORIES as unknown as [PortfolioCategory, ...PortfolioCategory[]];

const saveSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().trim().min(1),
  content: z.string().trim().min(1),
  imagePath: z.string().min(1),
  category: z.enum(categories),
  writtenDate: z.string().trim().nullable(),
  author: z.string().trim().nullable(),
  published: z.boolean(),
  isPinned: z.boolean(),
  sortOrder: z.number().int().nullable(),
});

type PortfolioRow = {
  id: string;
  title: string;
  content: string;
  image_path: string;
  category: string;
  written_date: string | null;
  author: string | null;
  published: boolean;
  is_pinned?: boolean | null;
  sort_order?: number | null;
  created_at: string;
  updated_at: string;
};

export function mapPortfolioRow(row: PortfolioRow): PortfolioItem {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    imagePath: row.image_path,
    category: (PORTFOLIO_CATEGORIES.includes(row.category as PortfolioCategory)
      ? row.category
      : "공공") as PortfolioCategory,
    writtenDate: row.written_date,
    author: row.author,
    published: row.published,
    isPinned: row.is_pinned === true,
    sortOrder: typeof row.sort_order === "number" ? row.sort_order : null,
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
    return "Supabase에 portfolio 테이블이 없습니다. SQL Editor에서 테이블 생성 SQL을 먼저 실행해 주세요.";
  }
  if (message.includes("Bucket not found")) {
    return "Supabase Storage에 portfolio-images 버킷이 없습니다. 버킷을 만든 뒤 다시 저장해 주세요.";
  }
  if (message.includes("SUPABASE_SERVICE_ROLE_KEY") || message.includes("Missing Supabase")) {
    return "서버에 SUPABASE_SERVICE_ROLE_KEY(또는 SUPABASE_SECRET_KEY)가 없습니다. .env.local에 비밀 키를 추가한 뒤 개발 서버를 다시 시작해 주세요.";
  }
  return message;
}

const PORTFOLIO_IMAGE_BUCKET = "portfolio-images";

async function toPortfolioImageUrl(imagePath: string): Promise<string> {
  if (/^https?:\/\//i.test(imagePath)) return imagePath;

  const match = imagePath.match(/^data:(image\/(?:jpeg|jpg|png|webp));base64,(.+)$/i);
  if (!match) {
    throw new Error("이미지 형식이 올바르지 않습니다. JPG, PNG, WEBP만 사용할 수 있습니다.");
  }

  const rawMime = match[1].toLowerCase();
  const mime = rawMime === "image/jpg" ? "image/jpeg" : rawMime;
  const ext = mime === "image/jpeg" ? "jpg" : mime === "image/webp" ? "webp" : "png";
  const bytes = Buffer.from(match[2], "base64");
  const path = `${crypto.randomUUID()}.${ext}`;

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { error } = await supabaseAdmin.storage.from(PORTFOLIO_IMAGE_BUCKET).upload(path, bytes, {
    contentType: mime,
    upsert: false,
  });
  if (error) throw new Error(dbErrorMessage(error.message));

  const { data } = supabaseAdmin.storage.from(PORTFOLIO_IMAGE_BUCKET).getPublicUrl(path);
  if (!data.publicUrl) throw new Error("이미지 주소를 만들지 못했습니다.");
  return data.publicUrl;
}

export const listAdminPortfolios = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("portfolio")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(dbErrorMessage(error.message));
  return (data ?? []).map(mapPortfolioRow);
});

export const getAdminPortfolio = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin.from("portfolio").select("*").eq("id", data.id).maybeSingle();
    if (error) throw new Error(dbErrorMessage(error.message));
    return row ? mapPortfolioRow(row) : null;
  });

export const saveAdminPortfolio = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => saveSchema.parse(data))
  .handler(async ({ data }) => {
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const imageUrl = await toPortfolioImageUrl(data.imagePath);
    const payload = {
      title: data.title,
      content: data.content,
      image_path: imageUrl,
      category: data.category,
      written_date: data.writtenDate || null,
      author: data.author || null,
      published: data.published,
      is_pinned: data.isPinned,
      sort_order: data.sortOrder,
    };

    if (data.id) {
      const { data: row, error } = await supabaseAdmin
        .from("portfolio")
        .update(payload)
        .eq("id", data.id)
        .select("*")
        .single();
      if (error) throw new Error(dbErrorMessage(error.message));
      return mapPortfolioRow(row);
    }

    const { data: row, error } = await supabaseAdmin.from("portfolio").insert(payload).select("*").single();
    if (error) throw new Error(dbErrorMessage(error.message));
    return mapPortfolioRow(row);
  });

export const deleteAdminPortfolio = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("portfolio").delete().eq("id", data.id);
    if (error) throw new Error(dbErrorMessage(error.message));
    return { ok: true as const };
  });
