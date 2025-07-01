import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

// Utility function for conditional classNames (used by shadcn/ui)
export function cn(...args) {
  return args.filter(Boolean).join(' ');
}
