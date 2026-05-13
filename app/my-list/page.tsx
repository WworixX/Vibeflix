"use client";

import Link from "next/link";
import { Bookmark } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MovieCard } from "@/components/MovieCard";
import { titles } from "@/lib/mock-data";
import { useStore } from "@/lib/store";

export default function MyListPage() {
  const watchlist = useStore((s) => s.watchlist);
  const items = titles.filter((t) => watchlist.includes(t.id));

  return (
    <>
      <Navbar />
      <main className="pt-32 pb-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <span className="chip">Votre sélection</span>
              <h1 className="mt-4 font-display text-4xl md:text-6xl">Ma liste</h1>
              <p className="mt-3 text-white/60">
                {items.length} {items.length > 1 ? "titres enregistrés" : "titre enregistré"}.
              </p>
            </div>
          </div>

          {items.length === 0 ? (
            <div className="mt-16 grid place-items-center rounded-3xl border border-dashed border-white/10 py-24 text-center">
              <Bookmark className="h-10 w-10 text-white/30" />
              <h3 className="mt-4 text-lg font-semibold">Votre liste est vide</h3>
              <p className="mt-2 max-w-sm text-sm text-white/55">
                Ajoutez des films et séries depuis le catalogue pour les retrouver ici.
              </p>
              <Link href="/browse" className="btn-primary mt-6">
                Parcourir le catalogue
              </Link>
            </div>
          ) : (
            <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
              {items.map((t) => (
                <MovieCard key={t.id} title={t} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
