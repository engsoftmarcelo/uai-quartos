"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { List, Map } from "lucide-react";
import type { ResultsViewMode } from "@/lib/types";
import { cn } from "@/lib/utils";

export function MobileMapToggle({ value }: { value: ResultsViewMode }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  function setView(nextView: ResultsViewMode) {
    const params = new URLSearchParams(searchParams.toString());

    if (nextView === "list") {
      params.delete("view");
    } else {
      params.set("view", nextView);
    }

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="grid grid-cols-2 rounded-md bg-surface-muted p-1 lg:hidden">
      <ToggleButton
        active={value === "list"}
        icon={<List className="h-4 w-4" aria-hidden="true" />}
        label="Lista"
        onClick={() => setView("list")}
      />
      <ToggleButton
        active={value === "map"}
        icon={<Map className="h-4 w-4" aria-hidden="true" />}
        label="Mapa"
        onClick={() => setView("map")}
      />
    </div>
  );
}

function ToggleButton({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-md text-sm font-bold text-muted transition",
        active && "bg-surface text-foreground shadow-xs",
      )}
      type="button"
      onClick={onClick}
    >
      {icon}
      {label}
    </button>
  );
}
