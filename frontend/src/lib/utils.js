// src/lib/utils.js

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind class names safely.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Format a message timestamp like 02:15 PM.
 */
export function formatMessageTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
