// Simple test harness for browser-based testing
import { simplifySubtotal, calculateBaseTip, generatePalindromeTotal, calculateAll } from './calc.js';

let testsPassed = 0;
let testsFailed = 0;
const output = [];

/**
 * Run a test
 * @param {string} name - Test name
 * @param {Function} fn - Test function
 */
function test(name, fn) {
    try {
        fn();
        testsPassed++;
        output.push(`✓ PASS: ${name}`);
    } catch (error) {
        testsFailed++;
        output.push(`✗ FAIL: ${name}`);
        output.push(`  ${error.message}`);
    }
}

/**
 * Assert two values are equal
 * @param {*} actual - Actual value
 * @param {*} expected - Expected value
 * @param {string} message - Optional message
 */
function assertEqual(actual, expected, message = '') {
    if (actual !== expected) {
        const msg = message || `Expected ${expected}, got ${actual}`;
        throw new Error(msg);
    }
}

/**
 * Assert two numbers are close within epsilon
 * @param {number} actual - Actual value
 * @param {number} expected - Expected value
 * @param {number} epsilon - Tolerance (default 0.0001)
 * @param {string} message - Optional message
 */
function assertClose(actual, expected, epsilon = 0.0001, message = '') {
    const diff = Math.abs(actual - expected);
    if (diff > epsilon) {
        const msg = message || `Expected ${expected} ± ${epsilon}, got ${actual} (diff: ${diff})`;
        throw new Error(msg);
    }
}

// Smoke test
test('Smoke test: 1 equals 1', () => {
    assertEqual(1, 1);
});

// Simplify Subtotal tests
test('simplifySubtotal: 35.23 -> 35', () => {
    assertEqual(simplifySubtotal(35.23), 35);
});

test('simplifySubtotal: 35.00 -> 35', () => {
    assertEqual(simplifySubtotal(35.00), 35);
});

test('simplifySubtotal: 35.99 -> 35', () => {
    assertEqual(simplifySubtotal(35.99), 35);
});

test('simplifySubtotal: 0.99 -> 0', () => {
    assertEqual(simplifySubtotal(0.99), 0);
});

test('simplifySubtotal: 100.50 -> 100', () => {
    assertEqual(simplifySubtotal(100.50), 100);
});

// Base Tip tests
test('calculateBaseTip: 35 -> 7.00', () => {
    assertClose(calculateBaseTip(35), 7.00);
});

test('calculateBaseTip: 50 -> 10.00', () => {
    assertClose(calculateBaseTip(50), 10.00);
});

test('calculateBaseTip: 17 -> 3.40', () => {
    assertClose(calculateBaseTip(17), 3.40);
});

test('calculateBaseTip: 0 -> 0.00', () => {
    assertClose(calculateBaseTip(0), 0.00);
});

test('calculateBaseTip: 1 -> 0.20', () => {
    assertClose(calculateBaseTip(1), 0.20);
});

// Palindrome Generation tests
test('generatePalindromeTotal: 48.12 -> 48.84', () => {
    assertClose(generatePalindromeTotal(48.12), 48.84);
});

test('generatePalindromeTotal: 7.00 -> 7.70', () => {
    assertClose(generatePalindromeTotal(7.00), 7.70);
});

test('generatePalindromeTotal: 10.00 -> 10.01', () => {
    assertClose(generatePalindromeTotal(10.00), 10.01);
});

test('generatePalindromeTotal: 99.00 -> 99.99', () => {
    assertClose(generatePalindromeTotal(99.00), 99.99);
});

test('generatePalindromeTotal: 100.00 -> 100.00', () => {
    assertClose(generatePalindromeTotal(100.00), 100.00);
});

test('generatePalindromeTotal: 123.45 -> 123.32', () => {
    assertClose(generatePalindromeTotal(123.45), 123.32);
});

test('generatePalindromeTotal: 9.50 -> 9.90', () => {
    assertClose(generatePalindromeTotal(9.50), 9.90);
});

// End-to-End Calculation tests
test('calculateAll: subtotal 35.23, oTotal 41.12', () => {
    const result = calculateAll(35.23, 41.12);
    assertClose(result.baseTip, 7.00);
    assertClose(result.pTotal, 48.84);
    assertClose(result.pTip, 7.72);
});

test('calculateAll: subtotal 50.00, oTotal 55.00', () => {
    const result = calculateAll(50.00, 55.00);
    assertClose(result.baseTip, 10.00);
    assertClose(result.pTotal, 65.56);
    assertClose(result.pTip, 10.56);
});

test('calculateAll: subtotal 25.75, oTotal 28.50', () => {
    const result = calculateAll(25.75, 28.50);
    assertClose(result.baseTip, 5.00);
    assertClose(result.pTotal, 33.33);
    assertClose(result.pTip, 4.83);
});

test('calculateAll: subtotal 10.00, oTotal 11.00', () => {
    const result = calculateAll(10.00, 11.00);
    assertClose(result.baseTip, 2.00);
    assertClose(result.pTotal, 13.31);
    assertClose(result.pTip, 2.31);
});

test('calculateAll: subtotal 5.50, oTotal 6.00', () => {
    const result = calculateAll(5.50, 6.00);
    assertClose(result.baseTip, 1.00);
    assertClose(result.pTotal, 7.70);
    assertClose(result.pTip, 1.70);
});

// Display results
function displayResults() {
    const outputEl = document.getElementById('test-output');
    if (outputEl) {
        const summary = `\n${'='.repeat(50)}\nTests: ${testsPassed + testsFailed} | Passed: ${testsPassed} | Failed: ${testsFailed}\n${'='.repeat(50)}\n\n`;
        outputEl.textContent = output.join('\n') + summary;
    }
}

// Run after module loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', displayResults);
} else {
    displayResults();
}
