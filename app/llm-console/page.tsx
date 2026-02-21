export default function LLMConsolePage() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white">
        LLM Console <span className="text-accent/80 font-normal">prompt & response</span>
      </h2>
      <div className="grid gap-4 lg:grid-cols-2 min-h-[400px]">
        <div className="noir-panel rounded-xl p-4 flex flex-col transition-all duration-200">
          <h3 className="text-sm font-medium text-accent/90 mb-2">Prompt</h3>
          <textarea
            placeholder="Enter your prompt..."
            className="flex-1 min-h-[200px] w-full rounded-lg border border-noir-500 bg-noir-900/80 px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/30"
            readOnly
            aria-label="Prompt input"
          />
        </div>
        <div className="noir-panel rounded-xl p-4 flex flex-col transition-all duration-200">
          <h3 className="text-sm font-medium text-accent/90 mb-2">Response</h3>
          <div className="flex-1 min-h-[200px] rounded-lg border border-dashed border-accent/20 bg-noir-900/50 flex items-center justify-center text-slate-500 text-sm">
            Response (no API wired yet)
          </div>
        </div>
      </div>
    </div>
  );
}
