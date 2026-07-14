"use client";

import { useState } from "react";

/**
 * Hook to copy text to clipboard.
 * Returns copied status and copy function.
 */
export function useCopyToClipboard(): [
  boolean,
  (text: string) => Promise<boolean>
] {
  const [copied, setCopied] = useState(false);

  const copy = async (text: string): Promise<boolean> => {
    if (!navigator?.clipboard) {
      console.warn("Clipboard not supported");
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return true;
    } catch (error) {
      console.warn("Copy failed", error);
      setCopied(false);
      return false;
    }
  };

  return [copied, copy];
}
