type ClassValue = string | false | null | undefined

/** Tiny class-name joiner — enough for this project, no runtime dependency. */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(' ')
}
