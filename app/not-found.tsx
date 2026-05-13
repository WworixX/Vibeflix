import Link from "next/link";
import { LogoMark } from "@/components/LogoMark";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-6">
      <div className="text-center">
        <LogoMark className="mx-auto justify-center" />
        <h1 className="mt-8 font-display text-6xl md:text-8xl">404</h1>
        <p className="mt-4 max-w-md text-white/60">
          Cette ambiance n'existe pas. Le film que vous cherchez a peut-être quitté le catalogue.
        </p>
        <Link href="/" className="btn-primary mt-8 inline-flex">
          Retour à l'accueil
        </Link>
      </div>
    </main>
  );
}
