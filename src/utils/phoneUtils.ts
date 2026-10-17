/**
 * Phone and WhatsApp utility functions for Kulasai Dasara Festival 2026 Portal
 * Formats numbers for safe mobile dialler triggers and WhatsApp click-to-chat.
 */

/**
 * Strips all non-digit characters from a phone number string
 */
export function cleanDigits(phone: string | number | undefined | null): string {
  if (!phone) return '';
  return String(phone).replace(/\D/g, '');
}

/**
 * Returns a standardized tel: URI suitable for opening the mobile dialler without auto-calling.
 * Preserves toll-free 1800 format or Indian mobile format with +91.
 */
export function getTelUri(phone: string | number | undefined | null): string {
  if (!phone) return '';
  const digits = cleanDigits(phone);
  if (!digits) return '';

  // Toll-Free numbers (e.g. 1800 425 1077)
  if (digits.startsWith('1800')) {
    return `tel:${digits}`;
  }

  // 10-digit Indian mobile or landline without country code
  if (digits.length === 10) {
    return `tel:+91${digits}`;
  }

  // Already prefixed with 91 (12 digits)
  if (digits.length === 12 && digits.startsWith('91')) {
    return `tel:+${digits}`;
  }

  // Already has leading 0 (STD code)
  if (digits.startsWith('0') && digits.length === 11) {
    return `tel:+91${digits.slice(1)}`;
  }

  return `tel:${digits}`;
}

/**
 * Formats phone number for official display (e.g. +91 94450 00480 or 1800 425 1077)
 */
export function formatDisplayPhone(phone: string | number | undefined | null): string {
  if (!phone) return '';
  const str = String(phone).trim();
  const digits = cleanDigits(str);

  if (digits.startsWith('1800') && digits.length >= 10) {
    return `1800 ${digits.slice(4, 7)} ${digits.slice(7)}`;
  }

  if (digits.length === 10) {
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  }

  if (digits.length === 12 && digits.startsWith('91')) {
    const main = digits.slice(2);
    return `+91 ${main.slice(0, 5)} ${main.slice(5)}`;
  }

  return str;
}

/**
 * Generates an official WhatsApp click-to-chat link (https://wa.me/91XXXXXXXXXX)
 * Strictly removes spaces, dashes, brackets, and ensures single country code 91.
 * Returns null if the number is invalid, toll-free, or missing.
 */
export function getWhatsAppUri(phone: string | number | undefined | null): string | null {
  if (!phone) return null;
  const digits = cleanDigits(phone);

  // Toll free numbers don't support WhatsApp
  if (digits.startsWith('1800') || digits.length < 10) {
    return null;
  }

  let finalNumber = '';

  if (digits.length === 10) {
    finalNumber = `91${digits}`;
  } else if (digits.length === 12 && digits.startsWith('91')) {
    finalNumber = digits;
  } else if (digits.startsWith('0') && digits.length === 11) {
    finalNumber = `91${digits.slice(1)}`;
  } else {
    // If not standard 10 or 12 digit, treat cautiously
    finalNumber = digits;
  }

  // Return standard WhatsApp click-to-chat link
  return `https://wa.me/${finalNumber}`;
}

/**
 * Validates whether a phone number string has sufficient digits to be callable.
 */
export function isValidPhoneNumber(phone: string | number | undefined | null): boolean {
  if (!phone) return false;
  const digits = cleanDigits(phone);
  return digits.length >= 7;
}
