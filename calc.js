/**
 * Pure calculation functions for the Palindrome Tip Calculator
 * All functions are side-effect free and testable
 */

/**
 * Simplify subtotal by truncating cents
 * @param {number} subtotal - The subtotal amount
 * @returns {number} - The truncated whole dollar amount
 */
export function simplifySubtotal(subtotal) {
    return Math.floor(subtotal);
}
