import Link from "next/link";
import { Home, ShieldCheck } from "lucide-react";
import { siteConfig } from "@/lib/constants";

const footerGroups = [
  {
    title: "Estudantes",
    links: [
      { href: "/buscar", label: "Buscar moradia" },
      { href: "/buscar?nearCampus=true", label: "Perto do campus" },
      { href: "/buscar?billsIncluded=true", label: "Contas inclusas" },
      { href: "/entrar", label: "Entrar ou criar conta" },
      { href: "/seguranca", label: "Como escolher com segurança" },
    ],
  },
  {
    title: "Locadores",
    links: [
      { href: "/landlord", label: "Anunciar um quarto" },
      { href: "/landlord#inventario", label: "Gerenciar inventário" },
      { href: "/seguranca#contratos", label: "Contratos e conformidade" },
    ],
  },
  {
    title: "Cidades e campus",
    links: [
      { href: "/buscar?location=PUC+Minas", label: "PUC Minas" },
      { href: "/buscar?location=UFMG", label: "UFMG" },
      { href: "/buscar?location=Savassi", label: "Savassi" },
      { href: "/buscar?location=UniBH", label: "UniBH" },
    ],
  },
] as const;

export function PublicFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="uai-container grid gap-8 py-10 lg:grid-cols-[minmax(0,1.2fr)_2fr]">
        <div className="grid max-w-md gap-3">
          <Link className="inline-flex items-center gap-2 font-bold" href="/">
            <span className="grid h-9 w-9 place-items-center rounded-md bg-brand text-white">
              <Home className="h-4 w-4" aria-hidden="true" />
            </span>
            <span>{siteConfig.name}</span>
          </Link>
          <p className="text-sm leading-6 text-muted">{siteConfig.description}</p>
          <p className="inline-flex items-center gap-2 text-sm font-bold text-muted-strong">
            <ShieldCheck className="h-4 w-4 text-brand" aria-hidden="true" />
            Anúncios verificados, custos transparentes e dados protegidos pela LGPD.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {footerGroups.map((group) => (
            <nav aria-label={group.title} className="grid content-start gap-3" key={group.title}>
              <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-muted">
                {group.title}
              </h2>
              {group.links.map((link) => (
                <Link
                  className="text-sm font-medium text-muted-strong transition hover:text-brand"
                  href={link.href}
                  key={link.href}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          ))}
        </div>
      </div>

      <div className="border-t border-border">
        <div className="uai-container flex flex-col gap-3 py-4 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} UAI QUARTOS. Todos os direitos reservados.</p>
          <nav aria-label="Links legais" className="flex flex-wrap gap-3">
            {siteConfig.legalNav.map((item) => (
              <Link
                className="font-medium transition hover:text-foreground"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
