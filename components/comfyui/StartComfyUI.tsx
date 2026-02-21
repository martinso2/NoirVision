"use client";

import { useState, useEffect, useCallback } from "react";

export function StartComfyUI() {
  const [status, setStatus] = useState<{ running: boolean; port: string; url: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/comfyui/status");
      const data = await res.json();
      setStatus(data);
      setError(null);
    } catch {
      setStatus({ running: false, port: "8188", url: "http://127.0.0.1:8188" });
    }
  }, []);

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, [checkStatus]);

  const handleStart = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/comfyui/start", { method: "POST" });
      const data = await res.json();
      if (!data.ok) {
        setError(data.error ?? "Failed to start");
        return;
      }
      setStatus((s) => (s ? { ...s, running: false } : null));
      // ComfyUI can take 10–30s to bind; poll every 2s for up to 45s
      let attempts = 0;
      const maxAttempts = 23;
      const poll = () => {
        attempts += 1;
        checkStatus();
        if (attempts < maxAttempts) setTimeout(poll, 2000);
      };
      setTimeout(poll, 3000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 w-full">
      <p className="text-accent/90 text-sm mb-1">Connect to ComfyUI</p>
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <button
          type="button"
          onClick={handleStart}
          disabled={loading}
          className="rounded-lg bg-accent/20 text-accent border border-accent/40 px-4 py-2 text-sm font-medium hover:bg-accent/30 disabled:opacity-50 transition-colors"
        >
          {loading ? "Starting…" : "Start ComfyUI"}
        </button>
        {status && (
          <span className="text-sm text-slate-400">
            {status.running ? (
              <>
                <span className="text-accent">Running</span>
                {" · "}
                <a
                  href={status.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent/90 hover:underline"
                >
                  Open ComfyUI →
                </a>
              </>
            ) : (
              <span className="text-slate-500">Not running</span>
            )}
          </span>
        )}
      </div>
      {error && (
        <p className="text-red-400/90 text-xs max-w-md text-center">{error}</p>
      )}
      <p className="text-slate-500 text-xs">Runs at {status?.url ?? "http://127.0.0.1:8188"} (default port)</p>
    </div>
  );
}
