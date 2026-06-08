import { CheckCircle2, Circle, Clock3 } from "lucide-react";
import type { StudentApplicationTimelineEvent } from "@/lib/types";

const iconByStatus = {
  complete: CheckCircle2,
  current: Clock3,
  upcoming: Circle,
} as const;

export function ApplicationTimeline({
  events,
}: {
  events: StudentApplicationTimelineEvent[];
}) {
  return (
    <ol className="grid gap-2">
      {events.map((event) => {
        const Icon = iconByStatus[event.status];

        return (
          <li
            className="grid grid-cols-[1.5rem_minmax(0,1fr)] gap-3 rounded-md bg-surface-muted p-3"
            key={event.id}
          >
            <Icon
              className={
                event.status === "complete"
                  ? "mt-1 h-5 w-5 text-success"
                  : event.status === "current"
                    ? "mt-1 h-5 w-5 text-brand"
                    : "mt-1 h-5 w-5 text-muted"
              }
              aria-hidden="true"
            />
            <div className="grid gap-1">
              <p className="text-sm font-bold text-muted-strong">
                {event.label}
              </p>
              <p className="text-sm leading-6 text-muted">{event.description}</p>
              <p className="text-xs font-bold uppercase tracking-[0.1em] text-muted">
                {event.timestampLabel}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
