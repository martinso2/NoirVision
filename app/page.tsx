export default function Home() {
  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold tracking-tight text-white mb-4">
        NoirVision
      </h1>
      <p className="text-slate-400 text-lg max-w-md text-center">
        Next.js + TypeScript + Tailwind is running. Edit{" "}
        <code className="bg-slate-800 px-2 py-1 rounded text-amber-400">
          app/page.tsx
        </code>{" "}
        to get started.
      </p>
      <a
        href="https://nextjs.org/docs"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-flex items-center gap-2 rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-600 transition-colors"
      >
        Next.js Docs →
      </a>
    </main>
  );
}
