import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative h-7 w-7">
        <div className="absolute inset-0 rounded-md bg-vibe-gradient blur-md opacity-70" />
        <div className="relative h-7 w-7 rounded-md bg-vibe-gradient grid place-items-center font-black text-white">
          V
        </div>
      </div>
      <span className="text-lg font-bold tracking-tight">
        Vibe<span className="text-vibe-500">Flix</span>
      </span>
    </div>
  );
}
