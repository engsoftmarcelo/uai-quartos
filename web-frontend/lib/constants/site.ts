import type { NavigationItem } from "@/lib/types";

export const siteConfig = {
  name: "UAI QUARTOS",
  shortName: "UAI",
  description:
    "Marketplace de moradia universitária para encontrar repúblicas, quartos partilhados e contratos com mais confiança.",
  publicNav: [
    { href: "/", label: "Início" },
    { href: "/buscar", label: "Buscar" },
    { href: "/seguranca", label: "Segurança" },
  ] satisfies NavigationItem[],
  authNav: [
    { href: "/student", label: "Estudante" },
    { href: "/landlord", label: "Locador" },
  ] satisfies NavigationItem[],
  legalNav: [
    { href: "/termos", label: "Termos de uso" },
    { href: "/privacidade", label: "Privacidade" },
    { href: "/seguranca#lgpd", label: "LGPD" },
  ] satisfies NavigationItem[],
} as const;
