import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import {
  PORTFOLIO_CATEGORIES,
  type PortfolioCategory,
  type PortfolioItem,
} from "@/lib/portfolio";
import {
  deleteAdminPortfolio,
  getAdminPortfolio,
  listAdminPortfolios,
  mapPortfolioRow,
  saveAdminPortfolio,
} from "@/lib/portfolio.functions";

export const ADMIN_PORTFOLIO_QUERY_KEY = ["admin-portfolio"] as const;
export const PUBLIC_PORTFOLIO_QUERY_KEY = ["public-portfolio"] as const;

export function useAdminPortfolioItems() {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ADMIN_PORTFOLIO_QUERY_KEY,
    queryFn: () => listAdminPortfolios(),
  });

  const save = useCallback(
    async (item: PortfolioItem) => {
      const saved = await saveAdminPortfolio({
        data: {
          id: item.id || undefined,
          title: item.title,
          content: item.content,
          imagePath: item.imagePath,
          category: item.category,
          writtenDate: item.writtenDate,
          author: item.author,
          published: item.published,
          isPinned: item.isPinned,
          sortOrder: item.sortOrder,
        },
      });
      await qc.invalidateQueries({ queryKey: ADMIN_PORTFOLIO_QUERY_KEY });
      await qc.invalidateQueries({ queryKey: PUBLIC_PORTFOLIO_QUERY_KEY });
      return saved;
    },
    [qc],
  );

  const remove = useCallback(
    async (id: string) => {
      await deleteAdminPortfolio({ data: { id } });
      await qc.invalidateQueries({ queryKey: ADMIN_PORTFOLIO_QUERY_KEY });
      await qc.invalidateQueries({ queryKey: PUBLIC_PORTFOLIO_QUERY_KEY });
    },
    [qc],
  );

  return {
    items: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    errorMessage: query.error instanceof Error ? query.error.message : null,
    save,
    remove,
  };
}

export function useAdminPortfolioItem(id: string | undefined) {
  return useQuery({
    queryKey: [...ADMIN_PORTFOLIO_QUERY_KEY, id],
    enabled: Boolean(id),
    queryFn: () => getAdminPortfolio({ data: { id: id! } }),
  });
}

export function usePublishedPortfolioItems() {
  return useQuery({
    queryKey: PUBLIC_PORTFOLIO_QUERY_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("portfolio")
        .select("*")
        .eq("published", true)
        .order("written_date", { ascending: false, nullsFirst: false });
      if (error) throw error;
      return (data ?? []).map(mapPortfolioRow);
    },
  });
}

export function usePublishedPortfolioItem(id: string) {
  return useQuery({
    queryKey: [...PUBLIC_PORTFOLIO_QUERY_KEY, id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("portfolio")
        .select("*")
        .eq("id", id)
        .eq("published", true)
        .maybeSingle();
      if (error) throw error;
      return data ? mapPortfolioRow(data) : null;
    },
  });
}

export function isPortfolioCategory(value: string): value is PortfolioCategory {
  return PORTFOLIO_CATEGORIES.includes(value as PortfolioCategory);
}
