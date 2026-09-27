import { SectionTitle } from "./SectionTitle";

export function PageHeader({ eyebrow, title, lede }: { eyebrow?: string; title: string; lede?: string }) {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-6 pt-14 text-center sm:px-6 sm:pt-20">
      {eyebrow && <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-teal">{eyebrow}</p>}
      <SectionTitle title={title} as="h1" />
      {lede && <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted">{lede}</p>}
    </div>
  );
}
