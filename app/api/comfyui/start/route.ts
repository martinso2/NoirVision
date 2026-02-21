import { NextResponse } from "next/server";
import path from "path";
import { spawn } from "child_process";

const COMFYUI_DIR =
  process.env.NOIRVISION_COMFYUI_DIR ?? path.join(process.cwd(), "..", "ComfyUI");
const COMFYUI_PORT = process.env.COMFYUI_PORT ?? "8188";

export async function POST() {
  const comfyDir = path.isAbsolute(COMFYUI_DIR)
    ? COMFYUI_DIR
    : path.resolve(process.cwd(), COMFYUI_DIR);

  const fs = await import("fs");
  // Use pythonw.exe on Windows to avoid a console window popping up
  const venvPythonw = path.join(comfyDir, "venv", "Scripts", "pythonw.exe");
  const venvPython = path.join(comfyDir, "venv", "Scripts", "python.exe");
  const venvPythonAlt = path.join(comfyDir, "venv", "bin", "python"); // Unix

  const pythonExe =
    fs.existsSync(venvPythonw) ? venvPythonw
    : fs.existsSync(venvPython) ? venvPython
    : fs.existsSync(venvPythonAlt) ? venvPythonAlt
    : "python";

  const mainPy = path.join(comfyDir, "main.py");
  if (!fs.existsSync(mainPy)) {
    return NextResponse.json(
      {
        ok: false,
        error: `ComfyUI not found at ${comfyDir}. Set NOIRVISION_COMFYUI_DIR in .env.local to the full path (e.g. D:\\AI\\ComfyUI).`,
        resolvedPath: comfyDir,
      },
      { status: 400 }
    );
  }

  try {
    const child = spawn(pythonExe, ["main.py", "--port", COMFYUI_PORT], {
      cwd: comfyDir,
      detached: true,
      stdio: "ignore",
      env: { ...process.env },
      windowsHide: true,
    });
    child.unref();
    return NextResponse.json({
      ok: true,
      message: "ComfyUI start requested",
      port: COMFYUI_PORT,
      url: `http://127.0.0.1:${COMFYUI_PORT}`,
      resolvedPath: comfyDir,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to start ComfyUI";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
