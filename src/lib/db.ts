import { supabase } from "@/integrations/supabase/client";
import { mapBlogRow } from "@/lib/blog-db";
import type { BlogPost as CmsBlogPost } from "@/lib/blog-mock";
import { sortBoardItems } from "@/lib/content-sort";
import { mapPressRow } from "@/lib/press-mock";

export type Category = {
  id: string;
  kind: string;
  name: string;
  slug: string;
  sort_order: number;
};

export type PortfolioItem = {
  id: string;
  title: string;
  slug: string;
  category_id: string | null;
  cover_image_url: string | null;
  summary: string | null;
  body: string | null;
  client_name: string | null;
  project_year: number | null;
  challenge: string | null;
  work_done: string | null;
  outcome: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  category_id: string | null;
  cover_image_url: string | null;
  summary: string | null;
  body: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
};

export async function fetchCategories(kind: "portfolio" | "blog") {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("kind", kind)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Category[];
}

export async function fetchTrustMetrics() {
  const { data, error } = await supabase
    .from("trust_metrics")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function fetchSettings() {
  const { data, error } = await supabase.from("site_settings").select("key, value");
  if (error) throw error;
  const map: Record<string, string> = {};
  for (const row of data ?? []) map[row.key] = row.value ?? "";
  return map;
}

export async function fetchLatestPosts(limit = 3): Promise<CmsBlogPost[]> {
  const { data, error } = await supabase.from("blog").select("*").eq("published", true);
  if (error) throw error;
  return sortBoardItems((data ?? []).map(mapBlogRow), "default", (post) => post.writtenDate).slice(0, limit);
}

export const PAGE_SIZE = 9;

export async function fetchPublishedList(
  table: "portfolio_items" | "blog_posts",
  opts: { categoryId?: string | undefined; q?: string | undefined; page: number },
) {
  let query = supabase
    .from(table)
    .select("*", { count: "exact" })
    .eq("published", true)
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (opts.categoryId) query = query.eq("category_id", opts.categoryId);
  if (opts.q && opts.q.trim()) {
    const term = opts.q.trim().replace(/[%,]/g, "");
    query = query.or(`title.ilike.%${term}%,summary.ilike.%${term}%`);
  }

  const from = (opts.page - 1) * PAGE_SIZE;
  const { data, error, count } = await query.range(from, from + PAGE_SIZE - 1);
  if (error) throw error;
  return { rows: data ?? [], count: count ?? 0 };
}

export async function fetchPublishedBySlug(
  table: "portfolio_items" | "blog_posts",
  slug: string,
) {
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .eq("published", true)
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function fetchPressReleases() {
  const { data, error } = await supabase
    .from("press_releases")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false, nullsFirst: false });
  if (error) throw error;
  return data ?? [];
}

export async function fetchPress() {
  const { data, error } = await supabase.from("press").select("*").eq("published", true);
  if (error) throw error;
  return sortBoardItems((data ?? []).map(mapPressRow), "default", (item) => item.publishedDate);
}

export async function fetchFaqs() {
  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

function mapPublicNotice(row: {
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
}) {
  return {
    id: row.id,
    category: row.category,
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

export async function fetchNotices() {
  const { data, error } = await supabase.from("notice").select("*").eq("published", true);
  if (error) throw error;
  return sortBoardItems((data ?? []).map(mapPublicNotice), "default", (notice) => notice.writtenDate);
}

export async function fetchNotice(id: string) {
  const { data, error } = await supabase
    .from("notice")
    .select("*")
    .eq("id", id)
    .eq("published", true)
    .maybeSingle();
  if (error) throw error;
  return data ? mapPublicNotice(data) : null;
}

export async function fetchHistory() {
  const { data, error } = await supabase
    .from("company_history")
    .select("*")
    .eq("published", true)
    .order("year", { ascending: false })
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}
