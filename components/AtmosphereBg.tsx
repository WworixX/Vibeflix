export function AtmosphereBg() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-mesh opacity-90 animate-drift" />
      <div className="absolute left-1/2 top-[-10%] h-[520px] w-[920px] -translate-x-1/2 rounded-full bg-mint-500/20 blur-[120px] animate-breathe" />
      <div className="absolute bottom-[-15%] right-[-10%] h-[400px] w-[600px] rounded-full bg-mint-700/20 blur-[120px]" />
    </div>
  );
}
