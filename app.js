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
export function validateInputs(subtotalRaw, oTotalRaw, tipRaw) {
    const subtotal = parseMoneyInput(subtotalRaw);
    const oTotal = parseMoneyInput(oTotalRaw);
    const tipPercent = parseMoneyInput(tipRaw);

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

    if (tipPercent === null) {
        return {
            ok: false,
            message: 'Please enter tip %',
            focusId: 'tip-input'
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

    if (tipPercent < 0) {
        return {
            ok: false,
            message: 'Tip % cannot be negative',
            focusId: 'tip-input'
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
const tipInput = document.getElementById('tip-input');
const clearBtn = document.getElementById('clear-btn');
const calculateBtn = document.getElementById('calculate-btn');
const resultsArea = document.getElementById('results-area');
const errorArea = document.getElementById('error-area');
const installBtn = document.getElementById('install-btn');
let deferredInstallPrompt = null;

// Event handlers
function handleCalculate() {
    // Get raw input values
    const subtotalRaw = subtotalInput.value;
    const oTotalRaw = ototalInput.value;
    const tipRaw = tipInput.value;

    // Validate inputs
    const validation = validateInputs(subtotalRaw, oTotalRaw, tipRaw);

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
    const tipPercent = parseMoneyInput(tipRaw);

    // Calculate results
    const result = calculateAll(subtotal, oTotal, tipPercent);

    // Format output
    const output = formatResults(result.pTip, result.pTotal, result.oTotal, result.subtotal);

    // Display results
    const resultsText = document.getElementById('results-text');
    resultsText.textContent = output;
    resultsArea.style.display = 'block';
}

function handleClear() {
    // Clear both inputs
    subtotalInput.value = '';
    ototalInput.value = '';
    tipInput.value = '20';

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

tipInput.addEventListener('keypress', (e) => {
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

tipInput.addEventListener('focus', () => {
    tipInput.select();
});

// Autofocus subtotal input on page load
subtotalInput.focus();

if (installBtn) {
    installBtn.addEventListener('click', async () => {
        if (!deferredInstallPrompt) {
            return;
        }
        installBtn.disabled = true;
        deferredInstallPrompt.prompt();
        await deferredInstallPrompt.userChoice;
        deferredInstallPrompt = null;
        installBtn.style.display = 'none';
        installBtn.disabled = false;
    });
}

window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
    if (installBtn) {
        installBtn.style.display = 'inline-flex';
    }
});

window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
    if (installBtn) {
        installBtn.style.display = 'none';
    }
});

// Register service worker for offline support
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js')
            .then((registration) => {
                console.log('ServiceWorker registered:', registration.scope);
            })
            .catch((error) => {
                console.log('ServiceWorker registration failed:', error);
            });
    });
}

console.log('App initialized successfully');
