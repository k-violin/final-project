import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { SiteLayout, PageHero, EmptyState } from "@/components/site/SiteLayout";
import { BoardSortSelect } from "@/components/site/BoardSortSelect";
import { BlogCard } from "@/components/blog/BlogCard";
import { usePublishedBlogPosts } from "@/hooks/useBlogPosts";
import { type ContentSortMode, sortBoardItems } from "@/lib/content-sort";

export const Route = createFileRoute("/blog/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Blog | 와이즈인컴퍼니" },
      {
        name: "description",
        content: "데이터 분석과 AI에 관한 와이즈인컴퍼니의 이야기와 소식입니다.",
      },
      { property: "og:title", content: "Blog | 와이즈인컴퍼니" },
      { property: "og:description", content: "데이터와 AI에 관한 와이즈인컴퍼니의 글." },
    ],
  }),
  component: Page,
});

function Page() {
  const { data: posts = [], isLoading } = usePublishedBlogPosts();
  const [sort, setSort] = useState<ContentSortMode>("default");
  const sorted = useMemo(
    () => sortBoardItems(posts, sort, (post) => post.writtenDate),
    [posts, sort],
  );

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Blog"
        title="블로그"
        description="데이터와 AI에 관한 소식과 인사이트를 전합니다. 게시된 글만 방문자에게 공개됩니다."
      />
      <div className="container-page py-14 md:py-20">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">글을 불러오는 중입니다…</p>
        ) : posts.length === 0 ? (
          <EmptyState title="게시된 글이 없습니다." description="관리자가 글을 공개하면 이 목록에 표시됩니다." />
        ) : (
          <>
            <div className="mb-6 flex justify-end">
              <BoardSortSelect value={sort} onChange={setSort} id="blog-sort" />
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {sorted.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          </>
        )}
      </div>
    </SiteLayout>
  );
}
