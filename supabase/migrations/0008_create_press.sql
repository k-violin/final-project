-- 언론보도 관리 화면용 public.press 테이블
-- 관리자 폼 필드와 1:1로 맞춘 컬럼입니다.
--
-- 실행 방법:
-- 1. Supabase 대시보드 → SQL Editor
-- 2. 이 파일 전체를 붙여넣고 Run
--
-- 참고:
-- 기존 초기 스키마의 public.press_releases 는 title / body / outlet / source_url 구조입니다.
-- 지금 만들고 있는 관리자 화면(제목, 출처, 링크주소, 날짜)에는
-- 이 public.press 테이블을 사용합니다. press_releases 를 지우거나 바꾸지 않습니다.

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TABLE IF NOT EXISTS public.press (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  source text NOT NULL,
  article_url text NOT NULL CHECK (article_url ~* '^https?://'),
  published_date date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.press IS '와이즈인컴퍼니 언론보도';
COMMENT ON COLUMN public.press.title IS '제목 (필수)';
COMMENT ON COLUMN public.press.source IS '출처 (필수)';
COMMENT ON COLUMN public.press.article_url IS '링크주소 (필수, http/https URL)';
COMMENT ON COLUMN public.press.published_date IS '날짜 (선택)';

CREATE INDEX IF NOT EXISTS press_published_date_idx
  ON public.press (published_date DESC NULLS LAST, created_at DESC);

GRANT SELECT ON public.press TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.press TO authenticated;
GRANT ALL ON public.press TO service_role;

ALTER TABLE public.press ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "press public read" ON public.press;
CREATE POLICY "press public read" ON public.press
  FOR SELECT TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "press admin read" ON public.press;
CREATE POLICY "press admin read" ON public.press
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "press admin write" ON public.press;
CREATE POLICY "press admin write" ON public.press
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP TRIGGER IF EXISTS press_set_updated_at ON public.press;
CREATE TRIGGER press_set_updated_at
  BEFORE UPDATE ON public.press
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();
