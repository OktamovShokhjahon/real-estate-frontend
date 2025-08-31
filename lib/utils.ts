import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Utility function to handle URLs for static export
export function getStaticUrl(path: string): string {
  // For now, always return the path as-is to avoid hydration issues
  // We'll handle .html extensions through Nginx configuration instead
  return path;
}
