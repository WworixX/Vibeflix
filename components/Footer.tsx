import Link from "next/link";
import { LogoMark } from "./LogoMark";

export function Footer() {
  return (
    <footer className="relative mt-40 border-t border-white/5">
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-mint-400/40 to-transparent" />
      <div className="mx-auto grid max-w-[1280px] gap-14 px-6 py-20 md:grid-cols-12">
        <div className="md:col-span-5">
          <LogoMark />
          <p className="mt-5 max-w-sm text-pretty text-sm text-white/55 leading-relaxed">
            Une nouvelle façon de regarder. Gratuit avec quelques pubs, ou Premium
            à 1€/mois pour le silence complet.
          </p>
          <p className="mt-8 text-xs text-white/35">
            Pensé et dessiné en France.
          </p>
        </div>

        <div className="md:col-span-7 grid grid-cols-2 gap-8 sm:grid-cols-3">
          <Col title="Plateforme" links={[
            ["Catalogue", "/browse"],
            ["En direct", "/live"],
            ["Ma liste", "/my-list"],
            ["Premium", "/pricing"],
          ]} />
          <Col title="Compte" links={[
            ["Se connecter", "/login"],
            ["S'inscrire", "/signup"],
            ["Profils", "/profiles"],
          ]} />
          <Col title="Studio" links={[
            ["À propos", "#"],
            ["Carrières", "#"],
            ["Presse", "#"],
            ["Contact", "#"],
          ]} />
        </div>
      </div>
      <div className="border-t border-white/5">
        <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-between gap-3 px-6 py-6 text-[11px] text-white/35 sm:flex-row">
          <span>© {new Date().getFullYear()} VibeFlix — Tous droits réservés.</span>
          <div className="flex items-center gap-5">
            <a href="#">Confidentialité</a>
            <a href="#">CGU</a>
            <a href="#">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function Col({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h4 className="text-[11px] uppercase tracking-[0.18em] text-white/40">
        {title}
      </h4>
      <ul className="mt-4 space-y-2.5 text-sm">
        {links.map(([label, href]) => (
          <li key={label}>
            <Link href={href} className="text-white/75 transition hover:text-white">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
