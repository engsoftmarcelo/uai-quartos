import Link from "next/link";
import {
  BarChart3,
  CalendarCheck,
  Building2,
  HeartHandshake,
  Heart,
  Home,
  LayoutDashboard,
  MessageCircle,
  Search,
  Settings,
  ShieldCheck,
  UsersRound,
  UserRound,
} from "lucide-react";
import type { NavigationItem } from "@/lib/types";
import { cn } from "@/lib/utils";

export interface AppShellProps {
  area: "student" | "landlord";
  children: React.ReactNode;
}

const studentNav: NavigationItem[] = [
  { href: "/dashboard", label: "Painel", icon: LayoutDashboard },
  { href: "/favoritos", label: "Favoritos", icon: Heart },
  { href: "/mensagens", label: "Mensagens", icon: MessageCircle },
  { href: "/reservas", label: "Reservas", icon: CalendarCheck },
  { href: "/perfil", label: "Perfil", icon: UserRound },
  { href: "/student", label: "Busca", icon: Search },
  { href: "/match", label: "Matching", icon: HeartHandshake },
  { href: "/configuracoes", label: "Configurações", icon: Settings },
];

const landlordNav: NavigationItem[] = [
  { href: "/landlord/dashboard", label: "Painel", icon: LayoutDashboard },
  { href: "/landlord/anuncios", label: "Anúncios", icon: Building2 },
  { href: "/landlord/leads", label: "Leads", icon: MessageCircle },
  { href: "/landlord/candidatos", label: "Candidatos", icon: UsersRound },
  { href: "/landlord/calendario", label: "Calendário", icon: CalendarCheck },
  { href: "/landlord/insights", label: "Insights", icon: BarChart3 },
  { href: "/landlord/perfil", label: "Perfil", icon: ShieldCheck },
  { href: "/landlord/configuracoes", label: "Configurações", icon: Settings },
];

export function AppShell({ area, children }: AppShellProps) {
  const nav = area === "student" ? studentNav : landlordNav;
  const label = area === "student" ? "Área do estudante" : "Área do locador";

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-[var(--z-header)] hidden w-64 border-r border-border bg-surface px-4 py-5 lg:block">
        <Link className="mb-8 inline-flex items-center gap-2 font-bold" href="/">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-brand text-white">
            <Home className="h-4 w-4" aria-hidden="true" />
          </span>
          <span>UAI QUARTOS</span>
        </Link>
        <nav aria-label={label} className="grid gap-1">
          {nav.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                className="inline-flex h-11 items-center gap-3 rounded-md px-3 text-sm font-bold text-muted-strong transition hover:bg-surface-muted"
                href={item.href}
                key={item.href}
              >
                {Icon ? <Icon className="h-4 w-4" aria-hidden="true" /> : null}
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <header className="sticky top-0 z-[var(--z-header)] border-b border-border bg-background/92 backdrop-blur lg:hidden">
        <div className="flex h-16 items-center justify-between px-4">
          <Link className="inline-flex items-center gap-2 font-bold" href="/">
            <span className="grid h-9 w-9 place-items-center rounded-md bg-brand text-white">
              <Home className="h-4 w-4" aria-hidden="true" />
            </span>
            <span>UAI</span>
          </Link>
          <nav aria-label={label} className="flex gap-1">
            {nav.slice(0, 3).map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  aria-label={item.label}
                  className={cn(
                    "grid h-10 w-10 place-items-center rounded-md text-muted-strong hover:bg-surface-muted",
                  )}
                  href={item.href}
                  key={item.href}
                >
                  {Icon ? <Icon className="h-4 w-4" aria-hidden="true" /> : null}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main
        className="min-h-screen lg:pl-64"
        id="conteudo"
      >
        <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
