"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Title } from "@/lib/mock-data";
import { MovieCard } from "./MovieCard";

export function MovieRow({ name, items }: { name: string; items: Title[] }) {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    ref.current?.scrollBy({ left: dir * 600, behavior: "smooth" });
  };

  if (items.length === 0) return null;

  return (
    <section className="mt-10">
      <div className="mx-auto max-w-7xl px-6 flex items-end justify-between">
        <h2 className="text-xl md:text-2xl font-semibold">{name}</h2>
        <div className="hidden md:flex gap-2">
          <button
            onClick={() => scroll(-1)}
            className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5 hover:bg-white/10"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => scroll(1)}
            className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5 hover:bg-white/10"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        ref={ref}
        className="mt-4 flex gap-4 overflow-x-auto scrollbar-hide mask-fade-r px-6 mx-auto max-w-7xl"
      >
        {items.map((t) => (
          <MovieCard key={t.id} title={t} />
        ))}
      </div>
    </section>
  );
}
