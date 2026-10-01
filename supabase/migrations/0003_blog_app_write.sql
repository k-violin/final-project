-- 관리자 페이지가 publishable key로 blog 테이블에 글을 저장할 수 있게 합니다.
-- (현재 관리자 로그인은 Supabase Auth가 아니라서 service_role 키 없이 동작합니다.)
--
-- Supabase 대시보드 → SQL Editor에 이 파일 전체를 붙여넣고 Run 하세요.

GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog TO authenticated;

DROP POLICY IF EXISTS "blog admin read" ON public.blog;
DROP POLICY IF EXISTS "blog admin write" ON public.blog;
DROP POLICY IF EXISTS "blog app manage" ON public.blog;

CREATE POLICY "blog app manage" ON public.blog
  FOR ALL TO anon, authenticated
  USING (true)
  WITH CHECK (true);
