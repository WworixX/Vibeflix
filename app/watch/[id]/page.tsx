"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { Plus, Check, Share2, ThumbsUp } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { VideoPlayer } from "@/components/VideoPlayer";
import { MovieRow } from "@/components/MovieRow";
import { getTitle, titles } from "@/lib/mock-data";
import { useStore } from "@/lib/store";
import { formatRuntime } from "@/lib/utils";

export default function WatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const title = getTitle(id);
  const { watchlist, toggleWatch } = useStore();

  if (!title) notFound();

  const inList = watchlist.includes(title.id);
  const similar = titles.filter(
    (t) => t.id !== title.id && t.genres.some((g) => title.genres.includes(g))
  );

  return (
    <>
      <Navbar />
      <main className="pt-28 pb-32">
        <div className="mx-auto max-w-[1280px] px-6">
          <VideoPlayer title={title} />

          <div className="mt-12 grid gap-12 md:grid-cols-3">
            <div className="md:col-span-2">
              <span className="chip">
                {title.kind === "serie" ? "Série" : title.kind === "live" ? "Live" : "Film"}
              </span>
              <h1 className="h-display mt-4 text-4xl md:text-6xl">{title.title}</h1>
              <div className="mt-4 flex flex-wrap items-center gap-2 text-[12px] uppercase tracking-[0.16em] text-white/55">
                <span>{title.year}</span>
                <span>·</span>
                <span>{title.rating}</span>
                <span>·</span>
                <span>{formatRuntime(title.runtime)}</span>
                <span>·</span>
                <span>{title.genres.join(" · ")}</span>
              </div>
              <p className="mt-7 max-w-2xl text-pretty text-[16px] leading-relaxed text-white/80">
                {title.synopsis}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <button onClick={() => toggleWatch(title.id)} className="btn-ghost">
                  {inList ? (
                    <>
                      <Check className="h-4 w-4" /> Dans ma liste
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" /> Ajouter
                    </>
                  )}
                </button>
                <button className="btn-ghost">
                  <ThumbsUp className="h-4 w-4" /> J'aime
                </button>
                <button className="btn-ghost">
                  <Share2 className="h-4 w-4" /> Partager
                </button>
              </div>
            </div>

            <aside className="glass self-start rounded-3xl p-6">
              <div className="text-[11px] uppercase tracking-[0.18em] text-white/40">Ambiance</div>
              <div className="mt-2 inline-flex rounded-full bg-mint-gradient px-3 py-1 text-xs font-medium text-char-950">
                {title.mood}
              </div>
              <dl className="mt-7 space-y-3 text-sm">
                <Row label="Année" value={String(title.year)} />
                <Row label="Durée" value={formatRuntime(title.runtime)} />
                <Row label="Classification" value={title.rating} />
                <Row label="Genres" value={title.genres.join(", ")} />
              </dl>
            </aside>
          </div>

          {similar.length > 0 && <MovieRow name="Dans la même veine" items={similar} />}
        </div>
      </main>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-white/45">{label}</dt>
      <dd className="text-right text-white/85">{value}</dd>
    </div>
  );
}
