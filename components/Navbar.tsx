"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Search, Sparkles, Bell, LogOut } from "lucide-react";
import { LogoMark } from "./LogoMark";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const links = [
  { href: "/browse", label: "Catalogue" },
  { href: "/live", label: "En direct" },
  { href: "/my-list", label: "Ma liste" },
  { href: "/pricing", label: "Premium" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { isAuthed, isPremium, signOut } = useStore();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-700 ease-exhale",
        scrolled
          ? "bg-char-950/75 backdrop-blur-xl border-b border-white/[0.06]"
          : "bg-gradient-to-b from-char-950/80 via-char-950/40 to-transparent"
      )}
    >
      <nav className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-4">
        <div className="flex items-center gap-12">
          <Link href={isAuthed ? "/browse" : "/"} className="shrink-0">
            <LogoMark />
          </Link>
          <ul className="hidden items-center gap-1 md:flex">
            {links.map((l) => {
              const active = pathname === l.href;
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className={cn(
                      "relative rounded-full px-3.5 py-1.5 text-[13px] transition-colors duration-500 ease-exhale",
                      active ? "text-white" : "text-white/55 hover:text-white"
                    )}
                  >
                    {active && (
                      <span className="absolute inset-0 -z-10 rounded-full bg-white/[0.06]" />
                    )}
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="flex items-center gap-2">
          <button className="hidden h-9 w-9 place-items-center rounded-full text-white/55 transition hover:text-white sm:grid">
            <Search className="h-[18px] w-[18px]" strokeWidth={1.6} />
          </button>
          {isAuthed ? (
            <>
              {!isPremium && (
                <Link
                  href="/pricing"
                  className="hidden items-center gap-1.5 rounded-full border border-mint-400/30 bg-mint-400/10 px-3.5 py-1.5 text-[12px] font-medium text-mint-200 transition hover:bg-mint-400/15 sm:inline-flex"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Passer Premium
                </Link>
              )}
              {isPremium && (
                <span className="chip-mint hidden sm:inline-flex">
                  <Sparkles className="h-3 w-3" /> Premium
                </span>
              )}
              <button className="grid h-9 w-9 place-items-center rounded-full text-white/55 transition hover:text-white">
                <Bell className="h-[18px] w-[18px]" strokeWidth={1.6} />
              </button>
              <button
                onClick={signOut}
                className="grid h-9 w-9 place-items-center rounded-full text-white/55 transition hover:text-white"
                aria-label="Déconnexion"
              >
                <LogOut className="h-[18px] w-[18px]" strokeWidth={1.6} />
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hidden text-[13px] text-white/70 hover:text-white sm:inline">
                Se connecter
              </Link>
              <Link href="/signup" className="btn-primary !py-2 !px-4 text-xs">
                S'inscrire
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
