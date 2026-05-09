import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMoney(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export function absoluteUrl(path: string): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return new URL(path, process.env.NEXT_PUBLIC_APP_URL).toString();
  }

  return path;
}
