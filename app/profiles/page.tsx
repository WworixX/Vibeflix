"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { LogoMark } from "@/components/LogoMark";
import { useStore } from "@/lib/store";

export default function ProfilesPage() {
  const router = useRouter();
  const { profiles, selectProfile, addProfile } = useStore();

  const onPick = (id: string) => {
    selectProfile(id);
    router.push("/browse");
  };

  const onAdd = () => {
    const name = prompt("Nom du nouveau profil ?");
    if (!name) return;
    addProfile({ name, color: "from-cyan-400 to-vibe-500" });
  };

  return (
    <main className="min-h-screen flex flex-col">
      <div className="mx-auto w-full max-w-7xl px-6 py-8">
        <Link href="/">
          <LogoMark />
        </Link>
      </div>

      <div className="flex-1 grid place-items-center px-6 pb-16">
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-5xl md:text-6xl"
          >
            Qui regarde ?
          </motion.h1>

          <div className="mt-14 flex flex-wrap items-start justify-center gap-6 md:gap-10">
            {profiles.map((p, i) => (
              <motion.button
                key={p.id}
                onClick={() => onPick(p.id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.05 }}
                className="group flex flex-col items-center gap-3"
              >
                <div
                  className={`grid h-28 w-28 md:h-36 md:w-36 place-items-center rounded-2xl bg-gradient-to-br ${p.color} text-4xl font-bold text-white shadow-2xl ring-1 ring-white/10 transition group-hover:ring-white/40`}
                >
                  {p.name[0]}
                </div>
                <div>
                  <div className="text-base font-medium">{p.name}</div>
                  {p.kids && (
                    <span className="mt-1 text-xs text-emerald-400">Kids</span>
                  )}
                </div>
              </motion.button>
            ))}

            <motion.button
              onClick={onAdd}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: profiles.length * 0.05 }}
              whileHover={{ scale: 1.05 }}
              className="group flex flex-col items-center gap-3"
            >
              <div className="grid h-28 w-28 md:h-36 md:w-36 place-items-center rounded-2xl border-2 border-dashed border-white/15 text-white/40 transition group-hover:border-white/40 group-hover:text-white">
                <Plus className="h-10 w-10" />
              </div>
              <div className="text-sm text-white/60">Ajouter</div>
            </motion.button>
          </div>
        </div>
      </div>
    </main>
  );
}
