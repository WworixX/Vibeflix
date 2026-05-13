"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Play, Plus, Check } from "lucide-react";
import type { Title } from "@/lib/mock-data";
import { useStore } from "@/lib/store";

export function MovieCard({ title, large }: { title: Title; large?: boolean }) {
  const { watchlist, toggleWatch } = useStore();
  const inList = watchlist.includes(title.id);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`group relative shrink-0 overflow-hidden rounded-xl border border-white/5 bg-ink-800 ${
        large ? "w-[260px]" : "w-[200px]"
      }`}
    >
      <Link href={`/watch/${title.id}`} className="block">
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={title.poster}
            alt={title.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/30 to-transparent opacity-80" />
          <div className="absolute inset-x-0 bottom-0 p-3">
            <div className="flex items-center gap-1.5 text-[10px] text-white/60">
              <span>{title.year}</span>
              <span>•</span>
              <span>{title.rating}</span>
              <span>•</span>
              <span>{title.genres[0]}</span>
            </div>
            <div className="mt-1 truncate text-sm font-semibold">
              {title.title}
            </div>
          </div>
        </div>
      </Link>

      <div className="absolute right-2 top-2 flex flex-col gap-2 opacity-0 transition group-hover:opacity-100">
        <Link
          href={`/watch/${title.id}`}
          className="grid h-9 w-9 place-items-center rounded-full bg-white text-ink-950 shadow-lg"
        >
          <Play className="h-4 w-4 fill-current" />
        </Link>
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWatch(title.id);
          }}
          className="grid h-9 w-9 place-items-center rounded-full bg-ink-900/80 backdrop-blur text-white border border-white/10"
          aria-label="Toggle watchlist"
        >
          {inList ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </button>
      </div>
    </motion.div>
  );
}
