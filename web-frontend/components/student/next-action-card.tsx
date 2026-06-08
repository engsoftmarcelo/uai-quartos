import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export function NextActionCard({
  href,
  label,
  title,
}: {
  href: string;
  label: string;
  title: string;
}) {
  return (
    <article className="grid gap-4 rounded-md border border-border bg-foreground p-4 text-white shadow-xs">
      <p className="inline-flex items-center gap-2 text-sm font-bold text-white/80">
        <CheckCircle2 className="h-4 w-4 text-accent" aria-hidden="true" />
        Proximo passo
      </p>
      <h2 className="font-display text-2xl font-bold">{title}</h2>
      <Link
        className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-accent px-4 text-sm font-bold text-foreground transition hover:bg-[#ffd06a]"
        href={href}
      >
        {label}
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </article>
  );
}
