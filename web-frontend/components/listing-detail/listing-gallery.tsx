"use client";

import Image from "next/image";
import { useState } from "react";
import { PlayCircle, Rotate3D } from "lucide-react";
import type { ListingMediaItem } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ListingGallery({ media }: { media: ListingMediaItem[] }) {
  const [selectedId, setSelectedId] = useState(media[0]?.id);
  const selected = media.find((item) => item.id === selectedId) ?? media[0];

  if (!selected) return null;

  return (
    <section className="grid gap-3" aria-label="Galeria do anúncio">
      <div className="relative aspect-[4/3] overflow-hidden rounded-md border border-border bg-surface-muted shadow-xs lg:aspect-[16/10]">
        {selected.type === "video" ? (
          <video
            className="h-full w-full object-cover"
            controls
            poster={selected.posterUrl}
            src={selected.src}
          />
        ) : (
          <>
            <Image
              alt={selected.alt}
              className="object-cover"
              fill
              priority={selected.id === media[0]?.id}
              sizes="(min-width: 1024px) 58vw, 100vw"
              src={selected.posterUrl ?? selected.src}
            />
            {selected.type === "tour" ? (
              <a
                className="absolute inset-0 grid place-items-center bg-foreground/35 text-white"
                href={selected.src}
              >
                <span className="inline-flex items-center gap-2 rounded-md bg-foreground/80 px-4 py-3 text-sm font-bold">
                  <Rotate3D className="h-5 w-5" aria-hidden="true" />
                  Abrir tour virtual
                </span>
              </a>
            ) : null}
          </>
        )}
      </div>

      <div className="grid grid-cols-4 gap-2">
        {media.slice(0, 4).map((item, index) => (
          <button
            aria-label={`Ver mídia ${index + 1}: ${item.alt}`}
            className={cn(
              "relative aspect-[4/3] overflow-hidden rounded-md border bg-surface-muted transition",
              selected.id === item.id
                ? "border-brand ring-2 ring-brand/20"
                : "border-border hover:border-brand",
            )}
            key={item.id}
            type="button"
            onClick={() => setSelectedId(item.id)}
          >
            <Image
              alt=""
              className="object-cover"
              fill
              loading="lazy"
              sizes="25vw"
              src={item.posterUrl ?? item.src}
            />
            {item.type !== "image" ? (
              <span className="absolute inset-0 grid place-items-center bg-foreground/30 text-white">
                {item.type === "video" ? (
                  <PlayCircle className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Rotate3D className="h-5 w-5" aria-hidden="true" />
                )}
              </span>
            ) : null}
          </button>
        ))}
      </div>
    </section>
  );
}
