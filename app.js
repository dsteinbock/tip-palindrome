// Main application logic
import { calculateAll, formatResults } from './calc.js';

// Validation helpers (exported for testing)

/**
 * Parse money input from string
 * @param {string} raw - Raw input string
 * @returns {number | null} - Parsed number or null if invalid
 */
export function parseMoneyInput(raw) {
    if (!raw || raw.trim() === '') {
        return null;
    }
    const parsed = parseFloat(raw);
    if (isNaN(parsed)) {
        return null;
    }
    return parsed;
}

/**
 * Validate input values
 * @param {string} subtotalRaw - Raw subtotal input
 * @param {string} oTotalRaw - Raw total input
 * @returns {Object} - Validation result with ok, message, focusId
 */
export function validateInputs(subtotalRaw, oTotalRaw) {
    const subtotal = parseMoneyInput(subtotalRaw);
    const oTotal = parseMoneyInput(oTotalRaw);

    // Check for empty subtotal
    if (subtotal === null) {
        return {
            ok: false,
            message: 'Please enter subtotal',
            focusId: 'subtotal-input'
        };
    }

    // Check for empty total
    if (oTotal === null) {
        return {
            ok: false,
            message: 'Please enter total',
            focusId: 'ototal-input'
        };
    }

    // Check for negative subtotal
    if (subtotal < 0) {
        return {
            ok: false,
            message: 'Subtotal cannot be negative',
            focusId: 'subtotal-input'
        };
    }

    // Check for negative total
    if (oTotal < 0) {
        return {
            ok: false,
            message: 'Total cannot be negative',
            focusId: 'ototal-input'
        };
    }

    // Check for zero subtotal
    if (subtotal === 0) {
        return {
            ok: false,
            message: 'Subtotal cannot be zero',
            focusId: 'subtotal-input'
        };
    }

    // Check if total is less than subtotal
    if (oTotal < subtotal) {
        return {
            ok: false,
            message: 'Total should be greater than subtotal',
            focusId: 'ototal-input'
        };
    }

    // All validations passed
    return {
        ok: true,
        message: '',
        focusId: ''
    };
}

// DOM elements
const subtotalInput = document.getElementById('subtotal-input');
const ototalInput = document.getElementById('ototal-input');
const clearBtn = document.getElementById('clear-btn');
const calculateBtn = document.getElementById('calculate-btn');
const resultsArea = document.getElementById('results-area');
const errorArea = document.getElementById('error-area');

// Event handlers
function handleCalculate() {
    // Get raw input values
    const subtotalRaw = subtotalInput.value;
    const oTotalRaw = ototalInput.value;

    // Validate inputs
    const validation = validateInputs(subtotalRaw, oTotalRaw);

    if (!validation.ok) {
        // Show error
        errorArea.textContent = validation.message;
        // Hide results
        resultsArea.style.display = 'none';
        // Focus the problematic input
        document.getElementById(validation.focusId).focus();
        return;
    }

    // Clear any previous errors
    errorArea.textContent = '';

    // Parse values
    const subtotal = parseMoneyInput(subtotalRaw);
    const oTotal = parseMoneyInput(oTotalRaw);

    // Calculate results
    const result = calculateAll(subtotal, oTotal);

    // Format output
    const output = formatResults(result.baseTip, result.pTip, result.pTotal, result.oTotal);

    // Display results
    const resultsText = document.getElementById('results-text');
    resultsText.textContent = output;
    resultsArea.style.display = 'block';
}

function handleClear() {
    // Clear both inputs
    subtotalInput.value = '';
    ototalInput.value = '';

    // Clear error message
    errorArea.textContent = '';

    // Hide results area
    resultsArea.style.display = 'none';
    const resultsText = document.getElementById('results-text');
    resultsText.textContent = '';

    // Focus subtotal input
    subtotalInput.focus();
}

// Wire up event listeners
calculateBtn.addEventListener('click', handleCalculate);
clearBtn.addEventListener('click', handleClear);

// Enter key triggers Calculate in both inputs
subtotalInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleCalculate();
    }
});

ototalInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleCalculate();
    }
});

// Select all text on focus for easy editing
subtotalInput.addEventListener('focus', () => {
    subtotalInput.select();
});

ototalInput.addEventListener('focus', () => {
    ototalInput.select();
});

// Autofocus subtotal input on page load
subtotalInput.focus();

console.log('App initialized successfully');
