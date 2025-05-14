
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getGradientByRole(role: string | null) {
  if (role === 'teacher') {
    return 'from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30';
  }
  if (role === 'student') {
    return 'from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30';
  }
  return 'from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50';
}

export function formatFileSize(bytes: number | null) {
  if (!bytes) return 'Unknown size';
  const kilobytes = bytes / 1024;
  if (kilobytes < 1024) {
    return `${kilobytes.toFixed(2)} KB`;
  }
  const megabytes = kilobytes / 1024;
  return `${megabytes.toFixed(2)} MB`;
}

export function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}
