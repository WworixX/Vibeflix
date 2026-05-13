"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { useStore } from "@/lib/store";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const signIn = useStore((s) => s.signIn);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.includes("@") || password.length < 4) {
      setError("Email invalide ou mot de passe trop court.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    signIn(email);
    router.push("/profiles");
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
      onSubmit={submit}
      className="glass mx-auto w-full max-w-md rounded-[28px] p-9"
    >
      <h1 className="h-display text-4xl">
        {mode === "login" ? (
          <>
            Bon{" "}
            <span className="text-mint-300/90">
              retour.
            </span>
          </>
        ) : (
          <>
            Bienvenue sur{" "}
            <span className="text-mint-300/90">
              VibeFlix.
            </span>
          </>
        )}
      </h1>
      <p className="mt-3 text-sm text-white/55">
        {mode === "login"
          ? "Reprenez où vous en étiez."
          : "Créez votre compte. Aucune carte requise."}
      </p>

      <div className="mt-8 space-y-3">
        <label className="block">
          <span className="text-[11px] uppercase tracking-[0.18em] text-white/40">Email</span>
          <div className="mt-2 input-row">
            <Mail className="h-4 w-4 text-white/40" strokeWidth={1.6} />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@email.com"
              className="w-full bg-transparent text-sm outline-none placeholder:text-white/25"
            />
          </div>
        </label>
        <label className="block">
          <span className="text-[11px] uppercase tracking-[0.18em] text-white/40">Mot de passe</span>
          <div className="mt-2 input-row">
            <Lock className="h-4 w-4 text-white/40" strokeWidth={1.6} />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-transparent text-sm outline-none placeholder:text-white/25"
            />
          </div>
        </label>
      </div>

      {error && <p className="mt-4 text-sm text-rose-300">{error}</p>}

      <button type="submit" disabled={loading} className="btn-primary mt-8 w-full disabled:opacity-60">
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            {mode === "login" ? "Se connecter" : "Créer mon compte"}
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>

      <p className="mt-7 text-center text-sm text-white/55">
        {mode === "login" ? (
          <>
            Pas encore inscrit ?{" "}
            <Link href="/signup" className="text-mint-300 hover:underline">
              Créer un compte
            </Link>
          </>
        ) : (
          <>
            Déjà membre ?{" "}
            <Link href="/login" className="text-mint-300 hover:underline">
              Se connecter
            </Link>
          </>
        )}
      </p>
    </motion.form>
  );
}
