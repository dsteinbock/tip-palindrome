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

/**
 * Generate palindrome total from tentative total
 * @param {number} tTotal - The tentative total (oTotal + baseTip)
 * @returns {number} - The palindrome total
 */
export function generatePalindromeTotal(tTotal) {
    const dollars = Math.floor(tTotal);
    const dollarStr = String(dollars);
    const reversed = dollarStr.split('').reverse().join('');

    let cents;
    if (reversed.length === 1) {
        // Single digit: add trailing zero (e.g., "7" -> "70")
        cents = reversed + '0';
    } else {
        // Two or more digits: take first 2 (e.g., "84" -> "84", "321" -> "32")
        cents = reversed.substring(0, 2);
    }

    return parseFloat(`${dollars}.${cents}`);
}
