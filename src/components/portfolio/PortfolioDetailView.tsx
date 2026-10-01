import { formatPortfolioDate, type PortfolioItem } from "@/lib/portfolio";

export function PortfolioDetailView({ item }: { item: PortfolioItem }) {
  return (
    <article>
      <img
        src={item.imagePath}
        alt=""
        className="h-56 w-full rounded-xl object-cover md:h-[26rem]"
      />
      <p className="mt-8 text-sm font-semibold text-primary">{item.category}</p>
      <h1 className="mt-2 text-2xl font-bold leading-snug text-navy md:text-4xl">{item.title}</h1>
      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
        <span>작성일 {formatPortfolioDate(item.writtenDate) || formatPortfolioDate(item.createdAt) || "-"}</span>
        <span>작성자 {item.author || "-"}</span>
      </div>
      <div className="mt-8 whitespace-pre-wrap text-base leading-8 text-foreground">{item.content}</div>
    </article>
  );
}
