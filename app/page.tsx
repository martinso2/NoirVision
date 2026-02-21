import { NOIRVISION_MODELS_DIR, NOIRVISION_COMFYUI_DIR } from "@/lib/paths";
import { StartComfyUI } from "@/components/comfyui/StartComfyUI";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white">
        Dashboard <span className="text-accent/80 font-normal">overview</span>
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="noir-panel rounded-xl p-4 transition-all duration-200">
          <h3 className="text-sm font-medium text-accent/90">Models directory</h3>
          <p className="mt-2 font-mono text-sm text-slate-300 break-all">
            {NOIRVISION_MODELS_DIR}
          </p>
        </div>
        <div className="noir-panel rounded-xl p-4 transition-all duration-200">
          <h3 className="text-sm font-medium text-accent/90">ComfyUI directory</h3>
          <p className="mt-2 font-mono text-sm text-slate-300 break-all">
            {NOIRVISION_COMFYUI_DIR}
          </p>
        </div>
        <div className="noir-panel rounded-xl p-4 transition-all duration-200 sm:col-span-2 lg:col-span-1">
          <h3 className="text-sm font-medium text-accent/90">System status</h3>
          <p className="mt-2 text-sm text-accent font-medium">OK</p>
        </div>
        <div className="noir-panel rounded-xl p-4 transition-all duration-200 sm:col-span-2 lg:col-span-3">
          <h3 className="text-sm font-medium text-accent/90 mb-3">ComfyUI</h3>
          <StartComfyUI />
        </div>
      </div>
    </div>
  );
}
