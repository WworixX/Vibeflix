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
      <main className="pt-24 pb-24">
        <div className="mx-auto max-w-7xl px-6">
          <VideoPlayer title={title} />

          <div className="mt-10 grid gap-10 md:grid-cols-3">
            <div className="md:col-span-2">
              <h1 className="font-display text-4xl md:text-5xl">{title.title}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-white/65">
                <span>{title.year}</span>
                <span>•</span>
                <span>{title.rating}</span>
                <span>•</span>
                <span>{formatRuntime(title.runtime)}</span>
                <span>•</span>
                <span>{title.genres.join(", ")}</span>
              </div>
              <p className="mt-6 max-w-2xl text-white/80 leading-relaxed">
                {title.synopsis}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => toggleWatch(title.id)}
                  className="btn-ghost"
                >
                  {inList ? (
                    <>
                      <Check className="h-4 w-4" /> Dans ma liste
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" /> Ajouter à ma liste
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

            <aside className="glass rounded-2xl p-6 self-start">
              <h3 className="text-sm font-semibold text-white/80">Ambiance</h3>
              <div className="mt-2 inline-flex rounded-full bg-vibe-gradient px-3 py-1 text-xs font-semibold">
                {title.mood}
              </div>
              <dl className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-white/50">Année</dt>
                  <dd>{title.year}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-white/50">Durée</dt>
                  <dd>{formatRuntime(title.runtime)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-white/50">Classification</dt>
                  <dd>{title.rating}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-white/50">Genres</dt>
                  <dd className="text-right">{title.genres.join(", ")}</dd>
                </div>
              </dl>
            </aside>
          </div>

          {similar.length > 0 && (
            <MovieRow name="Dans la même veine" items={similar} />
          )}
        </div>
      </main>
    </>
  );
}
