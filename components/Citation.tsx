"use client";

import { useEffect, useState } from "react";

import { CITATION } from "@/lib/content";

/**
 * The BibTeX entry, with a button that puts it on the clipboard.
 *
 * The block is selectable either way, so the button is a convenience rather than the only
 * route: if the clipboard API is unavailable, which it is on an insecure origin, the state
 * says so instead of silently doing nothing.
 */
export default function Citation() {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  useEffect(() => {
    if (state === "idle") return;
    const timer = setTimeout(() => setState("idle"), 2000);
    return () => clearTimeout(timer);
  }, [state]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(CITATION);
      setState("copied");
    } catch {
      setState("failed");
    }
  }

  return (
    <div className="cite">
      <button className="cite-copy" type="button" onClick={copy}>
        {state === "copied" ? "Copied" : state === "failed" ? "Select and copy" : "Copy"}
      </button>
      <pre>
        <code>{CITATION}</code>
      </pre>
    </div>
  );
}
