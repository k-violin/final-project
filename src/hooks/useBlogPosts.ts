import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import {
  deleteAdminBlog,
  getAdminBlog,
  listAdminBlogs,
  mapBlogRow,
  saveAdminBlog,
} from "@/lib/blog.functions";
import { BLOG_CATEGORIES, type BlogCategory, type BlogPost } from "@/lib/blog-mock";

export const ADMIN_BLOG_QUERY_KEY = ["admin-blog"] as const;
export const PUBLIC_BLOG_QUERY_KEY = ["public-blog"] as const;

export function useAdminBlogPosts() {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ADMIN_BLOG_QUERY_KEY,
    queryFn: () => listAdminBlogs(),
  });

  const save = useCallback(
    async (post: BlogPost) => {
      const saved = await saveAdminBlog({
        data: {
          id: post.id || undefined,
          title: post.title,
          content: post.content,
          imagePath: post.imagePath,
          category: post.category,
          writtenDate: post.writtenDate,
          author: post.author,
          published: post.published,
          isPinned: post.isPinned,
          sortOrder: post.sortOrder,
        },
      });
      await qc.invalidateQueries({ queryKey: ADMIN_BLOG_QUERY_KEY });
      await qc.invalidateQueries({ queryKey: PUBLIC_BLOG_QUERY_KEY });
      await qc.invalidateQueries({ queryKey: ["blog-preview"] });
      return saved;
    },
    [qc],
  );

  const remove = useCallback(
    async (id: string) => {
      await deleteAdminBlog({ data: { id } });
      await qc.invalidateQueries({ queryKey: ADMIN_BLOG_QUERY_KEY });
      await qc.invalidateQueries({ queryKey: PUBLIC_BLOG_QUERY_KEY });
      await qc.invalidateQueries({ queryKey: ["blog-preview"] });
    },
    [qc],
  );

  return {
    posts: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    errorMessage: query.error instanceof Error ? query.error.message : null,
    save,
    remove,
  };
}

export function useAdminBlogPost(id: string | undefined) {
  return useQuery({
    queryKey: [...ADMIN_BLOG_QUERY_KEY, id],
    enabled: Boolean(id),
    queryFn: () => getAdminBlog({ data: { id: id! } }),
  });
}

export function usePublishedBlogPosts() {
  return useQuery({
    queryKey: PUBLIC_BLOG_QUERY_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog")
        .select("*")
        .eq("published", true)
        .order("written_date", { ascending: false, nullsFirst: false });
      if (error) throw error;
      return (data ?? []).map(mapBlogRow);
    },
  });
}

export function usePublishedBlogPost(id: string) {
  return useQuery({
    queryKey: [...PUBLIC_BLOG_QUERY_KEY, id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog")
        .select("*")
        .eq("id", id)
        .eq("published", true)
        .maybeSingle();
      if (error) throw error;
      return data ? mapBlogRow(data) : null;
    },
  });
}

export function isBlogCategory(value: string): value is BlogCategory {
  return BLOG_CATEGORIES.includes(value as BlogCategory);
}
