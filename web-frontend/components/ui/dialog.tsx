"use client";

import type { ReactNode } from "react";
import { useCallback, useEffect, useId, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { IconButton } from "./icon-button";

export interface DialogProps {
  children: ReactNode;
  className?: string;
  closeLabel?: string;
  defaultOpen?: boolean;
  description?: ReactNode;
  footer?: ReactNode;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  title: string;
  trigger?: ReactNode;
}

export function Dialog({
  children,
  className,
  closeLabel = "Fechar modal",
  defaultOpen = false,
  description,
  footer,
  onOpenChange,
  open,
  title,
  trigger,
}: DialogProps) {
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

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
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
          className="fixed inset-0 z-[var(--z-modal)] grid place-items-end bg-foreground/45 p-0 sm:place-items-center sm:p-4"
          role="dialog"
          aria-describedby={description ? `${id}-description` : undefined}
          aria-labelledby={`${id}-title`}
        >
          <div
            className={cn(
              "max-h-[92vh] w-full overflow-auto rounded-t-md border border-border bg-surface shadow-md sm:max-w-lg sm:rounded-md",
              className,
            )}
          >
            <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 border-b border-border p-4">
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
            <div className="p-4">{children}</div>
            {footer ? (
              <div className="border-t border-border p-4">{footer}</div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
