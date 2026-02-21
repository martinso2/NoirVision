import { NextResponse } from "next/server";

const COMFYUI_PORT = process.env.COMFYUI_PORT ?? "8188";
const STATUS_URL = `http://127.0.0.1:${COMFYUI_PORT}`;

export async function GET() {
  try {
    const res = await fetch(STATUS_URL, {
      method: "GET",
      signal: AbortSignal.timeout(5000),
      redirect: "follow",
    });
    const running = res.status >= 200 && res.status < 400;
    return NextResponse.json({
      running,
      port: COMFYUI_PORT,
      url: STATUS_URL,
    });
  } catch {
    return NextResponse.json({
      running: false,
      port: COMFYUI_PORT,
      url: STATUS_URL,
    });
  }
}
