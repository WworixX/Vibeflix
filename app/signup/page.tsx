import Link from "next/link";
import { LogoMark } from "@/components/LogoMark";
import { AuthForm } from "@/components/AuthForm";

export default function SignupPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-radial-fade" />
      <div className="absolute top-1/2 left-1/2 -z-10 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-vibe-gradient opacity-15 blur-[120px]" />

      <div className="mx-auto max-w-7xl px-6 py-8">
        <Link href="/">
          <LogoMark />
        </Link>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-16">
        <AuthForm mode="signup" />
      </div>
    </main>
  );
}
