import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getAdminInquiry,
  listAdminInquiries,
  saveAdminInquiryReply,
  updateAdminInquiryStatus,
  type InquiryUiStatus,
} from "@/lib/inquiries.functions";

export const ADMIN_INQUIRY_QUERY_KEY = ["admin-inquiries"] as const;

export function useAdminInquiries() {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ADMIN_INQUIRY_QUERY_KEY,
    queryFn: () => listAdminInquiries(),
  });

  const saveReply = useCallback(
    async (id: string, reply: string) => {
      const saved = await saveAdminInquiryReply({ data: { id, reply } });
      qc.setQueryData([...ADMIN_INQUIRY_QUERY_KEY, id], saved);
      await qc.invalidateQueries({ queryKey: ADMIN_INQUIRY_QUERY_KEY });
      return saved;
    },
    [qc],
  );

  const updateStatus = useCallback(
    async (id: string, status: InquiryUiStatus) => {
      const saved = await updateAdminInquiryStatus({ data: { id, status } });
      qc.setQueryData([...ADMIN_INQUIRY_QUERY_KEY, id], saved);
      await qc.invalidateQueries({ queryKey: ADMIN_INQUIRY_QUERY_KEY });
      return saved;
    },
    [qc],
  );

  return {
    inquiries: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    errorMessage: query.error instanceof Error ? query.error.message : null,
    saveReply,
    updateStatus,
  };
}

export function useAdminInquiry(id: string | undefined) {
  return useQuery({
    queryKey: [...ADMIN_INQUIRY_QUERY_KEY, id],
    enabled: Boolean(id),
    queryFn: () => getAdminInquiry({ data: { id: id! } }),
  });
}
