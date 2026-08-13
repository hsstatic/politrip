export function normalizePhone(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

export function isValidPhone(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 8 && digits.length <= 15;
}
