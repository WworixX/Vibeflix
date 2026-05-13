import Link from "next/link";
import { LogoMark } from "@/components/LogoMark";
import { AuthForm } from "@/components/AuthForm";
import { AtmosphereBg } from "@/components/AtmosphereBg";

export default function SignupPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <AtmosphereBg />
      <div className="mx-auto max-w-[1280px] px-6 py-8">
        <Link href="/">
          <LogoMark />
        </Link>
      </div>
      <div className="mx-auto max-w-[1280px] px-6 py-16">
        <AuthForm mode="signup" />
      </div>
    </main>
  );
}
