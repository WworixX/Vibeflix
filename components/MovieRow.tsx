"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Title } from "@/lib/mock-data";
import { MovieCard } from "./MovieCard";

export function MovieRow({ name, items }: { name: string; items: Title[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) =>
    ref.current?.scrollBy({ left: dir * 640, behavior: "smooth" });

  if (items.length === 0) return null;

  return (
    <section className="mt-14">
      <div className="mx-auto flex max-w-[1280px] items-end justify-between px-6">
        <h2 className="text-[20px] font-medium tracking-tight md:text-2xl">{name}</h2>
        <div className="hidden gap-2 md:flex">
          <button
            onClick={() => scroll(-1)}
            className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-white/70 transition hover:bg-white/[0.08] hover:text-white"
            aria-label="Précédent"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => scroll(1)}
            className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-white/70 transition hover:bg-white/[0.08] hover:text-white"
            aria-label="Suivant"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        ref={ref}
        className="mx-auto mt-5 flex max-w-[1280px] gap-3 overflow-x-auto px-6 pb-2 scrollbar-hide mask-fade-r"
      >
        {items.map((t) => (
          <MovieCard key={t.id} title={t} />
        ))}
      </div>
    </section>
  );
}
