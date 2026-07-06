import { ShieldCheck } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export interface TrustBadgeProps {
  className?: string;
  /** false renderiza o estado "verificação pendente" em cinza. */
  verified?: boolean;
}

/**
 * Selo "Dono verificado pela UAI" — sinal de confiança central do produto.
 * Usar sempre próximo ao título do anúncio e no perfil do locador.
 */
export function TrustBadge({ className, verified = true }: TrustBadgeProps) {
  if (!verified) {
    return (
      <span
        className={cn(
          "inline-flex h-7 items-center gap-1.5 rounded-md bg-surface-muted px-2 text-xs font-bold text-muted",
          className,
        )}
      >
        <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
        Verificação pendente
      </span>
    );
  }

  return (
    <Tooltip content="Documentos e imóvel checados pela UAI para evitar golpes.">
      <span
        className={cn(
          "inline-flex h-7 cursor-help items-center gap-1.5 rounded-md bg-success-soft px-2 text-xs font-bold text-success",
          className,
        )}
        tabIndex={0}
      >
        <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
        Dono verificado pela UAI
      </span>
    </Tooltip>
  );
}
