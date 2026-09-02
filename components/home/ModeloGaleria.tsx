"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Galería de imágenes del modelo. La primera imagen del array es la
 * principal; el resto se muestra como miniaturas seleccionables.
 */
export function ModeloGaleria({
  imagenes,
  alt,
}: {
  imagenes: string[];
  alt: string;
}) {
  const [activa, setActiva] = useState(0);

  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden bg-[color:var(--color-surface)]">
        <Image
          key={imagenes[activa]}
          src={imagenes[activa]}
          alt={`${alt} — imagen ${activa + 1}`}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover transition-opacity duration-[--dur-base]"
        />
      </div>

      {imagenes.length > 1 && (
        <div
          className="mt-3 grid gap-2"
          style={{ gridTemplateColumns: `repeat(${Math.min(imagenes.length, 5)}, 1fr)` }}
          role="group"
          aria-label={`Galería de ${alt}`}
        >
          {imagenes.map((img, i) => (
            <button
              key={img}
              type="button"
              onClick={() => setActiva(i)}
              aria-pressed={activa === i}
              aria-label={`Ver imagen ${i + 1}`}
              className={cn(
                "relative aspect-[4/3] overflow-hidden border bg-[color:var(--color-surface)] transition-colors duration-[--dur-base]",
                activa === i
                  ? "border-[color:var(--color-ink)]"
                  : "border-[color:var(--color-border)] hover:border-[color:var(--color-border-strong)]",
              )}
            >
              <Image
                src={img}
                alt=""
                fill
                sizes="(min-width: 768px) 10vw, 20vw"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
