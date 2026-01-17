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
 * Calculate tip from simplified subtotal
 * @param {number} simplifiedSubtotal - The whole dollar subtotal
 * @param {number} tipPercent - The tip percentage
 * @returns {number} - The tip amount
 */
export function calculateBaseTip(simplifiedSubtotal, tipPercent) {
    return simplifiedSubtotal * (tipPercent / 100);
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

/**
 * Calculate the palindrome tip amount
 * @param {number} pTotal - The palindrome total
 * @param {number} oTotal - The original total with tax
 * @returns {number} - The palindrome tip amount
 */
export function calculatePalindromeTip(pTotal, oTotal) {
    return pTotal - oTotal;
}

/**
 * Calculate all values for the palindrome tip calculator
 * @param {number} subtotal - The original subtotal
 * @param {number} oTotal - The original total with tax
 * @param {number} tipPercent - The tip percentage
 * @returns {Object} - All calculated values
 */
export function calculateAll(subtotal, oTotal, tipPercent) {
    const simplified = simplifySubtotal(subtotal);
    const baseTip = calculateBaseTip(simplified, tipPercent);
    const tTotal = oTotal + baseTip;
    const pTotal = generatePalindromeTotal(tTotal);
    const pTip = calculatePalindromeTip(pTotal, oTotal);

    return {
        simplified,
        baseTip,
        tTotal,
        pTotal,
        pTip,
        oTotal,
        subtotal,
        tipPercent
    };
}

/**
 * Format a number as currency with 2 decimal places
 * @param {number} value - The value to format
 * @returns {string} - The formatted currency string
 */
export function formatCurrency(value) {
    return value.toFixed(2);
}

/**
 * Format the results in the exact output format
 * @param {number} pTip - The palindrome tip
 * @param {number} pTotal - The palindrome total
 * @param {number} oTotal - The original total with tax
 * @param {number} subtotal - The original subtotal
 * @returns {string} - The formatted results string
 */
export function formatResults(pTip, pTotal, oTotal, subtotal) {
    const tipPercent = (pTip / subtotal) * 100;
    return `Tip = ${formatCurrency(pTip)} (${tipPercent.toFixed(2)}%)
+ ${formatCurrency(oTotal)} = ${formatCurrency(pTotal)}`;
}
