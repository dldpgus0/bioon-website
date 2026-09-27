// Centered section heading with the line–dot–line divider.
export function SectionTitle({
  title,
  subtitle,
  onBrand = false,
  as: Tag = "h2",
}: {
  title: string;
  subtitle?: string;
  onBrand?: boolean;
  as?: "h1" | "h2";
}) {
  const line = onBrand ? "bg-white/70" : "bg-teal/50";
  return (
    <div className="text-center">
      <Tag className={`text-3xl font-bold tracking-tight sm:text-4xl ${onBrand ? "text-white" : "text-ink"}`}>{title}</Tag>
      <div className="mx-auto mt-4 flex w-36 items-center" aria-hidden>
        <span className={`h-px flex-1 ${line}`} />
        <span className={`mx-1.5 h-2.5 w-2.5 rounded-full border-2 ${onBrand ? "border-white" : "border-teal"}`} />
        <span className={`h-px flex-1 ${line}`} />
      </div>
      {subtitle && <p className={`mt-3 text-[15px] ${onBrand ? "text-white/80" : "text-muted"}`}>{subtitle}</p>}
    </div>
  );
}
