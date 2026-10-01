import { Link } from "@tanstack/react-router";

import { Badge } from "@/components/ui/badge";
import { formatBlogDate } from "@/lib/blog-mock";
import type { BlogPost } from "@/lib/blog-mock";

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      to="/blog/$id"
      params={{ id: post.id }}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-white transition-shadow hover:shadow-md"
    >
      <div className="overflow-hidden bg-surface">
        <img
          src={post.imagePath}
          alt=""
          className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs font-semibold text-primary">{post.category}</p>
          {post.isPinned ? <Badge>상단 고정</Badge> : null}
        </div>
        <h2 className="mt-2 text-base font-bold leading-snug text-navy group-hover:text-primary">{post.title}</h2>
        <p className="mt-4 text-sm text-muted-foreground">
          {formatBlogDate(post.writtenDate) || formatBlogDate(post.createdAt)}
          {post.author ? ` · ${post.author}` : ""}
        </p>
      </div>
    </Link>
  );
}
