export function isValidPhone(value: string) {
  return /^\d{10}$/.test(value.trim());
}

export function isValidAadhaar(value: string) {
  return /^\d{12}$/.test(value.trim());
}

export function isValidDate(value: string) {
  if (!value) return false;
  const date = new Date(value);
  return !Number.isNaN(date.getTime());
}

export function isPositiveNumber(value: string) {
  const num = Number(value);
  return Number.isFinite(num) && num > 0;
}

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}
