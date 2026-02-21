export function Topbar() {
  return (
    <header className="h-14 shrink-0 border-b border-noir-600/80 bg-noir-800/70 backdrop-blur-sm flex items-center justify-between px-4">
      <h1 className="text-lg font-semibold text-white tracking-tight">
        Noir<span className="text-accent">Vision</span>
      </h1>
      <span className="rounded-full bg-accent/15 text-accent border border-accent/30 px-3 py-1 text-xs font-medium shadow-[0_0_12px_rgba(45,212,191,0.2)]">
        Local Dev
      </span>
    </header>
  );
}
