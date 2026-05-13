"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Search, Crown, LogOut, Bell } from "lucide-react";
import { LogoMark } from "./LogoMark";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/browse", label: "Parcourir" },
  { href: "/my-list", label: "Ma liste" },
  { href: "/pricing", label: "Premium" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { isAuthed, isPremium, signOut } = useStore();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-ink-950/80 backdrop-blur-xl border-b border-white/5"
          : "bg-gradient-to-b from-ink-950/80 to-transparent"
      )}
    >
      <nav className="mx-auto max-w-7xl flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-10">
          <Link href={isAuthed ? "/browse" : "/"}>
            <LogoMark />
          </Link>
          <ul className="hidden md:flex items-center gap-7 text-sm">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={cn(
                    "text-white/70 transition hover:text-white",
                    pathname === l.href && "text-white"
                  )}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-3">
          <button className="hidden sm:grid place-items-center h-9 w-9 rounded-full text-white/70 hover:bg-white/5 hover:text-white">
            <Search className="h-4 w-4" />
          </button>
          {isAuthed ? (
            <>
              {!isPremium && (
                <Link
                  href="/pricing"
                  className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-vibe-gradient px-3.5 py-1.5 text-xs font-semibold text-white shadow-[0_8px_30px_-10px_rgba(225,29,116,0.7)]"
                >
                  <Crown className="h-3.5 w-3.5" />
                  Passer Premium
                </Link>
              )}
              {isPremium && (
                <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-300">
                  <Crown className="h-3.5 w-3.5" /> Premium
                </span>
              )}
              <button className="grid place-items-center h-9 w-9 rounded-full text-white/70 hover:bg-white/5 hover:text-white">
                <Bell className="h-4 w-4" />
              </button>
              <button
                onClick={signOut}
                className="grid place-items-center h-9 w-9 rounded-full text-white/70 hover:bg-white/5 hover:text-white"
                aria-label="Déconnexion"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden sm:inline text-sm text-white/80 hover:text-white"
              >
                Se connecter
              </Link>
              <Link href="/signup" className="btn-primary !py-2 !px-4 text-xs">
                Commencer
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
