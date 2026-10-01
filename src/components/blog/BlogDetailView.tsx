import { formatBlogDate, type BlogPost } from "@/lib/blog-mock";

export function BlogDetailView({ post }: { post: BlogPost }) {
  return (
    <article>
      <img
        src={post.imagePath}
        alt=""
        className="h-56 w-full rounded-xl object-cover md:h-[26rem]"
      />
      <p className="mt-8 text-sm font-semibold text-primary">{post.category}</p>
      <h1 className="mt-2 text-2xl font-bold leading-snug text-navy md:text-4xl">{post.title}</h1>
      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
        <span>작성일 {formatBlogDate(post.writtenDate) || formatBlogDate(post.createdAt) || "-"}</span>
        <span>작성자 {post.author || "-"}</span>
      </div>
      <div className="mt-8 whitespace-pre-wrap text-base leading-8 text-foreground">{post.content}</div>
    </article>
  );
}
