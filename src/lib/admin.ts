import { supabase } from "@/integrations/supabase/client";

export type AdminTable =
  | "portfolio_items"
  | "blog_posts"
  | "press_releases"
  | "faqs"
  | "notices"
  | "company_history"
  | "categories"
  | "trust_metrics";

export async function adminList(table: AdminTable, orderBy = "created_at") {
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .order(orderBy, { ascending: false });
  if (error) throw error;
  return (data ?? []) as Record<string, unknown>[];
}

export async function adminSave(
  table: AdminTable,
  values: Record<string, unknown>,
  id?: string | undefined,
) {
  // 관리자 폼은 테이블마다 필드가 달라 동적 객체를 사용합니다.
  const client = supabase.from(table) as unknown as {
    update: (v: Record<string, unknown>) => { eq: (c: string, v: string) => Promise<{ error: unknown }> };
    insert: (v: Record<string, unknown>) => Promise<{ error: unknown }>;
  };
  const { error } = id ? await client.update(values).eq("id", id) : await client.insert(values);
  if (error) throw error;
}

export async function adminDelete(table: AdminTable, id: string) {
  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) throw error;
}

export async function fetchInquiries() {
  const { data, error } = await supabase
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function updateInquiryStatus(id: string, status: "new" | "in_progress" | "done") {
  const { error } = await supabase.from("inquiries").update({ status }).eq("id", id);
  if (error) throw error;
}

export async function saveSetting(key: string, value: string) {
  const { error } = await supabase
    .from("site_settings")
    .upsert({ key, value }, { onConflict: "key" });
  if (error) throw error;
}

/** 이미지 업로드 후 서명된 표시용 URL을 반환합니다. */
export async function uploadImage(file: File) {
  const path = `${crypto.randomUUID()}-${file.name.replace(/[^\w.-]/g, "_")}`;
  const { error } = await supabase.storage.from("site-images").upload(path, file);
  if (error) throw error;
  const { data, error: signError } = await supabase.storage
    .from("site-images")
    .createSignedUrl(path, 60 * 60 * 24 * 365 * 5);
  if (signError) throw signError;
  return data.signedUrl;
}

export async function isCurrentUserAdmin() {
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) return false;
  const { data, error } = await supabase.rpc("has_role", {
    _user_id: user.id,
    _role: "admin",
  });
  if (error) return false;
  return data === true;
}
