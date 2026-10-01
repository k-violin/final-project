-- 블로그 관리 화면용 public.blog 테이블
-- 현재 관리자 폼 필드와 1:1로 맞춘 컬럼입니다.
--
-- 실행 방법:
-- 1. Supabase 대시보드 → SQL Editor
-- 2. 이 파일 전체를 붙여넣고 Run
--
-- 참고:
-- 기존 초기 스키마의 public.blog_posts 는 slug / category_id / body 구조입니다.
-- 지금 만들고 있는 관리자 화면(제목, 내용, 대표 이미지, 분류 텍스트, 작성일, 작성자, 게시 상태)에는
-- 이 public.blog 테이블을 사용합니다. blog_posts 를 지우거나 바꾸지 않습니다.

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

CREATE TABLE IF NOT EXISTS public.blog (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  image_path text NOT NULL,
  category text NOT NULL CHECK (category IN ('데이터', 'AI', '교육', '정책', '산업', '기업', '기타')),
  written_date date,
  author text,
  published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.blog IS '와이즈인컴퍼니 블로그 글';
COMMENT ON COLUMN public.blog.title IS '글 제목 (필수)';
COMMENT ON COLUMN public.blog.content IS '본문 (필수)';
COMMENT ON COLUMN public.blog.image_path IS '대표 이미지 경로 또는 URL (필수). Storage 연결 전에도 경로를 저장합니다.';
COMMENT ON COLUMN public.blog.category IS '분류: 데이터, AI, 교육, 정책, 산업, 기업, 기타';
COMMENT ON COLUMN public.blog.written_date IS '작성일 (선택)';
COMMENT ON COLUMN public.blog.author IS '작성자 (선택)';
COMMENT ON COLUMN public.blog.published IS 'false = 초안, true = 공개';

CREATE INDEX IF NOT EXISTS blog_published_written_date_idx
  ON public.blog (published, written_date DESC NULLS LAST, created_at DESC);

CREATE INDEX IF NOT EXISTS blog_category_idx
  ON public.blog (category);

GRANT SELECT ON public.blog TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog TO authenticated;
GRANT ALL ON public.blog TO service_role;

ALTER TABLE public.blog ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "blog public read published" ON public.blog;
CREATE POLICY "blog public read published" ON public.blog
  FOR SELECT TO anon, authenticated
  USING (published = true);

DROP POLICY IF EXISTS "blog admin read" ON public.blog;
CREATE POLICY "blog admin read" ON public.blog
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "blog admin write" ON public.blog;
CREATE POLICY "blog admin write" ON public.blog
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP TRIGGER IF EXISTS blog_set_updated_at ON public.blog;
CREATE TRIGGER blog_set_updated_at
  BEFORE UPDATE ON public.blog
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();
