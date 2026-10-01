import { supabase } from "@/integrations/supabase/client";
import { BLOG_CATEGORIES, type BlogCategory, type BlogPost } from "@/lib/blog-mock";

type BlogRow = {
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

export function mapBlogRow(row: BlogRow): BlogPost {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    imagePath: row.image_path,
    category: (BLOG_CATEGORIES.includes(row.category as BlogCategory) ? row.category : "기타") as BlogCategory,
    writtenDate: row.written_date,
    author: row.author,
    published: row.published,
    isPinned: row.is_pinned === true,
    sortOrder: typeof row.sort_order === "number" ? row.sort_order : null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function dbErrorMessage(message: string) {
  if (message.includes("Could not find the table") || message.includes("schema cache")) {
    return "Supabase에 blog 테이블이 없습니다. SQL Editor에서 테이블 생성 SQL을 먼저 실행해 주세요.";
  }
  if (message.includes("row-level security") || message.includes("permission denied") || message.includes("42501")) {
    return "blog 테이블 쓰기 권한이 없습니다. supabase/migrations/0003_blog_app_write.sql 을 SQL Editor에서 실행해 주세요.";
  }
  return message;
}

export async function listAdminBlogs(): Promise<BlogPost[]> {
  const { data, error } = await supabase.from("blog").select("*").order("created_at", { ascending: false });
  if (error) throw new Error(dbErrorMessage(error.message));
  return (data ?? []).map(mapBlogRow);
}

export async function getAdminBlog(id: string): Promise<BlogPost | null> {
  const { data, error } = await supabase.from("blog").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(dbErrorMessage(error.message));
  return data ? mapBlogRow(data) : null;
}

export async function saveAdminBlog(post: {
  id?: string;
  title: string;
  content: string;
  imagePath: string;
  category: BlogCategory;
  writtenDate: string | null;
  author: string | null;
  published: boolean;
  isPinned: boolean;
  sortOrder: number | null;
}): Promise<BlogPost> {
  const payload = {
    title: post.title,
    content: post.content,
    image_path: post.imagePath,
    category: post.category,
    written_date: post.writtenDate || null,
    author: post.author || null,
    published: post.published,
    is_pinned: post.isPinned,
    sort_order: post.sortOrder,
  };

  if (post.id) {
    const { data, error } = await supabase.from("blog").update(payload).eq("id", post.id).select("*").single();
    if (error) throw new Error(dbErrorMessage(error.message));
    return mapBlogRow(data);
  }

  const { data, error } = await supabase.from("blog").insert(payload).select("*").single();
  if (error) throw new Error(dbErrorMessage(error.message));
  return mapBlogRow(data);
}

export async function deleteAdminBlog(id: string) {
  const { error } = await supabase.from("blog").delete().eq("id", id);
  if (error) throw new Error(dbErrorMessage(error.message));
}
