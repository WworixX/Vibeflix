"use client";

import { MovieRow } from "@/components/MovieRow";
import { rows, titles, liveNow } from "@/lib/mock-data";
import Link from "next/link";
import { Radio } from "lucide-react";

export function CatalogPreview() {
  const visibleRows = rows.filter((r) => r.name !== "Continuer à regarder").slice(0, 4);

  return (
    <section className="relative pt-12 pb-8">
      {liveNow.length > 0 && (
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="flex items-center gap-3">
            <span className="relative grid h-2 w-2 place-items-center">
              <span className="absolute h-2 w-2 animate-ping rounded-full bg-rose-400/70" />
              <span className="relative h-2 w-2 rounded-full bg-rose-400" />
            </span>
            <h2 className="text-[20px] font-medium tracking-tight md:text-2xl">
              En direct maintenant
            </h2>
            <Link
              href="/live"
              className="ml-auto inline-flex items-center gap-1.5 text-sm text-white/55 hover:text-white"
            >
              <Radio className="h-3.5 w-3.5" /> Voir tout
            </Link>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {liveNow.map((t) => (
              <Link
                key={t.id}
                href={`/watch/${t.id}`}
                className="group relative aspect-[16/8] overflow-hidden rounded-2xl border border-white/[0.06]"
              >
                <img
                  src={t.backdrop}
                  alt={t.title}
                  className="h-full w-full object-cover transition-transform duration-1000 ease-exhale group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-char-950 via-char-950/20 to-transparent" />
                <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-rose-500/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
                  <span className="relative h-1.5 w-1.5 rounded-full bg-white" />
                  Live
                </div>
                <div className="absolute inset-x-5 bottom-5">
                  <div className="text-[11px] uppercase tracking-[0.16em] text-white/55">
                    {t.genres.join(" · ")}
                  </div>
                  <div className="mt-1 text-lg font-medium">{t.title}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {visibleRows.map((r) => (
        <MovieRow key={r.name} name={r.name} items={titles.filter(r.filter)} />
      ))}
    </section>
  );
}
