import { clsx, type ClassValue } from 'clsx';
import slugifyPackage from 'slugify';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(value: string) {
  return slugifyPackage(value, {
    lower: true,
    strict: true,
    trim: true,
  }).slice(0, 80);
}
