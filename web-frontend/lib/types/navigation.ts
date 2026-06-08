import type { ComponentType, SVGProps } from "react";

export interface NavigationItem {
  href: string;
  label: string;
  description?: string;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
}
