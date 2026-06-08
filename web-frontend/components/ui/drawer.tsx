"use client";

import type { ReactNode } from "react";
import { useCallback, useEffect, useId, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { IconButton } from "./icon-button";

export interface DrawerProps {
  children: ReactNode;
  className?: string;
  closeLabel?: string;
  defaultOpen?: boolean;
  description?: ReactNode;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  side?: "bottom" | "right";
  title: string;
  trigger?: ReactNode;
}

export function Drawer({
  children,
  className,
  closeLabel = "Fechar painel",
  defaultOpen = false,
  description,
  onOpenChange,
  open,
  side = "bottom",
  title,
  trigger,
}: DrawerProps) {
  const id = useId();
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpen = open ?? internalOpen;

  const setOpen = useCallback((next: boolean) => {
    if (open === undefined) {
      setInternalOpen(next);
    }

    onOpenChange?.(next);
  }, [onOpenChange, open]);

  useEffect(() => {
    if (!isOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", onKeyDown);

    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, setOpen]);

  return (
    <>
      {trigger ? (
        <button className="contents" type="button" onClick={() => setOpen(true)}>
          {trigger}
        </button>
      ) : null}
      {isOpen ? (
        <div
          aria-modal="true"
          className={cn(
            "fixed inset-0 z-[var(--z-overlay)] bg-foreground/45",
            side === "bottom" && "grid place-items-end",
            side === "right" && "grid place-items-stretch justify-items-end",
          )}
          role="dialog"
          aria-describedby={description ? `${id}-description` : undefined}
          aria-labelledby={`${id}-title`}
        >
          <aside
            className={cn(
              "w-full overflow-auto border-border bg-surface shadow-md",
              side === "bottom" &&
                "max-h-[88vh] rounded-t-md border-t p-4 sm:max-w-xl",
              side === "right" && "h-full max-w-md border-l p-4",
              className,
            )}
          >
            <div className="mb-4 grid grid-cols-[minmax(0,1fr)_auto] gap-3">
              <div className="grid gap-1">
                <h2
                  className="font-display text-xl font-bold text-foreground"
                  id={`${id}-title`}
                >
                  {title}
                </h2>
                {description ? (
                  <p className="text-sm leading-6 text-muted" id={`${id}-description`}>
                    {description}
                  </p>
                ) : null}
              </div>
              <IconButton
                icon={<X className="h-4 w-4" />}
                label={closeLabel}
                size="sm"
                variant="ghost"
                onClick={() => setOpen(false)}
              />
            </div>
            {children}
          </aside>
        </div>
      ) : null}
    </>
  );
}
