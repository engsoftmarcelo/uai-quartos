import { CalendarDays, Clock3 } from "lucide-react";
import { formatShortDate } from "@/lib/formatters";
import type { ListingDetail } from "@/lib/types";

export function AvailabilityCard({
  availability,
}: {
  availability: ListingDetail["availability"];
}) {
  return (
    <section className="grid gap-4 rounded-md border border-border bg-surface p-4 shadow-xs">
      <div className="grid gap-1">
        <p className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.12em] text-brand">
          <CalendarDays className="h-4 w-4" aria-hidden="true" />
          disponibilidade
        </p>
        <h2 className="font-display text-2xl font-bold text-foreground">
          Quando posso entrar
        </h2>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <Info
          icon={<CalendarDays className="h-4 w-4" aria-hidden="true" />}
          label="Disponível a partir de"
          value={formatShortDate(availability.availableFrom)}
        />
        <Info
          icon={<Clock3 className="h-4 w-4" aria-hidden="true" />}
          label="Duração mínima"
          value={`${availability.minStayMonths} meses`}
        />
      </div>

      <div className="grid gap-2 rounded-md bg-surface-muted p-3">
        <h3 className="text-sm font-bold text-muted-strong">
          Janelas de visita
        </h3>
        <ul className="grid gap-2 text-sm text-muted">
          {availability.visitWindows.map((window) => (
            <li key={window}>- {window}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Info({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="grid gap-1 rounded-md border border-border p-3">
      <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-muted">
        <span className="text-brand">{icon}</span>
        {label}
      </p>
      <p className="text-sm font-bold text-muted-strong">{value}</p>
    </div>
  );
}
