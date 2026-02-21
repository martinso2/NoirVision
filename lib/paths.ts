/**
 * Paths for models and ComfyUI. Read from env when set, otherwise use defaults.
 * These will be configurable later.
 */
export const NOIRVISION_MODELS_DIR =
  process.env.NOIRVISION_MODELS_DIR ?? "../models";
export const NOIRVISION_COMFYUI_DIR =
  process.env.NOIRVISION_COMFYUI_DIR ?? "../ComfyUI";
