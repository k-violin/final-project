-- 숨김(published = false) 글이 삭제된 것처럼 보이지 않게 합니다.
-- 홈페이지(anon)는 노출 글만 보고, 대시보드 Table Editor(authenticated)는
-- published = false 행도 그대로 조회할 수 있습니다.
--
-- 글 자체는 UPDATE 만 하며 DELETE 하지 않습니다.

DROP POLICY IF EXISTS "press public read" ON public.press;
CREATE POLICY "press public read" ON public.press
  FOR SELECT TO anon
  USING (published = true);

DROP POLICY IF EXISTS "press authenticated read all" ON public.press;
CREATE POLICY "press authenticated read all" ON public.press
  FOR SELECT TO authenticated
  USING (true);

DROP POLICY IF EXISTS "notice public read" ON public.notice;
CREATE POLICY "notice public read" ON public.notice
  FOR SELECT TO anon
  USING (published = true);

DROP POLICY IF EXISTS "notice authenticated read all" ON public.notice;
CREATE POLICY "notice authenticated read all" ON public.notice
  FOR SELECT TO authenticated
  USING (true);
