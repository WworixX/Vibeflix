import Link from "next/link";
import { LogoMark } from "./LogoMark";
import { Twitter, Instagram, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative border-t border-white/5 mt-32 bg-ink-950">
      <div className="mx-auto max-w-7xl px-6 py-16 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <LogoMark />
          <p className="mt-4 max-w-sm text-sm text-white/60">
            Le cinéma a une nouvelle ambiance. Gratuit avec quelques pubs,
            Premium pour le silence complet.
          </p>
          <div className="mt-6 flex gap-3">
            {[Twitter, Instagram, Youtube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="grid place-items-center h-9 w-9 rounded-full border border-white/10 text-white/60 hover:text-white hover:border-white/30"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-4">Produit</h4>
          <ul className="space-y-2.5 text-sm text-white/60">
            <li><Link href="/browse">Catalogue</Link></li>
            <li><Link href="/pricing">Premium</Link></li>
            <li><Link href="/my-list">Ma liste</Link></li>
            <li><Link href="#">Compatibilité</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-4">Entreprise</h4>
          <ul className="space-y-2.5 text-sm text-white/60">
            <li><a href="#">À propos</a></li>
            <li><a href="#">Carrières</a></li>
            <li><a href="#">Presse</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/5 py-6 text-center text-xs text-white/40">
        © {new Date().getFullYear()} VibeFlix. Tous droits réservés.
      </div>
    </footer>
  );
}
