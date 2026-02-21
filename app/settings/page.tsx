import { NOIRVISION_MODELS_DIR, NOIRVISION_COMFYUI_DIR } from "@/lib/paths";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white">
        Settings <span className="text-accent/80 font-normal">paths & config</span>
      </h2>
      <div className="noir-panel rounded-xl p-6 max-w-2xl space-y-4 transition-all duration-200">
        <div>
          <h3 className="text-sm font-medium text-accent/90">Models directory</h3>
          <p className="mt-1 font-mono text-sm text-slate-300 break-all">
            {NOIRVISION_MODELS_DIR}
          </p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-accent/90">ComfyUI directory</h3>
          <p className="mt-1 font-mono text-sm text-slate-300 break-all">
            {NOIRVISION_COMFYUI_DIR}
          </p>
        </div>
        <p className="text-slate-500 text-sm pt-2 border-t border-noir-600/80">
          These paths are read-only for now. They will be configurable later.
        </p>
      </div>
    </div>
  );
}
