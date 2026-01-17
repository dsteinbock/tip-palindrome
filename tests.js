// Simple test harness for browser-based testing
let testsPassed = 0;
let testsFailed = 0;
const output = [];

/**
 * Run a test
 * @param {string} name - Test name
 * @param {Function} fn - Test function
 */
export function test(name, fn) {
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
export function assertEqual(actual, expected, message = '') {
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
export function assertClose(actual, expected, epsilon = 0.0001, message = '') {
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
