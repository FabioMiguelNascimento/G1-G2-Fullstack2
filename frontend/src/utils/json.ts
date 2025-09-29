export function parseJsonField<T = any>(value: any, defaultValue: T = [] as T): T {
  if (!value) return defaultValue;
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch (e) {
      console.error('Error parsing JSON field:', e);
      return defaultValue;
    }
  }
  return value;
}