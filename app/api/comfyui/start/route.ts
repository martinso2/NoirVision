import { NextResponse } from "next/server";
import path from "path";
import { spawn } from "child_process";

// ComfyUI lives in a different directory than NoirVision. Prefer env so it works wherever ComfyUI is.
const COMFYUI_DIR =
  process.env.NOIRVISION_COMFYUI_DIR ?? path.join(process.cwd(), "..", "ComfyUI");
const COMFYUI_PORT = process.env.COMFYUI_PORT ?? "8188";
const COMFYUI_CPU = process.env.COMFYUI_CPU === "1" || process.env.COMFYUI_CPU === "true";

const LOG_DIR = path.join(process.cwd(), "logs");
const STARTUP_LOG_FILE = path.join(LOG_DIR, "comfyui-startup.log");
let startupLogStream: import("fs").WriteStream | null = null;

export async function POST() {
  // Resolve to an absolute path (e.g. D:\AI\ComfyUI) so we always run from the real ComfyUI folder
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

  const args = ["main.py", "--port", COMFYUI_PORT];
  if (COMFYUI_CPU) args.push("--cpu");

  const pythonExeForSpawn = fs.existsSync(venvPython) ? venvPython : pythonExe;

  const spawnWithLogging = () => {
    if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });
    if (startupLogStream) {
      try { startupLogStream.end(); } catch { /* ignore */ }
      startupLogStream = null;
    }
    startupLogStream = fs.createWriteStream(STARTUP_LOG_FILE, { flags: "w" });
    startupLogStream.write(`[NoirVision] ComfyUI starting at ${new Date().toISOString()}\n`);
    startupLogStream.write(`[NoirVision] ${pythonExeForSpawn} ${args.join(" ")}\n\n`);

    const child = spawn(pythonExeForSpawn, args, {
      cwd: comfyDir,
      detached: true,
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env },
      windowsHide: true,
    });
    if (child.stdout) child.stdout.pipe(startupLogStream, { end: false });
    if (child.stderr) child.stderr.pipe(startupLogStream, { end: false });
    child.unref();
  };

  const spawnWithoutLogging = () => {
    const child = spawn(pythonExeForSpawn, args, {
      cwd: comfyDir,
      detached: true,
      stdio: "ignore",
      env: { ...process.env },
      windowsHide: true,
    });
    child.unref();
  };

  try {
    try {
      spawnWithLogging();
    } catch {
      spawnWithoutLogging();
    }
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
