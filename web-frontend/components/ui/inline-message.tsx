import type { ReactNode } from "react";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

export type InlineMessageTone = "neutral" | "success" | "danger" | "warning";

const toneClasses: Record<InlineMessageTone, string> = {
  neutral: "border-border bg-surface-raised text-muted-strong",
  success: "border-success/25 bg-success-soft text-success",
  danger: "border-danger/25 bg-danger-soft text-danger",
  warning: "border-accent/40 bg-accent-soft text-[#72520d]",
};

export interface InlineMessageProps {
  children?: ReactNode;
  className?: string;
  icon?: ReactNode;
  title?: string;
  tone?: InlineMessageTone;
}

export function InlineMessage({
  children,
  className,
  icon = <Info className="h-5 w-5" />,
  title,
  tone = "neutral",
}: InlineMessageProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-[1.25rem_minmax(0,1fr)] gap-3 rounded-md border p-3 text-sm",
        toneClasses[tone],
        className,
      )}
      role={tone === "danger" ? "alert" : "status"}
    >
      <span aria-hidden="true">{icon}</span>
      <div className="grid gap-1">
        {title ? <p className="font-bold">{title}</p> : null}
        {children ? <div className="leading-6">{children}</div> : null}
      </div>
    </div>
  );
}
