-- 블로그 이미지를 웹에서 바로 볼 수 있게 blog-images 버킷을 공개로 바꿉니다.
-- Supabase SQL Editor에 붙여넣고 Run 하세요.
-- 버킷은 대시보드에서 이미 만들었다는 전제입니다.

UPDATE storage.buckets
SET public = true
WHERE id = 'blog-images';

DROP POLICY IF EXISTS "blog images public read" ON storage.objects;
CREATE POLICY "blog images public read"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'blog-images');
