"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Play, Plus, Check } from "lucide-react";
import type { Title } from "@/lib/mock-data";
import { useStore } from "@/lib/store";

export function MovieCard({ title, size = "md" }: { title: Title; size?: "sm" | "md" | "lg" }) {
  const { watchlist, toggleWatch } = useStore();
  const inList = watchlist.includes(title.id);
  const w = size === "lg" ? "w-[260px]" : size === "sm" ? "w-[170px]" : "w-[210px]";

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
      className={`group relative shrink-0 ${w}`}
    >
      <Link
        href={`/watch/${title.id}`}
        className="block overflow-hidden rounded-2xl border border-white/[0.06] bg-char-850"
      >
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={title.poster}
            alt={title.title}
            className="h-full w-full object-cover transition-transform duration-1000 ease-exhale group-hover:scale-[1.06]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-char-950 via-char-950/10 to-transparent opacity-90" />
          {title.continueAt !== undefined && (
            <div className="absolute inset-x-0 bottom-0 h-1 bg-white/10">
              <div className="h-full bg-mint-400" style={{ width: `${title.continueAt}%` }} />
            </div>
          )}
          <div className="absolute inset-x-3.5 bottom-3.5">
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.16em] text-white/55">
              <span>{title.year}</span>
              <span>·</span>
              <span>{title.kind === "serie" ? "Série" : title.kind === "live" ? "Live" : "Film"}</span>
            </div>
            <div className="mt-1 truncate text-[14px] font-medium">{title.title}</div>
          </div>
        </div>
      </Link>

      <div className="absolute right-2.5 top-2.5 flex flex-col gap-2 opacity-0 transition-all duration-500 ease-exhale group-hover:opacity-100">
        <Link
          href={`/watch/${title.id}`}
          className="grid h-9 w-9 place-items-center rounded-full bg-mint-gradient text-char-950 shadow-[0_10px_30px_-10px_rgba(34,185,122,0.7)]"
          aria-label="Lecture"
        >
          <Play className="h-3.5 w-3.5 fill-current" />
        </Link>
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWatch(title.id);
          }}
          className="grid h-9 w-9 place-items-center rounded-full bg-char-900/80 backdrop-blur border border-white/10 text-white"
          aria-label="Ajouter à ma liste"
        >
          {inList ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
        </button>
      </div>
    </motion.div>
  );
}
