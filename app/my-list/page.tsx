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
      <main className="pt-36 pb-32">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="chip">Votre sélection</span>
              <h1 className="h-display mt-4 text-5xl md:text-7xl">
                Ma{" "}
                <span className="text-mint-300/90">
                  liste.
                </span>
              </h1>
              <p className="mt-3 text-white/55">
                {items.length} {items.length > 1 ? "titres enregistrés" : "titre enregistré"}.
              </p>
            </div>
          </div>

          {items.length === 0 ? (
            <div className="mt-16 grid place-items-center rounded-3xl border border-dashed border-white/[0.08] py-28 text-center">
              <Bookmark className="h-10 w-10 text-white/25" strokeWidth={1.4} />
              <h3 className="mt-5 text-lg font-medium">Votre liste est vide</h3>
              <p className="mt-2 max-w-sm text-sm text-white/55">
                Ajoutez des films, séries et lives depuis le catalogue pour les retrouver ici.
              </p>
              <Link href="/browse" className="btn-primary mt-7">
                Parcourir le catalogue
              </Link>
            </div>
          ) : (
            <div className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
              {items.map((t) => (
                <MovieCard key={t.id} title={t} size="sm" />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
