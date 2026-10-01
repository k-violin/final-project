-- 블로그 / 포트폴리오 / 공지사항 / 언론보도 노출 순서
-- 기존 테이블에 컬럼만 추가합니다. 데이터는 삭제하지 않습니다.
--
-- 실행 방법:
-- 1. Supabase 대시보드 → SQL Editor
-- 2. 이 파일 전체를 붙여넣고 Run
--
-- 실제 관리자·공개 화면이 사용하는 테이블:
--   blog, portfolio, notice, press
-- 초기 CMS의 notices / press_releases 는 건드리지 않습니다.

ALTER TABLE public.blog
  ADD COLUMN IF NOT EXISTS is_pinned boolean NOT NULL DEFAULT false;
ALTER TABLE public.blog
  ADD COLUMN IF NOT EXISTS sort_order integer;

ALTER TABLE public.portfolio
  ADD COLUMN IF NOT EXISTS is_pinned boolean NOT NULL DEFAULT false;
ALTER TABLE public.portfolio
  ADD COLUMN IF NOT EXISTS sort_order integer;

ALTER TABLE public.notice
  ADD COLUMN IF NOT EXISTS is_pinned boolean NOT NULL DEFAULT false;
ALTER TABLE public.notice
  ADD COLUMN IF NOT EXISTS sort_order integer;

ALTER TABLE public.press
  ADD COLUMN IF NOT EXISTS is_pinned boolean NOT NULL DEFAULT false;
ALTER TABLE public.press
  ADD COLUMN IF NOT EXISTS sort_order integer;

COMMENT ON COLUMN public.blog.is_pinned IS '상단 고정';
COMMENT ON COLUMN public.blog.sort_order IS '노출 순서. 작을수록 먼저. NULL이면 날짜순';
COMMENT ON COLUMN public.portfolio.is_pinned IS '상단 고정';
COMMENT ON COLUMN public.portfolio.sort_order IS '노출 순서. 작을수록 먼저. NULL이면 날짜순';
COMMENT ON COLUMN public.notice.is_pinned IS '상단 고정';
COMMENT ON COLUMN public.notice.sort_order IS '노출 순서. 작을수록 먼저. NULL이면 날짜순';
COMMENT ON COLUMN public.press.is_pinned IS '상단 고정';
COMMENT ON COLUMN public.press.sort_order IS '노출 순서. 작을수록 먼저. NULL이면 날짜순';

CREATE INDEX IF NOT EXISTS blog_pin_sort_idx
  ON public.blog (is_pinned DESC, sort_order ASC NULLS LAST, written_date DESC NULLS LAST, created_at DESC);

CREATE INDEX IF NOT EXISTS portfolio_pin_sort_idx
  ON public.portfolio (is_pinned DESC, sort_order ASC NULLS LAST, written_date DESC NULLS LAST, created_at DESC);

CREATE INDEX IF NOT EXISTS notice_pin_sort_idx
  ON public.notice (is_pinned DESC, sort_order ASC NULLS LAST, written_date DESC NULLS LAST, created_at DESC);

CREATE INDEX IF NOT EXISTS press_pin_sort_idx
  ON public.press (is_pinned DESC, sort_order ASC NULLS LAST, published_date DESC NULLS LAST, created_at DESC);
