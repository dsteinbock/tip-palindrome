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

/**
 * Calculate 20% tip from simplified subtotal
 * @param {number} simplifiedSubtotal - The whole dollar subtotal
 * @returns {number} - The 20% tip amount
 */
export function calculateBaseTip(simplifiedSubtotal) {
    return simplifiedSubtotal / 5;
}
