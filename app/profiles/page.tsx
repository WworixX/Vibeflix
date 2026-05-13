"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { LogoMark } from "@/components/LogoMark";
import { useStore } from "@/lib/store";
import { AtmosphereBg } from "@/components/AtmosphereBg";

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
    addProfile({ name, color: "from-cyan-300 via-mint-400 to-mint-600" });
  };

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden">
      <AtmosphereBg />
      <div className="mx-auto w-full max-w-[1280px] px-6 py-8">
        <Link href="/">
          <LogoMark />
        </Link>
      </div>

      <div className="grid flex-1 place-items-center px-6 pb-20">
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
            className="h-display text-5xl md:text-7xl"
          >
            Qui regarde{" "}
            <span className="text-mint-300/90">
              ce soir
            </span>
            ?
          </motion.h1>

          <div className="mt-16 flex flex-wrap items-start justify-center gap-8 md:gap-12">
            {profiles.map((p, i) => (
              <motion.button
                key={p.id}
                onClick={() => onPick(p.id)}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
                whileHover={{ y: -4 }}
                className="group flex flex-col items-center gap-4"
              >
                <div
                  className={`relative grid h-28 w-28 place-items-center rounded-3xl bg-gradient-to-br ${p.color} text-4xl font-display text-char-950 shadow-2xl ring-1 ring-white/10 transition-all duration-700 ease-exhale md:h-36 md:w-36 group-hover:ring-white/30 group-hover:shadow-[0_30px_80px_-20px_rgba(34,185,122,0.5)]`}
                >
                  {p.name[0]}
                </div>
                <div className="text-center">
                  <div className="text-[15px] font-medium">{p.name}</div>
                  {p.kids && <span className="text-xs text-mint-300">Kids</span>}
                </div>
              </motion.button>
            ))}

            <motion.button
              onClick={onAdd}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: profiles.length * 0.06, duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
              whileHover={{ y: -4 }}
              className="group flex flex-col items-center gap-4"
            >
              <div className="grid h-28 w-28 place-items-center rounded-3xl border border-dashed border-white/15 text-white/40 transition-all duration-700 ease-exhale group-hover:border-mint-400/40 group-hover:text-mint-300 md:h-36 md:w-36">
                <Plus className="h-9 w-9" strokeWidth={1.5} />
              </div>
              <div className="text-sm text-white/55">Ajouter</div>
            </motion.button>
          </div>
        </div>
      </div>
    </main>
  );
}
