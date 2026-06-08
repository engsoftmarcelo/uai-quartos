"use client";

import type { ReactNode } from "react";
import { useId, useState } from "react";
import { cn } from "@/lib/utils";

export interface TabItem {
  content: ReactNode;
  disabled?: boolean;
  label: string;
  value: string;
}

export interface TabsProps {
  defaultValue?: string;
  items: TabItem[];
  label: string;
}

export function Tabs({ defaultValue, items, label }: TabsProps) {
  const id = useId();
  const firstEnabled = items.find((item) => !item.disabled)?.value ?? "";
  const [activeValue, setActiveValue] = useState(defaultValue ?? firstEnabled);
  const activeItem = items.find((item) => item.value === activeValue) ?? items[0];

  return (
    <div className="grid gap-4">
      <div
        aria-label={label}
        className="flex gap-1 overflow-x-auto rounded-md bg-surface-muted p-1"
        role="tablist"
      >
        {items.map((item) => {
          const tabId = `${id}-${item.value}-tab`;
          const panelId = `${id}-${item.value}-panel`;
          const isSelected = activeItem?.value === item.value;

          return (
            <button
              aria-controls={panelId}
              aria-selected={isSelected}
              className={cn(
                "h-10 shrink-0 rounded-md px-3 text-sm font-bold text-muted transition hover:bg-surface",
                isSelected && "bg-surface text-foreground shadow-xs",
                item.disabled && "opacity-50",
              )}
              disabled={item.disabled}
              id={tabId}
              key={item.value}
              role="tab"
              type="button"
              onClick={() => setActiveValue(item.value)}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      {activeItem ? (
        <div
          aria-labelledby={`${id}-${activeItem.value}-tab`}
          id={`${id}-${activeItem.value}-panel`}
          role="tabpanel"
          tabIndex={0}
        >
          {activeItem.content}
        </div>
      ) : null}
    </div>
  );
}
