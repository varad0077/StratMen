import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes with conflict resolution.
 * @param  {...any} inputs - Class names to merge.
 * @returns {string} - Merged class string.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date string to a readable format.
 * @param {string} dateString - ISO date string.
 * @returns {string} - Formatted date (e.g., "Jan 15, 2025").
 */
export function formatDate(dateString) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format a date string to relative time (e.g., "2 hours ago").
 * @param {string} dateString - ISO date string.
 * @returns {string} - Relative time string.
 */
export function formatRelativeTime(dateString) {
  if (!dateString) return '';

  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return formatDate(dateString);
}

/**
 * Truncate text to a maximum length with ellipsis.
 * @param {string} text - The text to truncate.
 * @param {number} maxLength - Maximum character length.
 * @returns {string} - Truncated text.
 */
export function truncateText(text, maxLength = 150) {
  if (!text || text.length <= maxLength) return text || '';
  return text.slice(0, maxLength).trim() + '…';
}

/**
 * Get user initials from full name.
 * @param {string} name - Full name.
 * @returns {string} - Initials (e.g., "VP" from "Varad Pimpalkhare").
 */
export function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
}

/**
 * Copy text to clipboard with error handling.
 * @param {string} text - Text to copy.
 * @returns {Promise<boolean>} - Whether the copy was successful.
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}
