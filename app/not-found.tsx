import Link from "next/link";
import { LogoMark } from "@/components/LogoMark";
import { AtmosphereBg } from "@/components/AtmosphereBg";

export default function NotFound() {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden px-6">
      <AtmosphereBg />
      <div className="text-center">
        <LogoMark className="mx-auto justify-center" />
        <h1 className="h-display mt-10 text-7xl md:text-9xl">
          4
          <span className="italic text-mint-300/90" style={{ fontVariationSettings: "'SOFT' 80" }}>
            0
          </span>
          4
        </h1>
        <p className="mx-auto mt-5 max-w-md text-white/55">
          Cette ambiance n'existe pas. Le titre que vous cherchez a peut-être quitté le catalogue.
        </p>
        <Link href="/" className="btn-primary mt-9 inline-flex">
          Retour à l'accueil
        </Link>
      </div>
    </main>
  );
}
