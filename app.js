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
    console.log('calculate');
}

function handleClear() {
    console.log('clear');
}

// Wire up event listeners
calculateBtn.addEventListener('click', handleCalculate);
clearBtn.addEventListener('click', handleClear);

console.log('App initialized successfully');
