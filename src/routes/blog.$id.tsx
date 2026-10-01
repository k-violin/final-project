import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteLayout, PageHero, EmptyState } from "@/components/site/SiteLayout";
import { BlogDetailView } from "@/components/blog/BlogDetailView";
import { usePublishedBlogPost } from "@/hooks/useBlogPosts";

export const Route = createFileRoute("/blog/$id")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "블로그 | 와이즈인컴퍼니" },
      { name: "description", content: "와이즈인컴퍼니 블로그" },
    ],
  }),
  component: Page,
});

function Page() {
  const { id } = Route.useParams();
  const { data: post, isLoading } = usePublishedBlogPost(id);

  return (
    <SiteLayout>
      <PageHero eyebrow="Blog" title="블로그" />
      <div className="container-page py-14 md:py-20">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">글을 불러오는 중입니다…</p>
        ) : !post ? (
          <EmptyState title="글을 찾을 수 없습니다." description="공개된 글만 확인할 수 있습니다." />
        ) : (
          <BlogDetailView post={post} />
        )}
        <div className="mt-10">
          <Link
            to="/blog"
            className="inline-flex rounded-md border border-border px-5 py-2 text-sm font-semibold text-navy hover:bg-surface"
          >
            목록으로
          </Link>
        </div>
      </div>
    </SiteLayout>
  );
}
