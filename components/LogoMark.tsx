import { cn } from "@/lib/utils";

export function LogoMark({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <span className="relative inline-flex h-7 w-7 items-center justify-center">
        <span className="absolute inset-0 rounded-[10px] bg-mint-gradient blur-md opacity-60" />
        <span className="relative inline-flex h-7 w-7 items-center justify-center rounded-[10px] bg-mint-gradient">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-char-950" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </span>
      {!compact && (
        <span
          className="font-display text-[20px] font-semibold tracking-[-0.04em] text-white"
          style={{ fontVariationSettings: "'wdth' 92" }}
        >
          vibeflix<span className="text-mint-400">.</span>
        </span>
      )}
    </div>
  );
}
