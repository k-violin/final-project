-- 공지사항 / 언론보도 노출여부 (숨김)
-- 기존 글은 모두 노출(true)로 유지합니다. 데이터는 삭제하지 않습니다.
--
-- 블로그(blog), 포트폴리오(portfolio) 는 이미 published 컬럼이 있어 추가하지 않습니다.
--
-- 실행: Supabase SQL Editor에 붙여넣고 Run

ALTER TABLE public.notice
  ADD COLUMN IF NOT EXISTS published boolean NOT NULL DEFAULT true;

ALTER TABLE public.press
  ADD COLUMN IF NOT EXISTS published boolean NOT NULL DEFAULT true;

COMMENT ON COLUMN public.notice.published IS '노출여부. true=노출, false=숨김';
COMMENT ON COLUMN public.press.published IS '노출여부. true=노출, false=숨김';

DROP POLICY IF EXISTS "notice public read" ON public.notice;
CREATE POLICY "notice public read" ON public.notice
  FOR SELECT TO anon, authenticated
  USING (published = true);

DROP POLICY IF EXISTS "press public read" ON public.press;
CREATE POLICY "press public read" ON public.press
  FOR SELECT TO anon, authenticated
  USING (published = true);
