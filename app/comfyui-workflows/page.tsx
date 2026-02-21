import { StartComfyUI } from "@/components/comfyui/StartComfyUI";

export default function ComfyUIWorkflowsPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white">
        ComfyUI Workflows <span className="text-accent/80 font-normal">connect & run</span>
      </h2>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="noir-panel rounded-xl p-4 lg:col-span-1 transition-all duration-200">
          <h3 className="text-sm font-medium text-accent/90 mb-3">Workflows</h3>
          <ul className="space-y-2 text-sm text-slate-500">
            <li>(placeholder list)</li>
            <li>No workflows loaded</li>
          </ul>
        </div>
        <div className="noir-panel rounded-xl p-6 lg:col-span-2 flex flex-col items-center justify-center min-h-[280px] transition-all duration-200">
          <StartComfyUI />
        </div>
      </div>
    </div>
  );
}
