import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import {
  deleteAdminPress,
  getAdminPress,
  listAdminPress,
  saveAdminPress,
} from "@/lib/press.functions";
import {
  ADMIN_PRESS_QUERY_KEY,
  PUBLIC_PRESS_QUERY_KEY,
  type PressRelease,
} from "@/lib/press-mock";

export function useAdminPress() {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ADMIN_PRESS_QUERY_KEY,
    queryFn: () => listAdminPress(),
  });

  const save = useCallback(
    async (item: PressRelease) => {
      const saved = await saveAdminPress({
        data: {
          id: item.id || undefined,
          title: item.title,
          source: item.source,
          articleUrl: item.articleUrl,
          publishedDate: item.publishedDate,
          isPinned: item.isPinned,
          sortOrder: item.sortOrder,
          published: item.published,
        },
      });
      await qc.invalidateQueries({ queryKey: ADMIN_PRESS_QUERY_KEY });
      await qc.invalidateQueries({ queryKey: PUBLIC_PRESS_QUERY_KEY });
      return saved;
    },
    [qc],
  );

  const remove = useCallback(
    async (id: string) => {
      await deleteAdminPress({ data: { id } });
      await qc.invalidateQueries({ queryKey: ADMIN_PRESS_QUERY_KEY });
      await qc.invalidateQueries({ queryKey: PUBLIC_PRESS_QUERY_KEY });
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

export function useAdminPressItem(id: string | undefined) {
  return useQuery({
    queryKey: [...ADMIN_PRESS_QUERY_KEY, id],
    enabled: Boolean(id),
    queryFn: () => getAdminPress({ data: { id: id! } }),
  });
}
