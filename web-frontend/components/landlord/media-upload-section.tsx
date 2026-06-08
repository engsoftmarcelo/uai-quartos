"use client";

import Image from "next/image";
import { ImagePlus } from "lucide-react";
import { Input } from "@/components/ui/input";

export function MediaUploadSection({
  imageUrl,
  onChange,
}: {
  imageUrl: string;
  onChange: (imageUrl: string) => void;
}) {
  return (
    <section className="grid gap-4">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground">
          Midia
        </h2>
        <p className="mt-1 text-sm text-muted">
          Fotos reais e claras reduzem duvida e aumentam a chance de contato.
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_16rem] md:items-start">
        <label className="grid min-h-48 cursor-pointer place-items-center rounded-md border border-dashed border-border bg-surface-muted p-4 text-center transition hover:bg-brand-soft">
          <span className="grid gap-2">
            <ImagePlus className="mx-auto h-8 w-8 text-brand" aria-hidden="true" />
            <span className="text-sm font-bold text-muted-strong">
              Upload preparado para integrar
            </span>
            <span className="text-sm text-muted">
              Nesta fase, use uma URL de imagem real como preview.
            </span>
          </span>
          <input className="sr-only" type="file" />
        </label>
        <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-surface-muted">
          <Image
            alt="Preview da midia do anuncio"
            className="object-cover"
            fill
            sizes="(min-width: 768px) 256px, 100vw"
            src={imageUrl}
          />
        </div>
      </div>
      <Input
        label="URL da imagem principal"
        onChange={(event) => onChange(event.target.value)}
        value={imageUrl}
      />
    </section>
  );
}
