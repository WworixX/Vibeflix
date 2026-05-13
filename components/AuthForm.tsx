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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onSubmit={submit}
      className="glass mx-auto w-full max-w-md rounded-3xl p-8"
    >
      <h1 className="font-display text-3xl">
        {mode === "login" ? "Bon retour." : "Bienvenue sur VibeFlix."}
      </h1>
      <p className="mt-2 text-sm text-white/60">
        {mode === "login"
          ? "Connectez-vous pour reprendre où vous en étiez."
          : "Créez votre compte. Aucune carte requise."}
      </p>

      <div className="mt-8 space-y-4">
        <label className="block">
          <span className="text-xs text-white/60">Email</span>
          <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 focus-within:border-vibe-500/50">
            <Mail className="h-4 w-4 text-white/40" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@email.com"
              className="w-full bg-transparent text-sm outline-none placeholder:text-white/30"
            />
          </div>
        </label>
        <label className="block">
          <span className="text-xs text-white/60">Mot de passe</span>
          <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 focus-within:border-vibe-500/50">
            <Lock className="h-4 w-4 text-white/40" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-transparent text-sm outline-none placeholder:text-white/30"
            />
          </div>
        </label>
      </div>

      {error && (
        <p className="mt-4 text-sm text-rose-400">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="btn-primary mt-8 w-full disabled:opacity-60"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            {mode === "login" ? "Se connecter" : "Créer mon compte"}
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>

      <p className="mt-6 text-center text-sm text-white/60">
        {mode === "login" ? (
          <>
            Pas encore de compte ?{" "}
            <Link href="/signup" className="text-vibe-400 hover:underline">
              Inscription gratuite
            </Link>
          </>
        ) : (
          <>
            Déjà inscrit ?{" "}
            <Link href="/login" className="text-vibe-400 hover:underline">
              Se connecter
            </Link>
          </>
        )}
      </p>
    </motion.form>
  );
}
