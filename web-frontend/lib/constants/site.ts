import type { NavigationItem } from "@/lib/types";

export const siteConfig = {
  name: "UAI QUARTOS",
  shortName: "UAI",
  description:
    "Marketplace de moradia universitaria para encontrar republicas, quartos partilhados e contratos com mais confianca.",
  publicNav: [
    { href: "/", label: "Inicio" },
    { href: "/buscar", label: "Buscar" },
    { href: "/seguranca", label: "Seguranca" },
  ] satisfies NavigationItem[],
  authNav: [
    { href: "/student", label: "Estudante" },
    { href: "/landlord", label: "Locador" },
  ] satisfies NavigationItem[],
  legalNav: [
    { href: "/seguranca", label: "Confianca" },
    { href: "/seguranca#lgpd", label: "LGPD" },
    { href: "/seguranca#contratos", label: "Contratos" },
  ] satisfies NavigationItem[],
} as const;
