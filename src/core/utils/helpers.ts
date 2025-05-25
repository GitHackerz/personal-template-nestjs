/**
 * Checks if a value is null or undefined
 * @param value - The value to check
 * @returns {boolean} True if the value is null or undefined, false otherwise
 * @example
 * isNullOrUndefined(null) // returns true
 * isNullOrUndefined(undefined) // returns true
 * isNullOrUndefined('') // returns false
 */
export const isNullOrUndefined = (value: any): boolean => {
  return value === null || value === undefined;
};

/**
 * Checks if a value is empty (null, undefined, empty string, empty array, or empty object)
 * @param value - The value to check
 * @returns {boolean} True if the value is empty, false otherwise
 * @example
 * isEmpty('') // returns true
 * isEmpty([]) // returns true
 * isEmpty({}) // returns true
 * isEmpty('hello') // returns false
 */
export const isEmpty = (value: any): boolean => {
  if (isNullOrUndefined(value)) return true;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  if (typeof value === 'string') return value.trim().length === 0;
  return false;
};

/**
 * Removes all empty, null, or undefined properties from an object
 * @param obj - The source object
 * @returns {Partial<T>} A new object with all non-empty properties
 * @example
 * removeEmptyProperties({ a: 1, b: '', c: null, d: [] })
 * returns { a: 1 }
 */
export const removeEmptyProperties = <T extends object>(obj: T): Partial<T> => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (!isNullOrUndefined(value) && !isEmpty(value)) {
      acc[key as keyof T] = value;
    }
    return acc;
  }, {} as Partial<T>);
};

/**
 * Creates a promise that resolves after the specified number of milliseconds
 * @param ms - The number of milliseconds to wait
 * @returns {Promise<void>} A promise that resolves after the specified delay
 * @example
 * await sleep(1000) // waits for 1 second
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Generates a random string of specified length containing alphanumeric characters
 * @param length - The desired length of the random string
 * @returns {string} A random string of the specified length
 * @example
 * generateRandomString(8) // might return "Ax7Bd9Yz"
 */
export const generateRandomString = (length: number): string => {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length)),
  ).join('');
};

/**
 * Safely parses a JSON string with a fallback default value
 * @param jsonString - The JSON string to parse
 * @param defaultValue - The default value to return if parsing fails
 * @returns {T} The parsed object or the default value
 * @example
 * tryParseJson('{"a": 1}', {}) // returns { a: 1 }
 * tryParseJson('invalid json', {}) // returns {}
 */
export const tryParseJson = <T>(jsonString: string, defaultValue: T): T => {
  try {
    return JSON.parse(jsonString) as T;
  } catch {
    return defaultValue;
  }
};

/**
 * Creates a debounced version of a function that delays its execution until after
 * the specified wait time has elapsed since the last time it was called
 * @param func - The function to debounce
 * @param wait - The number of milliseconds to wait before executing
 * @returns {Function} The debounced function
 * @example
 * const debouncedSearch = debounce((query) => searchAPI(query), 300)
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Formats a file size in bytes to a human-readable string
 * @param bytes - The size in bytes to format
 * @returns {string} A human-readable string representation of the size
 * @example
 * formatFileSize(1024) // returns "1 KB"
 * formatFileSize(1234567) // returns "1.18 MB"
 */
export const formatFileSize = (bytes: number): string => {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${Math.round(size * 100) / 100} ${units[unitIndex]}`;
};

/**
 * Formats a date into a human-readable string
 * @param date - The date to format
 * @param locale - Optional locale (defaults to 'en-US')
 * @returns {string} Formatted date string
 * @example
 * formatDate(new Date()) // returns "Jan 1, 2024"
 */
export const formatDate = (date: Date, locale = 'en-US'): string => {
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Formats a date and time into a human-readable string
 * @param date the date time to format
 * @param locale - Optional locale (defaults to 'en-US')
 * @returns {string} Formatted date and time string
 *
 * @example
 * formatDateTime(new Date()) // returns "Jan 1, 2024, 12:00:00 PM"
 *
 */
export const formatDateTime = (date: Date, locale = 'en-US'): string => {
  return new Date(date).toLocaleString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  });
};

/**
 * Chunks an array into smaller arrays of specified size
 * @param array - The array to chunk
 * @param size - The size of each chunk
 * @returns {Array} Array of chunks
 * @example
 * chunkArray([1, 2, 3, 4, 5], 2) // returns [[1,2], [3,4], [5]]
 */
export const chunkArray = <T>(array: T[], size: number): T[][] => {
  return Array.from({ length: Math.ceil(array.length / size) }, (_, index) =>
    array.slice(index * size, (index + 1) * size),
  );
};

/**
 * Creates a slug from a string
 * @param str - The string to slugify
 * @returns {string} The slugified string
 * @example
 * slugify("Hello World!") // returns "hello-world"
 */
export const slugify = (str: string): string => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};
