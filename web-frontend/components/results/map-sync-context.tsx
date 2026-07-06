"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface MapSyncValue {
  hoveredId: string | null;
  setHoveredId: (id: string | null) => void;
}

const MapSyncContext = createContext<MapSyncValue | null>(null);

/** Compartilha o anúncio sob hover entre a lista de cards e o mapa. */
export function MapSyncProvider({ children }: { children: ReactNode }) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const value = useMemo(() => ({ hoveredId, setHoveredId }), [hoveredId]);

  return (
    <MapSyncContext.Provider value={value}>{children}</MapSyncContext.Provider>
  );
}

/** Null-safe: componentes funcionam mesmo fora do provider. */
export function useMapSync(): MapSyncValue {
  return (
    useContext(MapSyncContext) ?? { hoveredId: null, setHoveredId: () => {} }
  );
}

/** Envolve um card server-rendered e reporta hover/foco para o mapa. */
export function HoverSyncArea({
  children,
  listingId,
}: {
  children: ReactNode;
  listingId: string;
}) {
  const { setHoveredId } = useMapSync();

  return (
    <div
      onBlur={() => setHoveredId(null)}
      onFocus={() => setHoveredId(listingId)}
      onMouseEnter={() => setHoveredId(listingId)}
      onMouseLeave={() => setHoveredId(null)}
    >
      {children}
    </div>
  );
}
