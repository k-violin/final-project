-- 공지사항 관리 화면용 public.notice 테이블
-- 관리자 폼 필드와 1:1로 맞춘 컬럼입니다.
--
-- 실행 방법:
-- 1. Supabase 대시보드 → SQL Editor
-- 2. 이 파일 전체를 붙여넣고 Run
--
-- 참고:
-- 기존 초기 스키마의 public.notices 는 title / body / pinned / published 구조입니다.
-- 지금 만들고 있는 관리자 화면(분류, 제목, 내용, 작성일, 작성자)에는
-- 이 public.notice 테이블을 사용합니다. notices 를 지우거나 바꾸지 않습니다.

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

CREATE TABLE IF NOT EXISTS public.notice (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL CHECK (category IN ('전체공지', '서비스', '회사소식', '기타')),
  title text NOT NULL,
  content text NOT NULL,
  written_date date,
  author text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.notice IS '와이즈인컴퍼니 공지사항';
COMMENT ON COLUMN public.notice.category IS '분류 (필수): 전체공지, 서비스, 회사소식, 기타';
COMMENT ON COLUMN public.notice.title IS '제목 (필수)';
COMMENT ON COLUMN public.notice.content IS '내용 (필수)';
COMMENT ON COLUMN public.notice.written_date IS '작성일 (선택)';
COMMENT ON COLUMN public.notice.author IS '작성자 (선택)';

CREATE INDEX IF NOT EXISTS notice_written_date_idx
  ON public.notice (written_date DESC NULLS LAST, created_at DESC);

CREATE INDEX IF NOT EXISTS notice_category_idx
  ON public.notice (category);

GRANT SELECT ON public.notice TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notice TO authenticated;
GRANT ALL ON public.notice TO service_role;

ALTER TABLE public.notice ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "notice public read" ON public.notice;
CREATE POLICY "notice public read" ON public.notice
  FOR SELECT TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "notice admin read" ON public.notice;
CREATE POLICY "notice admin read" ON public.notice
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "notice admin write" ON public.notice;
CREATE POLICY "notice admin write" ON public.notice
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP TRIGGER IF EXISTS notice_set_updated_at ON public.notice;
CREATE TRIGGER notice_set_updated_at
  BEFORE UPDATE ON public.notice
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();
