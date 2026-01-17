// Main application logic
import { calculateAll, formatResults } from './calc.js';

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
