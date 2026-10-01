import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { fetchNotice } from "@/lib/db";
import {
  deleteAdminNotice,
  getAdminNotice,
  listAdminNotices,
  saveAdminNotice,
} from "@/lib/notice.functions";
import type { Notice } from "@/lib/notice-mock";

export const ADMIN_NOTICE_QUERY_KEY = ["admin-notice"] as const;
export const PUBLIC_NOTICE_QUERY_KEY = ["public-notice"] as const;

export function useAdminNotices() {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ADMIN_NOTICE_QUERY_KEY,
    queryFn: () => listAdminNotices(),
  });

  const save = useCallback(
    async (notice: Notice) => {
      const saved = await saveAdminNotice({
        data: {
          id: notice.id || undefined,
          category: notice.category,
          title: notice.title,
          content: notice.content,
          writtenDate: notice.writtenDate,
          author: notice.author,
          isPinned: notice.isPinned,
          sortOrder: notice.sortOrder,
          published: notice.published,
        },
      });
      await qc.invalidateQueries({ queryKey: ADMIN_NOTICE_QUERY_KEY });
      await qc.invalidateQueries({ queryKey: PUBLIC_NOTICE_QUERY_KEY });
      return saved;
    },
    [qc],
  );

  const remove = useCallback(
    async (id: string) => {
      await deleteAdminNotice({ data: { id } });
      await qc.invalidateQueries({ queryKey: ADMIN_NOTICE_QUERY_KEY });
      await qc.invalidateQueries({ queryKey: PUBLIC_NOTICE_QUERY_KEY });
    },
    [qc],
  );

  return {
    notices: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    errorMessage: query.error instanceof Error ? query.error.message : null,
    save,
    remove,
  };
}

export function useAdminNotice(id: string | undefined) {
  return useQuery({
    queryKey: [...ADMIN_NOTICE_QUERY_KEY, id],
    enabled: Boolean(id),
    queryFn: () => getAdminNotice({ data: { id: id! } }),
  });
}

export function usePublishedNotice(id: string | undefined) {
  return useQuery({
    queryKey: [...PUBLIC_NOTICE_QUERY_KEY, id],
    enabled: Boolean(id),
    queryFn: () => fetchNotice(id!),
  });
}
