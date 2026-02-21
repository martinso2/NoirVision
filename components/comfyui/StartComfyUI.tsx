"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export function StartComfyUI() {
  const [status, setStatus] = useState<{ running: boolean; port: string; url: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [stopping, setStopping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [startupLog, setStartupLog] = useState("");
  const [showLog, setShowLog] = useState(false);
  const [logExiting, setLogExiting] = useState(false);
  const [logEntered, setLogEntered] = useState(false);
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const logPollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const justStoppedRef = useRef(false);

  const checkStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/comfyui/status");
      const data = await res.json();
      setStatus(data);
      setError(null);
      if (data.running === false && justStoppedRef.current) {
        justStoppedRef.current = false;
        setStartupLog((prev) => (prev ? `${prev}\n\nComfyUI stopped.` : "ComfyUI stopped."));
      }
      return data;
    } catch {
      setStatus({ running: false, port: "8188", url: "http://127.0.0.1:8188" });
      return { running: false };
    }
  }, []);

  const fetchStartupLog = useCallback(async () => {
    try {
      const res = await fetch("/api/comfyui/logs");
      const data = await res.json();
      if (data.log) setStartupLog(data.log);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    checkStatus();
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      if (logPollRef.current) clearInterval(logPollRef.current);
    };
  }, [checkStatus]);

  useEffect(() => {
    if (showLog && !logExiting) {
      const t = requestAnimationFrame(() => setLogEntered(true));
      return () => cancelAnimationFrame(t);
    }
    if (!showLog) setLogEntered(false);
  }, [showLog, logExiting]);

  useEffect(() => {
    if (status?.running && showLog && !logExiting) {
      setLogExiting(true);
      const t = setTimeout(() => {
        setLogExiting(false);
        setShowLog(false);
      }, 350);
      return () => clearTimeout(t);
    }
  }, [status?.running, showLog, logExiting]);

  const handleStart = async () => {
    setLoading(true);
    setError(null);
    setStartupLog("");
    setShowLog(true);
    setLogEntered(false);
    setLogExiting(false);
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
    if (logPollRef.current) {
      clearInterval(logPollRef.current);
      logPollRef.current = null;
    }
    try {
      const res = await fetch("/api/comfyui/start", { method: "POST" });
      const data = await res.json();
      if (!data.ok) {
        setError(data.error ?? "Failed to start");
        return;
      }
      setStatus((s) => (s ? { ...s, running: false } : null));
      logPollRef.current = setInterval(fetchStartupLog, 1500);
      fetchStartupLog();
      let attempts = 0;
      const maxAttempts = 12;
      const doPoll = async () => {
        const result = await checkStatus();
        attempts += 1;
        if (result.running || attempts >= maxAttempts) {
          if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current);
            pollIntervalRef.current = null;
          }
          if (logPollRef.current) {
            clearInterval(logPollRef.current);
            logPollRef.current = null;
          }
          fetchStartupLog();
        }
      };
      pollIntervalRef.current = setInterval(doPoll, 5000);
      doPoll();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed");
    } finally {
      setLoading(false);
    }
  };

  const handleStop = async () => {
    setStopping(true);
    setError(null);
    justStoppedRef.current = true;
    setStartupLog("Stopping ComfyUI…");
    setShowLog(true);
    setLogEntered(false);
    setLogExiting(false);
    try {
      const res = await fetch("/api/comfyui/stop", { method: "POST" });
      const data = await res.json();
      if (!data.ok) {
        setError(data.error ?? "Failed to stop");
        justStoppedRef.current = false;
        return;
      }
      await checkStatus();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed");
      justStoppedRef.current = false;
    } finally {
      setStopping(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 w-full">
      <p className="text-accent/90 text-sm mb-1">Connect to ComfyUI</p>
      <div className="flex flex-col sm:flex-row items-center gap-3 flex-wrap">
        {!status?.running && (
          <button
            type="button"
            onClick={handleStart}
            disabled={loading}
            className="rounded-lg bg-accent/20 text-accent border border-accent/40 px-4 py-2 text-sm font-medium hover:bg-accent/30 disabled:opacity-50 transition-colors"
          >
            {loading ? "Starting…" : "Start ComfyUI"}
          </button>
        )}
        {status?.running && (
          <button
            type="button"
            onClick={handleStop}
            disabled={stopping}
            className="rounded-lg bg-red-500/20 text-red-400 border border-red-500/40 px-4 py-2 text-sm font-medium hover:bg-red-500/30 disabled:opacity-50 transition-colors"
          >
            {stopping ? "Stopping…" : "Stop ComfyUI"}
          </button>
        )}
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
      {showLog && (
        <div
          className={`w-full max-w-2xl transition-all duration-300 ease-in-out overflow-hidden ${
            logExiting
              ? "max-h-0 opacity-0"
              : logEntered
                ? "max-h-[6.5rem] opacity-100"
                : "max-h-0 opacity-0"
          }`}
        >
          <p className="text-accent/80 text-xs font-medium mb-1">Startup log</p>
          <pre className="noir-panel rounded-lg p-3 text-xs text-slate-400 font-mono h-[3.75rem] overflow-x-auto overflow-y-auto text-left whitespace-pre-wrap break-words leading-tight">
            {startupLog || "Waiting for output…"}
          </pre>
        </div>
      )}
      <p className="text-slate-500 text-xs">Runs at {status?.url ?? "http://127.0.0.1:8188"} (default port)</p>
    </div>
  );
}
