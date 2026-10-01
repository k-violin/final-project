-- 포트폴리오 관리 화면용 public.portfolio 테이블
-- 관리자 폼 필드와 1:1로 맞춘 컬럼입니다.
--
-- 실행 방법:
-- 1. Supabase 대시보드 → SQL Editor
-- 2. 이 파일 전체를 붙여넣고 Run
--
-- 참고:
-- 기존 초기 스키마의 public.portfolio_items 는 slug / category_id / body 구조입니다.
-- 지금 만들고 있는 관리자 화면(제목, 내용, 대표 이미지, 분류, 작성일, 작성자, 게시 상태)에는
-- 이 public.portfolio 테이블을 사용합니다. portfolio_items 를 지우거나 바꾸지 않습니다.

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

CREATE TABLE IF NOT EXISTS public.portfolio (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  image_path text NOT NULL,
  category text NOT NULL CHECK (category IN ('공공', '기업', '교육')),
  written_date date,
  author text,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.portfolio IS '와이즈인컴퍼니 포트폴리오';
COMMENT ON COLUMN public.portfolio.title IS '제목 (필수)';
COMMENT ON COLUMN public.portfolio.content IS '내용 (필수)';
COMMENT ON COLUMN public.portfolio.image_path IS '이미지 (필수). 파일 업로드 경로 또는 data URL';
COMMENT ON COLUMN public.portfolio.category IS '분류 (필수): 공공, 기업, 교육';
COMMENT ON COLUMN public.portfolio.written_date IS '작성일 (선택)';
COMMENT ON COLUMN public.portfolio.author IS '작성자 (선택)';
COMMENT ON COLUMN public.portfolio.published IS '게시 상태. false = 초안, true = 공개';

CREATE INDEX IF NOT EXISTS portfolio_published_written_date_idx
  ON public.portfolio (published, written_date DESC NULLS LAST, created_at DESC);

CREATE INDEX IF NOT EXISTS portfolio_category_idx
  ON public.portfolio (category);

GRANT SELECT ON public.portfolio TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.portfolio TO authenticated;
GRANT ALL ON public.portfolio TO service_role;

ALTER TABLE public.portfolio ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "portfolio public read published" ON public.portfolio;
CREATE POLICY "portfolio public read published" ON public.portfolio
  FOR SELECT TO anon, authenticated
  USING (published = true);

DROP POLICY IF EXISTS "portfolio admin read" ON public.portfolio;
CREATE POLICY "portfolio admin read" ON public.portfolio
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "portfolio admin write" ON public.portfolio;
CREATE POLICY "portfolio admin write" ON public.portfolio
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP TRIGGER IF EXISTS portfolio_set_updated_at ON public.portfolio;
CREATE TRIGGER portfolio_set_updated_at
  BEFORE UPDATE ON public.portfolio
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();
