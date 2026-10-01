import { ContactButton } from "./ContactButton";
import { RevealOnScroll, type RevealEffect } from "./RevealOnScroll";
import type { InquiryArea } from "@/lib/site";

const BLOCK_REVEALS: RevealEffect[] = ["from-left", "from-right", "from-up", "from-scale", "from-flip", "from-blur"];

export type ServiceBlock = {
  title: string;
  description: string;
  features?: string[];
  uses?: string[];
  benefits?: string[];
  image?: string;
  imageAlt?: string;
};

export function ServiceSections({
  area,
  blocks,
}: {
  area: InquiryArea;
  blocks: ServiceBlock[];
}) {
  return (
    <div className="container-page grid gap-8 pt-8 pb-16 md:pt-10 md:pb-20">
      {blocks.map((block, index) => (
        <RevealOnScroll
          key={block.title}
          as="section"
          effect={BLOCK_REVEALS[index % BLOCK_REVEALS.length]!}
          delay={index * 80}
          className="overflow-hidden rounded-xl border border-border bg-white transition-all duration-500 hover:-translate-y-1 hover:shadow-lg md:grid md:grid-cols-2 md:items-stretch"
          aria-labelledby={`svc-${block.title}`}
        >
          {block.image && (
            <img
              src={block.image}
              alt={block.imageAlt ?? ""}
              width={1024}
              height={640}
              loading="lazy"
              className={`h-52 w-full object-cover md:h-full md:min-h-72 ${
                index % 2 === 1 ? "md:order-last" : ""
              }`}
            />
          )}
          <div className="p-7 md:p-10">
            <h2 id={`svc-${block.title}`} className="text-xl font-bold text-navy md:text-2xl">
              {block.title}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              {block.description}
            </p>
            <BulletList title="기능" items={block.features} />
            <BulletList title="활용 방향" items={block.uses} />
            <BulletList title="기대 효과" items={block.benefits} />
            <div className="mt-7">
              <ContactButton area={area} detail={block.title} />
            </div>
          </div>
        </RevealOnScroll>
      ))}
    </div>
  );
}

function BulletList({ title, items }: { title: string; items?: string[] }) {
  if (!items?.length) return null;
  return (
    <div className="mt-6">
      <h3 className="text-sm font-semibold tracking-wide text-navy">{title}</h3>
      <ul className="mt-2.5 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-sm leading-relaxed text-foreground">
            <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-cyan" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
