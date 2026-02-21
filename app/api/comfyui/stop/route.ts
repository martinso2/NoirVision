import { NextResponse } from "next/server";
import { execSync } from "child_process";
import { platform } from "os";

const COMFYUI_PORT = process.env.COMFYUI_PORT ?? "8188";

export async function POST() {
  try {
    if (platform() === "win32") {
      let netstatOut: string;
      try {
        netstatOut = execSync(
          `netstat -ano | findstr :${COMFYUI_PORT} | findstr LISTENING`,
          { encoding: "utf-8", windowsHide: true }
        ).trim();
      } catch {
        return NextResponse.json({
          ok: true,
          message: "Nothing was listening on port " + COMFYUI_PORT,
        });
      }
      const lines = netstatOut.split("\n").filter(Boolean);
      const pids = new Set<number>();
      for (const line of lines) {
        const parts = line.trim().split(/\s+/);
        const pid = parts[parts.length - 1];
        if (/^\d+$/.test(pid)) pids.add(parseInt(pid, 10));
      }
      if (pids.size === 0) {
        return NextResponse.json({
          ok: true,
          message: "Nothing was listening on port " + COMFYUI_PORT,
        });
      }
      for (const pid of pids) {
        execSync(`taskkill /PID ${pid} /F`, { windowsHide: true });
      }
      return NextResponse.json({
        ok: true,
        message: "ComfyUI process(es) stopped",
        port: COMFYUI_PORT,
      });
    } else {
      const out = execSync(
        `lsof -ti :${COMFYUI_PORT} 2>/dev/null || true`,
        { encoding: "utf-8" }
      ).trim();
      if (!out) {
        return NextResponse.json({
          ok: true,
          message: "Nothing was listening on port " + COMFYUI_PORT,
        });
      }
      const pids = out.split("\n").filter(Boolean);
      for (const pid of pids) {
        execSync(`kill -9 ${pid}`);
      }
      return NextResponse.json({
        ok: true,
        message: "ComfyUI process(es) stopped",
        port: COMFYUI_PORT,
      });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to stop";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
